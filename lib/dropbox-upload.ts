/**
 * Direct browser -> Dropbox uploads (no Next/Vercel route in the data path).
 *
 * - Every file goes through an upload session (start / append_v2 / finish),
 *   so there is no 150 MB single-request limit and progress is byte-accurate.
 * - The first chunk is sent with upload_session/start, which saves one round
 *   trip per file compared to starting with an empty body.
 * - Each request is retried with exponential backoff on network errors,
 *   429 and 5xx. If Dropbox already received a chunk (incorrect_offset), the
 *   offset it reports is used instead of failing.
 * - Uploads can be aborted with an AbortSignal.
 */

export const DROPBOX_CHUNK_SIZE = 32 * 1024 * 1024; // multiple of 4 MB, Dropbox max is 150 MB
const MAX_ATTEMPTS = 4;

export class UploadAbortedError extends Error {
  constructor() {
    super("Upload cancelled");
    this.name = "UploadAbortedError";
  }
}

class HttpError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(body || `Upload failed with status ${status}`);
  }
}

// Helper function to sanitize strings for Dropbox API (removes all non-ASCII characters)
export const sanitizeForDropbox = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x00-\x7F]/g, "_")
    .replace(/[^\w\s.-]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new UploadAbortedError());
      },
      { once: true },
    );
  });

// XHR wrapper exposing upload.onprogress (fetch() gives no upload progress)
function xhrPost(
  url: string,
  headers: Record<string, string>,
  body: Blob,
  onProgress: (loaded: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new UploadAbortedError());
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    Object.entries(headers).forEach(([key, value]) =>
      xhr.setRequestHeader(key, value),
    );
    xhr.upload.onprogress = (e) => onProgress(e.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
      else reject(new HttpError(xhr.status, xhr.responseText));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => reject(new UploadAbortedError());
    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(body);
  });
}

const isRetryable = (error: unknown) =>
  !(error instanceof UploadAbortedError) &&
  (!(error instanceof HttpError) || error.status === 429 || error.status >= 500);

async function withRetry<T>(
  run: () => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === MAX_ATTEMPTS) break;
      let delay = 1000 * 2 ** (attempt - 1);
      if (error instanceof HttpError && error.status === 429) {
        try {
          const retryAfter = JSON.parse(error.body)?.error?.retry_after;
          if (typeof retryAfter === "number") delay = retryAfter * 1000;
        } catch {}
      }
      await sleep(delay, signal);
    }
  }
  throw lastError;
}

// Dropbox answers 409 incorrect_offset when it already has the bytes
// (e.g. the response of a successful append was lost). Returns its offset.
function correctOffset(error: unknown): number | null {
  if (!(error instanceof HttpError) || error.status !== 409) return null;
  try {
    const value = JSON.parse(error.body)?.error?.correct_offset;
    return typeof value === "number" ? value : null;
  } catch {
    return null;
  }
}

export interface UploadOptions {
  token: string;
  /** Full Dropbox path, e.g. /01_uploads/folder/file.wav */
  path: string;
  /** Bytes of this file confirmed or in flight */
  onProgress?: (loadedBytes: number) => void;
  signal?: AbortSignal;
}

export async function uploadToDropbox(
  file: Blob,
  { token, path, onProgress, signal }: UploadOptions,
): Promise<void> {
  const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" };
  const report = (base: number) => (loaded: number) =>
    onProgress?.(Math.min(file.size, base + loaded));

  const firstChunk = file.slice(0, DROPBOX_CHUNK_SIZE);
  const isSingleChunk = file.size <= DROPBOX_CHUNK_SIZE;

  // Start the session with the first chunk (and close it if it is the only one)
  const startBody = await withRetry(
    () =>
      xhrPost(
        "https://content.dropboxapi.com/2/files/upload_session/start",
        { ...auth, "Dropbox-API-Arg": JSON.stringify({ close: isSingleChunk }) },
        firstChunk,
        report(0),
        signal,
      ),
    signal,
  );
  const sessionId: string = JSON.parse(startBody).session_id;
  let offset = firstChunk.size;

  // Middle chunks
  while (file.size - offset > DROPBOX_CHUNK_SIZE) {
    const chunk = file.slice(offset, offset + DROPBOX_CHUNK_SIZE);
    const chunkOffset = offset;
    try {
      await withRetry(
        () =>
          xhrPost(
            "https://content.dropboxapi.com/2/files/upload_session/append_v2",
            {
              ...auth,
              "Dropbox-API-Arg": JSON.stringify({
                cursor: { session_id: sessionId, offset: chunkOffset },
              }),
            },
            chunk,
            report(chunkOffset),
            signal,
          ),
        signal,
      );
      offset += chunk.size;
    } catch (error) {
      const fixed = correctOffset(error);
      if (fixed === null || fixed <= chunkOffset) throw error;
      offset = fixed;
    }
  }

  // Last chunk + commit (empty body when the file fit in the start request)
  const lastChunk = isSingleChunk ? new Blob([]) : file.slice(offset);
  const lastOffset = offset;
  await withRetry(
    () =>
      xhrPost(
        "https://content.dropboxapi.com/2/files/upload_session/finish",
        {
          ...auth,
          "Dropbox-API-Arg": JSON.stringify({
            cursor: { session_id: sessionId, offset: lastOffset },
            commit: { path, mode: "add", autorename: true, mute: false },
          }),
        },
        lastChunk,
        report(lastOffset),
        signal,
      ),
    signal,
  );
  onProgress?.(file.size);
}

export async function getDropboxUploadToken(): Promise<string> {
  const response = await fetch("/api/dropbox-token");
  if (!response.ok) throw new Error("Failed to get Dropbox token");
  const { accessToken } = await response.json();
  return accessToken;
}

export async function createDropboxFolder(token: string, path: string): Promise<void> {
  const response = await withRetry(async () => {
    const res = await fetch("https://api.dropboxapi.com/2/files/create_folder_v2", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ path, autorename: false }),
    });
    if (res.status === 429 || res.status >= 500) throw new HttpError(res.status, await res.text());
    return res;
  });
  // 409 = folder already exists
  if (!response.ok && response.status !== 409) {
    throw new Error(`Failed to create folder: ${await response.text()}`);
  }
}

/**
 * Runs uploads with limited concurrency. Rejects on the first failure; the
 * caller aborts the remaining uploads through its AbortController.
 */
export async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  const queue = [...items];
  const runNext = async (): Promise<void> => {
    const item = queue.shift();
    if (item === undefined) return;
    await worker(item);
    await runNext();
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runNext));
}
