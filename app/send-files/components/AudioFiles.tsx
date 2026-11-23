"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import Link from "next/link";
import { useState, useRef, DragEvent, ChangeEvent, FormEvent, MouseEvent } from "react";
import { MorphPanel } from "@/components/morph-panel";
import { X } from "lucide-react";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { UploadProgressScreen } from "@/components/upload-progress-screen";
import { useUploadTracker } from "@/lib/use-upload-tracker";
import {
  createDropboxFolder,
  getDropboxUploadToken,
  runWithConcurrency,
  sanitizeForDropbox,
  uploadToDropbox,
} from "@/lib/dropbox-upload";

interface SelectedFile {
  file: File;
  id: string;
  progress?: number;
  uploading?: boolean;
  error?: string;
}

interface AudioFormData {
  name: string;
  email: string;
  projectName: string;
  message: string;
  acceptTerms: boolean;
}

interface AudioFilesProps {
  selectedFiles: SelectedFile[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<SelectedFile[]>>;
  formData: AudioFormData;
  setFormData: React.Dispatch<React.SetStateAction<AudioFormData>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  /** Opens the "how to prepare your files" screen */
  onShowPrepare: (origin: DOMRect | null) => void;
  /** Called once the files are on Dropbox (shows the "files sent." screen) */
  onSuccess: () => void;
}

// Files uploaded at the same time. Each file is chunked (32 MB) through an
// upload session, chunks of one file are sequential (Dropbox requirement).
const CONCURRENT_UPLOADS = 3;
const VALID_EXTENSIONS = [".wav", ".aif", ".aiff"];

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 * 1024
    ? `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
    : `${Math.max(0.1, bytes / 1024 / 1024).toFixed(1)} MB`;

// Underlined fields (mockup "audio files")
const inputClass =
  "w-full bg-transparent border-b border-black pb-1.5 pt-1 px-1 text-black text-lg xl:text-xl mdshort:text-lg mdshort:pb-1 placeholder:text-black outline-none focus:border-red disabled:opacity-60";

export function AudioFiles({
  selectedFiles,
  setSelectedFiles,
  formData,
  setFormData,
  isUploading,
  setIsUploading,
  onShowPrepare,
  onSuccess,
}: AudioFilesProps) {
  const t = useTranslations();
  const labels = t.sendFiles.audioFiles;
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // "how to prepare" opening animation: a dark red panel grows from the
  // button to the whole card, then the prepare screen (same colour) replaces it
  const [expand, setExpand] = useState<{ from: DOMRect; to: DOMRect } | null>(null);

  const openPrepare = (e: MouseEvent<HTMLButtonElement>) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !formRef.current) {
      onShowPrepare(null);
      return;
    }
    const from = e.currentTarget.getBoundingClientRect();
    const to = formRef.current.getBoundingClientRect();
    setExpand({ from, to });
  };
  const tracker = useUploadTracker();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles: SelectedFile[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (VALID_EXTENSIONS.includes(ext)) {
        validFiles.push({
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
        });
      } else {
        invalidFiles.push(file.name);
      }
    });

    setMessage(
      invalidFiles.length > 0
        ? {
            type: "error",
            text: labels.errorFileType.replace(
              "{files}",
              invalidFiles.join(", "),
            ),
          }
        : null,
    );
    if (validFiles.length > 0)
      setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const validate = (): string | null => {
    if (selectedFiles.length === 0) return labels.errorNoFiles;
    if (!formData.name.trim()) return labels.errorName;
    if (!formData.email.trim()) return labels.errorEmail;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return labels.errorEmailInvalid;
    if (!formData.projectName.trim()) return labels.errorProjectName;
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    const files = [...selectedFiles];
    const controller = new AbortController();
    abortRef.current = controller;
    setMessage(null);
    setIsUploading(true);
    tracker.start(files.map((f) => ({ name: f.file.name, size: f.file.size })));

    try {
      const accessToken = await getDropboxUploadToken();

      // Folder format: YYYYMMDD_Name_ProjectName
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const folderName = `${dateStr}_${sanitizeForDropbox(formData.name)}_${sanitizeForDropbox(formData.projectName)}`;
      const folderPath = `/01_uploads/${folderName}`;
      await createDropboxFolder(accessToken, folderPath);

      await runWithConcurrency(
        files.map((f, index) => ({ f, index })),
        CONCURRENT_UPLOADS,
        async ({ f, index }) => {
          tracker.setStatus(index, "uploading");
          try {
            await uploadToDropbox(f.file, {
              token: accessToken,
              path: `${folderPath}/${sanitizeForDropbox(f.file.name)}`,
              onProgress: (bytes) => tracker.setLoaded(index, bytes),
              signal: controller.signal,
            });
            tracker.setStatus(index, "done");
          } catch (err) {
            tracker.setStatus(index, "error");
            // Stop the other uploads on the first hard failure
            controller.abort();
            throw err;
          }
        },
      );

      // Notification + confirmation emails (non-blocking: files are on Dropbox)
      try {
        const emailResponse = await fetch("/api/audio-files-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            projectName: formData.projectName,
            message: formData.message,
            fileNames: files.map((f) => f.file.name),
            folderPath,
          }),
        });
        if (!emailResponse.ok) {
          console.error(
            "Audio files notification failed:",
            await emailResponse.text(),
          );
        }
      } catch (emailError) {
        console.error("Audio files notification failed:", emailError);
      }

      // Let the bar reach 100% before closing the progress screen
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSuccess();
      setSelectedFiles([]);
      setFormData({
        name: "",
        email: "",
        projectName: "",
        message: "",
        acceptTerms: false,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload files",
      });
    } finally {
      abortRef.current = null;
      tracker.stop();
      setIsUploading(false);
    }
  };


  if (isUploading) {
    return (
      <UploadProgressScreen
        uploadProgress={tracker.progress}
        uploadedFiles={tracker.files
          .filter((f) => f.status === "done")
          .map((f) => f.name)}
        totalFiles={tracker.files.length}
        allFiles={tracker.files.map((f) => f.name)}
        filesWithProgress={tracker.files.map((f) => ({
          name: f.name,
          progress: f.progress,
          uploading: f.status === "uploading",
        }))}
        onClose={() => {}}
      />
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white rounded-[10px] h-full min-h-0 p-5 md:p-8 xl:p-10 mdshort:p-6 grid md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-6 md:gap-8 xl:gap-12 overflow-y-auto"
    >
      {/* Left: fields, drop zone, file list */}
      <div className="flex flex-col gap-4 2xl:gap-6 mdshort:gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isUploading}
            placeholder={labels.emailPlaceholder}
            autoComplete="email"
            required
            className={inputClass}
          />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isUploading}
            placeholder={labels.namePlaceholder}
            autoComplete="name"
            required
            className={inputClass}
          />
          <input
            type="text"
            value={formData.projectName}
            onChange={(e) =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            disabled={isUploading}
            placeholder={labels.projectNamePlaceholder}
            required
            className={inputClass}
          />
          <input
            type="text"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            disabled={isUploading}
            placeholder={labels.messagePlaceholder}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-black font-light text-base xl:text-xl mdshort:text-lg">
            {labels.draganddrop}
          </p>
          <div
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            className={`border-dashed-custom rounded-[10px] min-h-[140px] xl:min-h-[180px] 2xl:min-h-[220px] mdshort:min-h-[90px] flex flex-col items-center justify-center gap-1 p-6 text-center cursor-pointer transition-colors ${
              isDragging ? "bg-black/10" : "bg-[#E5E5E5] hover:bg-[#DCDCDC]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".wav,.aif,.aiff"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex items-center gap-2 text-black text-lg xl:text-2xl mdshort:text-xl">
              <span>{labels.clickordrag}</span>
              <ArrowUpRight size={22} />
            </div>
            <p className="text-black/70 text-sm xl:text-lg mdshort:text-base font-light">
              {labels.browse}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openPrepare}
              className="bg-black text-white rounded-full text-base xl:text-xl mdshort:text-lg px-8 py-1.5 mdshort:py-1 font-light hover:bg-red-dark transition-colors duration-300"
            >
              {labels.howToPrepare}
            </button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex flex-col gap-2 shrink-0">
            <p className="text-black font-light text-base xl:text-xl mdshort:text-lg">
              {labels.uploadingFiles}
            </p>
            <ul className="space-y-2 max-h-[160px] 2xl:max-h-[240px] mdshort:max-h-[100px] overflow-y-auto pr-1">
              {selectedFiles.map(({ file, id }) => (
                <li
                  key={id}
                  className="flex items-center justify-between gap-3 bg-[#E5E5E5] border border-black rounded-[6px] px-4 py-2 mdshort:py-1"
                >
                  <span className="text-black text-sm xl:text-lg mdshort:text-base font-light truncate">
                    {file.name}
                  </span>
                  <span className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-black/60 text-xs">
                      {formatSize(file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(id)}
                      className="text-black hover:text-red transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={18} strokeWidth={1.5} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {message && (
          <div
            role="alert"
            className={`py-2 px-4 rounded-[10px] text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-700"
                : "bg-red/10 text-red"
            }`}
          >
            {message.text}
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer mt-auto">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) =>
              setFormData({ ...formData, acceptTerms: e.target.checked })
            }
            className="w-4 h-4 flex-shrink-0 cursor-pointer accent-black"
          />
          <span className="text-black font-light text-sm xl:text-base">
            {labels.termsAndConditions.text}{" "}
            <Link
              href="/terms-and-conditions"
              target="_blank"
              className="font-bold hover:underline"
            >
              {labels.termsAndConditions.link}
            </Link>{" "}
            {labels.termsAndConditions.suffix}
          </span>
        </label>
      </div>

      {/* Right: headline + send button */}
      <div className="flex flex-col justify-end gap-6 xl:gap-10">
        <div className="hidden md:flex flex-col text-5xl lg:text-6xl xl:text-[100px] mdshort:text-[80px] font-bold text-black !leading-[0.8]">
          <span>{labels.headline1}</span>
          <span>{labels.headline2}</span>
          <span>{labels.headline3}</span>
        </div>
        <button
          type="submit"
          disabled={isUploading || !formData.acceptTerms}
          className="w-full bg-red-dark text-white font-bold text-xl lg:text-3xl xl:text-5xl mdshort:text-4xl text-left leading-tight py-3 xl:py-6 mdshort:py-4 px-6 xl:px-8 rounded-[10px] hover:bg-black transition-colors duration-300 flex items-center justify-between gap-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-dark"
        >
          {labels.sendButton}
          <ArrowUpRight size={44} className="flex-shrink-0" />
        </button>
      </div>
      {expand && (
        <MorphPanel
          from={expand.from}
          to={expand.to}
          fromRadius={9999}
          toRadius={10}
          onDone={() => onShowPrepare(expand.from)}
        />
      )}
    </form>
  );
}
