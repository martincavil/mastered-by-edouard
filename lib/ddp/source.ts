/**
 * Builds a name -> Blob index of the DDP files, from a folder, loose files or
 * a .zip, without ever loading the whole archive in memory.
 *
 * Zip: zip.js (@zip.js/zip.js) reads only the central directory through
 * Blob.slice (random access), handles Zip64 (> 4 GB, many entries) and uses
 * the native DecompressionStream when available, with its own codec as a
 * fallback (older Safari). fflate's streaming Unzip, by contrast, has to read
 * the archive sequentially from the start, and has no random access, which
 * is what we need to seek in a 700 MB image.
 *  - STORED entries (no compression, the usual case for DDP since PCM barely
 *    compresses): the entry is a lazy Blob.slice of the zip itself. Zero copy,
 *    instant random access for playback, seeking and MD5.
 *  - DEFLATED entries: decompressed once, as a stream, into the Origin
 *    Private File System when available (disk, not RAM), else into a Blob
 *    built from chunks (browsers can page large Blobs to disk).
 */

import type { DdpFiles } from "./parse";

export const MAX_ZIP_SIZE = 1.5 * 1024 * 1024 * 1024; // 1.5 GB

export class DdpSourceError extends Error {
  constructor(
    public code: "too-large" | "empty" | "bad-zip" | "encrypted",
    detail?: string,
  ) {
    super(detail ? `${code}: ${detail}` : code);
    this.name = "DdpSourceError";
  }
}

export interface DdpSource extends DdpFiles {
  names: string[];
  /** Human readable origin, e.g. "album.zip" or "DDP folder" */
  label: string;
  dispose: () => Promise<void>;
}

const baseName = (path: string) => path.split(/[\\/]/).pop() ?? path;

function indexBlobs(entries: { path: string; blob: Blob }[], label: string, dispose = async () => {}): DdpSource {
  // Ignore macOS metadata and hidden files
  const usable = entries.filter(
    (e) => !e.path.includes("__MACOSX/") && !baseName(e.path).startsWith("._") && baseName(e.path) !== ".DS_Store",
  );
  if (usable.length === 0) throw new DdpSourceError("empty");

  // If several folders contain a DDPID, keep the folder of the first one
  const ddpIdPath = usable.find((e) => baseName(e.path).toUpperCase() === "DDPID")?.path;
  const root = ddpIdPath ? ddpIdPath.slice(0, ddpIdPath.length - baseName(ddpIdPath).length) : "";
  const scoped = root ? usable.filter((e) => e.path.startsWith(root)) : usable;

  const map = new Map<string, Blob>();
  for (const e of scoped) {
    const key = baseName(e.path).toUpperCase();
    if (!map.has(key)) map.set(key, e.blob);
  }
  return {
    names: scoped.map((e) => baseName(e.path)),
    label,
    get: (name: string) => map.get(baseName(name).trim().toUpperCase()),
    dispose,
  };
}

export function sourceFromFiles(files: File[], label: string): DdpSource {
  return indexBlobs(
    files.map((f) => ({ path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name, blob: f })),
    label,
  );
}

/** Reads every file of dropped folders (DataTransferItem.webkitGetAsEntry) */
export async function filesFromDataTransfer(items: DataTransferItemList): Promise<File[]> {
  const entries = Array.from(items)
    .map((item) => (item.kind === "file" ? item.webkitGetAsEntry?.() : null))
    .filter((e): e is FileSystemEntry => !!e);

  const out: File[] = [];
  const walk = async (entry: FileSystemEntry, prefix: string): Promise<void> => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve, reject) =>
        (entry as FileSystemFileEntry).file(resolve, reject),
      );
      // Keep the relative path so nested DDP folders can be scoped
      Object.defineProperty(file, "webkitRelativePath", { value: `${prefix}${file.name}` });
      out.push(file);
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      let batch: FileSystemEntry[];
      do {
        batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
        for (const child of batch) await walk(child, `${prefix}${entry.name}/`);
      } while (batch.length > 0);
    }
  };
  for (const entry of entries) await walk(entry, "");
  return out;
}

async function readLocalHeaderDataOffset(zip: Blob, headerOffset: number): Promise<number> {
  const header = new DataView(await zip.slice(headerOffset, headerOffset + 30).arrayBuffer());
  if (header.byteLength < 30 || header.getUint32(0, true) !== 0x04034b50) {
    throw new DdpSourceError("bad-zip", "invalid local file header");
  }
  const nameLength = header.getUint16(26, true);
  const extraLength = header.getUint16(28, true);
  return headerOffset + 30 + nameLength + extraLength;
}

