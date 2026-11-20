"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from "react";
import { X, CircleCheckBig } from "lucide-react";
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
}

// Files uploaded at the same time. Each file is chunked (32 MB) through an
// upload session, chunks of one file are sequential (Dropbox requirement).
const CONCURRENT_UPLOADS = 3;
const VALID_EXTENSIONS = [".wav", ".aif", ".aiff"];

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 * 1024
    ? `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
    : `${Math.max(0.1, bytes / 1024 / 1024).toFixed(1)} MB`;

const inputClass =
  "w-full py-2.5 px-5 2xl:py-3.5 bg-white rounded-[10px] text-black placeholder:text-black/70 outline-none focus:ring-2 focus:ring-black disabled:opacity-60";

export function AudioFiles({
  selectedFiles,
  setSelectedFiles,
  formData,
  setFormData,
  isUploading,
  setIsUploading,
}: AudioFilesProps) {
  const t = useTranslations();
  const labels = t.sendFiles.audioFiles;
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const tracker = useUploadTracker();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles: SelectedFile[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (VALID_EXTENSIONS.includes(ext)) {
        validFiles.push({ file, id: `${file.name}-${Date.now()}-${Math.random()}` });
      } else {
        invalidFiles.push(file.name);
      }
    });

    setMessage(
      invalidFiles.length > 0
        ? { type: "error", text: labels.errorFileType.replace("{files}", invalidFiles.join(", ")) }
        : null,
    );
    if (validFiles.length > 0) setSelectedFiles((prev) => [...prev, ...validFiles]);
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return labels.errorEmailInvalid;
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
          console.error("Audio files notification failed:", await emailResponse.text());
        }
      } catch (emailError) {
        console.error("Audio files notification failed:", emailError);
      }

      // Let the bar reach 100% before closing the progress screen
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubmitSuccess(true);
      setSelectedFiles([]);
      setFormData({ name: "", email: "", projectName: "", message: "", acceptTerms: false });
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

  // Right column: small headline + illustration (the form dominates the page)
  const aside = (
    <div className="hidden md:flex flex-col justify-between items-end relative min-h-0">
      <div className="flex flex-col self-start text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] font-bold !leading-[0.8]">
        {submitSuccess ? (
          <>
            <span className="text-white">{labels.successHeadline1}</span>
            <span className="text-black">{labels.successHeadline2}</span>
          </>
        ) : (
          <>
            <span className="text-white">{labels.headline1}</span>
            <span className="text-black">{labels.headline2}</span>
            <span className="text-black">{labels.headline3}</span>
          </>
        )}
      </div>
      <Image
        src="https://www.dropbox.com/scl/fi/iwj6fuky5hk2my2qa0pa7/send-files.webp?rlkey=ucreqy7vx1p7mhahrv6hatzgc&st=3u0iinfy&dl=1"
        alt="Edouard SendFiles Illustration"
        width={271}
        height={271}
        className="object-cover w-28 h-28 xl:w-36 xl:h-36 2xl:w-44 2xl:h-44"
      />
    </div>
  );

  if (isUploading) {
    return (
      <UploadProgressScreen
        uploadProgress={tracker.progress}
        uploadedFiles={tracker.files.filter((f) => f.status === "done").map((f) => f.name)}
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

  if (submitSuccess) {
    return (
      <>
        <div className="flex flex-col h-full min-h-0 gap-2 2xl:gap-3">
          <div className="bg-white rounded-[10px] p-8 flex flex-col items-center justify-center gap-4 flex-1 min-h-[260px]">
            <CircleCheckBig size={64} className="text-white bg-red rounded-full p-3" strokeWidth={2} />
            <p className="text-black text-center text-xl md:text-2xl 2xl:text-3xl">{labels.successMessage}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch w-full gap-2">
            <Link
              href="/send-files?tab=production-sheet"
              className="bg-white text-black font-bold text-base 2xl:text-lg py-2.5 2xl:py-3.5 rounded-[10px] hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 w-full"
            >
              {labels.sendProductionSheet}
              <ArrowUpRight size={20} />
            </Link>
            <Link
              href="/"
              className="bg-red-dark text-white font-bold text-base 2xl:text-lg py-2.5 2xl:py-3.5 rounded-[10px] hover:bg-black transition-colors duration-300 flex items-center justify-center gap-2 w-full"
            >
              {labels.backToHome}
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
        {aside}
      </>
    );
  }

  return (
    <>

      <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 gap-2 2xl:gap-3 md:overflow-y-auto md:pr-1">
        {/* Drop zone card */}
        <div className="bg-white rounded-[10px] p-4 2xl:p-6 flex flex-col gap-3 flex-1 min-h-[280px]">
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
            className={`border-dashed-custom rounded-[10px] flex-1 min-h-[140px] flex flex-col items-center justify-center gap-2 p-6 text-center cursor-pointer transition-colors ${
              isDragging ? "bg-black/10" : "bg-[#ECECEC] hover:bg-[#E2E2E2]"
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
            <p className="font-medium text-black text-lg 2xl:text-xl">{labels.draganddrop}</p>
            <div className="flex items-center gap-2 text-black">
              <span className="underline underline-offset-4">{labels.clickordrag}</span>
              <ArrowUpRight size={22} />
            </div>
            <p className="text-black/60 text-xs">{labels.acceptedFormats}</p>
          </div>

          {selectedFiles.length > 0 && (
            <ul className="space-y-1.5 max-h-[140px] 2xl:max-h-[220px] overflow-y-auto pr-1">
              {selectedFiles.map(({ file, id }) => (
                <li
                  key={id}
                  className="flex items-center justify-between gap-3 bg-[#ECECEC] rounded-[10px] px-3 py-1.5"
                >
                  <span className="text-black text-sm truncate">{file.name}</span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-black/60 text-xs">{formatSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(id)}
                      className="text-black hover:text-red transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={18} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between gap-3">
            <Image
              src="https://www.dropbox.com/scl/fi/387ne9zdsto43otkmktg8/powered-by-Dropbox.png?rlkey=2n2na2rux64ivpluv1tmochuq&st=ovcr5mp5&dl=1"
              alt="Powered by Dropbox"
              width={110}
              height={110}
            />
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                type="button"
                onClick={() => setShowTooltip((v) => !v)}
                aria-label={labels.namingTooltipTitle}
                className="w-5 h-5 rounded-full border border-black flex items-center justify-center bg-transparent hover:bg-black hover:text-white transition-colors"
              >
                <span className="text-xs font-medium">i</span>
              </button>
              {showTooltip && (
                <div className="absolute bottom-full right-0 mb-2 text-white rounded-lg p-4 text-xs border border-white z-50 w-[240px] md:w-[300px] bg-black">
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-bold">{labels.namingTooltipTitle}</span>
                    {labels.namingTooltipHints.map((hint, index) => (
                      <span key={index}>{hint}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            disabled={isUploading}
            placeholder={labels.projectNamePlaceholder}
            required
            className={inputClass}
          />
        </div>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          disabled={isUploading}
          placeholder={labels.messagePlaceholder}
          rows={2}
          className={`${inputClass} resize-none`}
        />

        {message && (
          <div
            role="alert"
            className={`py-2 px-4 rounded-[10px] text-sm ${
              message.type === "success" ? "bg-green-500/20 text-green-700" : "bg-white text-red"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="w-4 h-4 flex-shrink-0 cursor-pointer"
            />
            <span className="text-black font-light text-sm 2xl:text-base">
              {labels.termsAndConditions.text}{" "}
              <Link href="/terms-and-conditions" target="_blank" className="font-medium hover:underline">
                {labels.termsAndConditions.link}
              </Link>{" "}
              {labels.termsAndConditions.suffix}
            </span>
          </label>
          <button
            type="submit"
            disabled={isUploading || !formData.acceptTerms}
            className="sm:w-[40%] bg-red-dark text-white font-bold text-lg py-2.5 2xl:py-3.5 px-6 rounded-[10px] hover:bg-black transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-dark"
          >
            {labels.sendButton}
            <ArrowUpRight size={20} />
          </button>
        </div>
      </form>

      {aside}
    </>
  );
}
