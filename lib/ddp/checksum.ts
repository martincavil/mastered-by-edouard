import SparkMD5 from "spark-md5";
import type { DdpSource } from "./source";

export interface ChecksumLine {
  file: string;
  expected: string;
}

export interface ChecksumResult extends ChecksumLine {
  actual: string | null;
  status: "ok" | "ko" | "missing";
}

/**
 * Parses the MD5 lists found in DDPs:
 *   "d41d8cd98f00b204e9800998ecf8427e  IMAGE.DAT"   (md5sum)
 *   "d41d8cd98f00b204e9800998ecf8427e *IMAGE.DAT"   (md5sum binary)
 *   "MD5 (IMAGE.DAT) = d41d8cd98f00b204e9800998ecf8427e" (BSD)
 *   "IMAGE.DAT d41d8cd98f00b204e9800998ecf8427e"     (some mastering tools)
 */
export function parseChecksumFile(text: string): ChecksumLine[] {
  const lines: ChecksumLine[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(";") || line.startsWith("#")) continue;
    let m = line.match(/^MD5\s*\((.+)\)\s*=\s*([0-9a-f]{32})$/i);
    if (m) {
      lines.push({ file: m[1].trim(), expected: m[2].toLowerCase() });
      continue;
    }
    m = line.match(/^([0-9a-f]{32})\s+\*?(.+)$/i);
    if (m) {
      lines.push({ file: m[2].trim(), expected: m[1].toLowerCase() });
      continue;
    }
    m = line.match(/^(.+?)\s+([0-9a-f]{32})$/i);
    if (m) lines.push({ file: m[1].trim(), expected: m[2].toLowerCase() });
  }
  return lines;
}

export async function findChecksums(source: DdpSource): Promise<{ file: string; lines: ChecksumLine[] } | null> {
  const candidates = source.names.filter((n) => /\.md5$/i.test(n) || /^checksum/i.test(n));
  for (const name of candidates) {
    const blob = source.get(name);
    if (!blob || blob.size > 1024 * 1024) continue;
    const lines = parseChecksumFile(await blob.text());
    if (lines.length > 0) return { file: name, lines };
  }
  return null;
}

/** MD5 in a Web Worker, with a main-thread fallback if workers are unavailable */
function md5(blob: Blob, onProgress: (loaded: number) => void, signal: AbortSignal): Promise<string> {
  let worker: Worker | null = null;
  try {
    worker = new Worker(new URL("./md5.worker.ts", import.meta.url), { type: "module" });
  } catch {
    worker = null;
  }

  if (!worker) {
    return (async () => {
      const spark = new SparkMD5.ArrayBuffer();
      const chunk = 4 * 1024 * 1024;
      for (let offset = 0; offset < blob.size; offset += chunk) {
        if (signal.aborted) throw new Error("aborted");
        spark.append(await blob.slice(offset, offset + chunk).arrayBuffer());
        onProgress(Math.min(blob.size, offset + chunk));
        await new Promise((r) => setTimeout(r, 0));
      }
      return spark.end();
    })();
  }

  const w = worker;
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).slice(2);
    signal.addEventListener("abort", () => {
      w.terminate();
      reject(new Error("aborted"));
    });
    w.onmessage = (event) => {
      const msg = event.data;
      if (msg.id !== id) return;
      if (msg.type === "progress") onProgress(msg.loaded);
      else if (msg.type === "done") {
        w.terminate();
        resolve(msg.hash);
      } else if (msg.type === "error") {
        w.terminate();
        reject(new Error(msg.message));
      }
    };
    w.onerror = (e) => {
      w.terminate();
      reject(new Error(e.message || "worker error"));
    };
    w.postMessage({ id, blob });
  });
}

export async function verifyChecksums(
  source: DdpSource,
  lines: ChecksumLine[],
  onProgress: (fraction: number, file: string) => void,
  signal: AbortSignal,
): Promise<ChecksumResult[]> {
  const items = lines.map((l) => ({ line: l, blob: source.get(l.file) }));
  const total = items.reduce((sum, i) => sum + (i.blob?.size ?? 0), 0) || 1;
  let done = 0;
  const results: ChecksumResult[] = [];
  for (const { line, blob } of items) {
    if (!blob) {
      results.push({ ...line, actual: null, status: "missing" });
      continue;
    }
    const base = done;
    const actual = await md5(blob, (loaded) => onProgress((base + loaded) / total, line.file), signal);
    done += blob.size;
    results.push({ ...line, actual, status: actual === line.expected ? "ok" : "ko" });
  }
  onProgress(1, "");
  return results;
}