async function createScratchWriter(name: string): Promise<{
  write: (chunk: Uint8Array) => Promise<void>;
  close: () => Promise<Blob>;
  remove: () => Promise<void>;
}> {
  // OPFS: data goes to disk, not RAM
  try {
    const root = await navigator.storage?.getDirectory?.();
    if (root) {
      const fileName = `ddp-${Date.now()}-${Math.random().toString(36).slice(2)}-${name.replace(/[^\w.-]/g, "_")}`;
      const handle = await root.getFileHandle(fileName, { create: true });
      if ("createWritable" in handle) {
        const writable = await handle.createWritable();
        return {
          write: (chunk) => writable.write(chunk as unknown as FileSystemWriteChunkType),
          close: async () => {
            await writable.close();
            return handle.getFile();
          },
          remove: async () => {
            try {
              await root.removeEntry(fileName);
            } catch {}
          },
        };
      }
    }
  } catch {
    // fall through to the in-memory Blob
  }
  let blob = new Blob([]);
  let pending: Uint8Array[] = [];
  let pendingSize = 0;
  return {
    write: async (chunk) => {
      pending.push(chunk.slice());
      pendingSize += chunk.byteLength;
      // Fold chunks into a Blob regularly so the browser can page it out
      if (pendingSize > 32 * 1024 * 1024) {
        blob = new Blob([blob, ...(pending as BlobPart[])]);
        pending = [];
        pendingSize = 0;
      }
    },
    close: async () => new Blob([blob, ...(pending as BlobPart[])]),
    remove: async () => {},
  };
}

export async function sourceFromZip(
  zip: File,
  onProgress?: (fraction: number, entryName: string) => void,
): Promise<DdpSource> {
  if (zip.size > MAX_ZIP_SIZE) throw new DdpSourceError("too-large");

  const { ZipReader, BlobReader, configure } = await import("@zip.js/zip.js");
  configure({ useWebWorkers: true });
  const reader = new ZipReader(new BlobReader(zip));
  let entries;
  try {
    entries = await reader.getEntries();
  } catch (error) {
    throw new DdpSourceError("bad-zip", error instanceof Error ? error.message : undefined);
  }

  const files = entries.filter((e) => !e.directory);
  const totalToInflate = files
    .filter((e) => e.compressionMethod !== 0)
    .reduce((sum, e) => sum + e.uncompressedSize, 0);
  let inflated = 0;
  const cleanups: (() => Promise<void>)[] = [];
  const out: { path: string; blob: Blob }[] = [];

  for (const entry of files) {
    if (entry.encrypted) throw new DdpSourceError("encrypted", entry.filename);
    if (entry.compressionMethod === 0) {
      const dataStart = await readLocalHeaderDataOffset(zip, entry.offset);
      out.push({ path: entry.filename, blob: zip.slice(dataStart, dataStart + entry.uncompressedSize) });
      continue;
    }
    // Small files (metadata) directly in memory, big ones (audio) streamed to scratch storage
    if (entry.uncompressedSize < 8 * 1024 * 1024) {
      const { BlobWriter } = await import("@zip.js/zip.js");
      const blob = await entry.getData!(new BlobWriter());
      inflated += entry.uncompressedSize;
      onProgress?.(totalToInflate ? inflated / totalToInflate : 1, entry.filename);
      out.push({ path: entry.filename, blob });
      continue;
    }
    const writer = await createScratchWriter(baseName(entry.filename));
    cleanups.push(writer.remove);
    const base = inflated;
    let queue = Promise.resolve();
    const sink = new WritableStream<Uint8Array>({
      write(chunk) {
        queue = queue.then(() => writer.write(chunk));
        return queue;
      },
    });
    await entry.getData!(sink, {
      onprogress: async (loaded) => {
        onProgress?.(totalToInflate ? (base + loaded) / totalToInflate : 1, entry.filename);
      },
    });
    await queue;
    inflated += entry.uncompressedSize;
    out.push({ path: entry.filename, blob: await writer.close() });
  }
  await reader.close();
  onProgress?.(1, "");

  return indexBlobs(out, zip.name, async () => {
    await Promise.all(cleanups.map((c) => c()));
  });
}
