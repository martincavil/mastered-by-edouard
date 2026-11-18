"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { useTranslations } from "@/lib/i18n/useTranslations";

export type UploadFileStatus = "pending" | "uploading" | "done" | "error";

export interface UploadFileProgress {
  name: string;
  status: UploadFileStatus;
  /** 0-100, progress of this file */
  progress: number;
}

interface UploadProgressScreenProps {
  /** 0-100, computed on the real total bytes of every file (audio, cover, other files, PDF) */
  progress: number;
  files: UploadFileProgress[];
  /** Called after the user confirmed cancellation (or directly when the upload is finished) */
  onCancel: () => void;
}

function AnimatedDots() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(
      () => setDots((prev) => (prev === "..." ? "" : prev + ".")),
      500,
    );
    return () => clearInterval(interval);
  }, []);
  return <span className="inline-block w-[1.2em] text-left">{dots}</span>;
}

export function UploadProgressScreen({
  progress,
  files,
  onCancel,
}: UploadProgressScreenProps) {
  const t = useTranslations();
  const labels = t.sendFiles.uploadScreen;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const safeProgress =
    Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0;
  const rounded = Math.floor(safeProgress);
  const isFinished = files.length > 0 && files.every((f) => f.status === "done");
  const doneCount = files.filter((f) => f.status === "done").length;

  // Warn before leaving the page while the upload is running
  useEffect(() => {
    if (isFinished) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isFinished]);

  const handleClose = () => {
    if (isFinished) onCancel();
    else setConfirmOpen(true);
  };

  // Only rendered after a user action (submit), so document is available
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-progress-title"
      className="fixed inset-0 z-[200] bg-red flex flex-col px-5 md:px-12 xl:px-16 py-8 md:py-10 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2
          id="upload-progress-title"
          className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-red-dark leading-none"
        >
          {labels.title}
          <AnimatedDots />
        </h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label={labels.close}
          className="text-black hover:text-white transition-all hover:rotate-90 duration-300 flex-shrink-0"
        >
          <svg
            className="w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto py-10 gap-8 md:gap-10">
        {/* Global progress bar, percentage centered */}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          className="relative w-full h-12 md:h-14 rounded-full bg-white overflow-hidden"
        >
          <div
            className="absolute inset-y-0 left-0 bg-red-dark rounded-full"
            style={{ width: `${safeProgress}%` }}
          />
          {/* Black label on the white part, white label clipped to the filled part */}
          <span className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold text-black">
            {rounded}%
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold text-white"
            style={{ clipPath: `inset(0 ${100 - safeProgress}% 0 0)` }}
          >
            {rounded}%
          </span>
        </div>

        {/* Files */}
        <div>
          <p className="text-black text-lg md:text-xl font-light mb-3">
            {labels.uploadedFiles} ({doneCount}/{files.length})
          </p>
          <ul className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className={`flex items-center justify-between gap-3 rounded-[10px] px-4 py-2.5 transition-colors ${
                  file.status === "done"
                    ? "bg-white text-black"
                    : file.status === "error"
                      ? "bg-black text-white"
                      : "bg-white/20 text-black"
                }`}
              >
                <span className="truncate text-sm md:text-base">{file.name}</span>
                <span className="flex-shrink-0 text-sm font-medium">
                  {file.status === "done" ? (
                    <Check size={18} aria-label={labels.done} />
                  ) : file.status === "uploading" ? (
                    `${Math.floor(file.progress)}%`
                  ) : file.status === "error" ? (
                    labels.error
                  ) : (
                    labels.pending
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-black/80 text-sm font-light">{labels.keepOpen}</p>
      </div>

      {/* Cancel confirmation */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[210] bg-black/60 flex items-center justify-center p-5">
          <div className="bg-white rounded-[10px] p-6 md:p-8 max-w-md w-full space-y-5">
            <p className="text-black text-lg font-bold">{labels.cancelTitle}</p>
            <p className="text-black text-sm font-light">{labels.cancelText}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="w-full bg-black text-white font-bold py-2 rounded-[10px] hover:bg-black/80 transition-colors"
              >
                {labels.cancelNo}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  onCancel();
                }}
                className="w-full bg-red-dark text-white font-bold py-2 rounded-[10px] hover:bg-red-dark/80 transition-colors"
              >
                {labels.cancelYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
