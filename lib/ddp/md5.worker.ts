/// <reference lib="webworker" />
// Incremental MD5 of large Blobs/Files off the main thread.
// Web Crypto has no MD5, so spark-md5 (incremental, ArrayBuffer API) is used.
import SparkMD5 from "spark-md5";

const CHUNK = 8 * 1024 * 1024;

self.onmessage = async (event: MessageEvent<{ id: string; blob: Blob }>) => {
  const { id, blob } = event.data;
  try {
    const spark = new SparkMD5.ArrayBuffer();
    for (let offset = 0; offset < blob.size; offset += CHUNK) {
      spark.append(await blob.slice(offset, offset + CHUNK).arrayBuffer());
      (self as unknown as Worker).postMessage({ id, type: "progress", loaded: Math.min(blob.size, offset + CHUNK) });
    }
    (self as unknown as Worker).postMessage({ id, type: "done", hash: spark.end() });
  } catch (error) {
    (self as unknown as Worker).postMessage({ id, type: "error", message: error instanceof Error ? error.message : String(error) });
  }
};
