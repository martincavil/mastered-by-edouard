"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UploadFileStatus = "pending" | "uploading" | "done" | "error";

export interface UploadFileProgress {
  name: string;
  status: UploadFileStatus;
  /** 0-100, progress of this file */
  progress: number;
}

interface TrackedFile {
  name: string;
  size: number;
}

/**
 * Tracks the progress of a multi-file upload.
 * The global percentage is computed on the real total of bytes of every file,
 * so a 300 MB WAV weighs more than a 200 KB cover. The displayed value is eased
 * towards the real one with requestAnimationFrame, so small files do not make
 * the bar jump from 0 to 100.
 */
export function useUploadTracker() {
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState<UploadFileProgress[]>([]);
  const [progress, setProgress] = useState(0);

  const sizesRef = useRef<number[]>([]);
  const loadedRef = useRef<number[]>([]);
  const statusRef = useRef<UploadFileStatus[]>([]);
  const namesRef = useRef<string[]>([]);
  const displayedRef = useRef(0);

  const start = useCallback((items: TrackedFile[]) => {
    namesRef.current = items.map((f) => f.name);
    // Count empty files as 1 byte so they still move the bar
    sizesRef.current = items.map((f) => Math.max(1, f.size));
    loadedRef.current = items.map(() => 0);
    statusRef.current = items.map(() => "pending");
    displayedRef.current = 0;
    setProgress(0);
    setFiles(items.map((f) => ({ name: f.name, status: "pending", progress: 0 })));
    setActive(true);
  }, []);

  const setLoaded = useCallback((index: number, bytes: number) => {
    loadedRef.current[index] = Math.min(bytes, sizesRef.current[index] ?? bytes);
    if (statusRef.current[index] === "pending") statusRef.current[index] = "uploading";
  }, []);

  const setStatus = useCallback((index: number, status: UploadFileStatus) => {
    statusRef.current[index] = status;
    if (status === "done") loadedRef.current[index] = sizesRef.current[index];
  }, []);

  const stop = useCallback(() => setActive(false), []);

  useEffect(() => {
    if (!active) return;
    let frameId: number;
    const tick = () => {
      const total = sizesRef.current.reduce((a, b) => a + b, 0);
      const loaded = loadedRef.current.reduce((a, b) => a + b, 0);
      const target = total > 0 ? (loaded / total) * 100 : 0;
      const current = displayedRef.current;
      if (target > current) {
        displayedRef.current = Math.min(
          target,
          current + Math.max((target - current) * 0.12, 0.4),
        );
        setProgress(displayedRef.current);
      }
      setFiles((prev) => {
        let changed = false;
        const next = prev.map((file, i) => {
          const status = statusRef.current[i];
          const fileProgress = (loadedRef.current[i] / sizesRef.current[i]) * 100;
          if (status === file.status && Math.floor(fileProgress) === Math.floor(file.progress)) {
            return file;
          }
          changed = true;
          return { name: namesRef.current[i], status, progress: fileProgress };
        });
        return changed ? next : prev;
      });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  return { active, files, progress, start, setLoaded, setStatus, stop };
}
