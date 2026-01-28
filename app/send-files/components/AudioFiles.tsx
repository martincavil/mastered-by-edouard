"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from "react";
import { MoveUpRight, X, Upload, CircleCheckBig } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface SelectedFile {
  file: File;
  id: string;
}

export function AudioFiles() {
  const t = useTranslations();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validExtensions = [".wav", ".aif"];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    return validExtensions.includes(ext);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: SelectedFile[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push({
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
        });
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setMessage({
        type: "error",
        text: `Invalid file type(s): ${invalidFiles.join(
          ", ",
        )}. Only WAV and AIF files are allowed.`,
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setMessage(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // const formatFileSize = (bytes: number): string => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB", "GB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setMessage({ type: "error", text: "Please select at least one file" });
      return;
    }

    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter your name" });
      return;
    }

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      selectedFiles.forEach(({ file }) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSubmitSuccess(true);
      setSelectedFiles([]);
      setName("");
      setEmail("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to upload files",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-3">
        {submitSuccess ? (
          <div className="flex flex-col h-full">
            {/* White success container */}
            <div className="bg-white max-h-[350px] 2xl:max-h-full rounded-[10px] pt-8 px-8 flex flex-col items-center relative flex-1">
              <CircleCheckBig
                size={64}
                className="text-white bg-red-dark rounded-full p-3"
                strokeWidth={2}
              />
              <p className="text-black text-center md:text-2xl 2xl:text-3xl mt-3">
                {t.sendFiles.audioFiles.successMessage}
              </p>
              <div className="mt-auto w-full flex justify-center">
                <Image
                  src="https://www.dropbox.com/scl/fi/k3q1w44zwfdlpglo9w3gc/sucess-message-contact.webp?rlkey=204sf2iuubp7ndii001ihsoaa&st=boi6c088&dl=1"
                  alt="Success illustration"
                  width={271}
                  height={271}
                  className="object-cover w-full"
                />
              </div>
            </div>
            <div className="flex items-center w-full gap-2 mt-2 2xl:mt-3">
              <Link
                href="/send-files?tab=production-sheet"
                className="bg-white text-black font-bold text-base 2xl:text-lg py-1.5 2xl:py-3 rounded-[10px] hover:bg-black/90 transition-colors duration-300 flex items-center justify-center gap-2 w-full"
              >
                {t.sendFiles.audioFiles.sendProductionSheet}
                <MoveUpRight size={20} />
              </Link>
              <Link
                href="/"
                className="bg-red-dark text-white font-bold text-base 2xl:text-lg py-1.5 2xl:py-3 rounded-[10px] hover:bg-black/90 transition-colors duration-300 flex items-center justify-center gap-2 w-full"
              >
                {t.sendFiles.audioFiles.backToHome}
                <MoveUpRight size={20} />
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-2 2xl:space-y-4"
          >
            <div className="bg-white px-4 py-6 2xl:py-8 2xl:px-6 rounded-[10px] h-[300px] max-h-[300px] 2xl:h-full 2xl:max-h-[700px]">
              <div className="w-full">
                <p className="text-center font-medium mb-3 2xl:mb-5">
                  {t.sendFiles.audioFiles.draganddrop}
                </p>
              </div>
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-black rounded-[10px] p-8 text-center cursor-pointer hover:border-black/50 bg-black/10 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".wav,.aif"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2">
                  <p className="">{t.sendFiles.audioFiles.clickordrag}</p>
                  <MoveUpRight size={24} className="font-extralight inline-block" />
                </div>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-black font-extralight mb-2">
                    {t.sendFiles.audioFiles.uploadingFiles}
                  </h3>
                  <div className="space-y-2 max-h-[80px] overflow-y-scroll pr-1">
                    {selectedFiles.map(({ file, id }) => (
                      <div
                        key={id}
                        className="flex items-center justify-between rounded-[10px]"
                      >
                        <div className="flex items-center justify-between w-full min-w-0 border bg-black/10 border-black rounded-[10px] px-3 py-2">
                          <p className="text-black text-xs truncate">
                            {file.name}
                          </p>
                          {/* <p className="text-black/60 text-sm">
                        {formatFileSize(file.size)}
                      </p> */}
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(id)}
                            className=" text-black hover:text-red transition-colors"
                            disabled={isUploading}
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Message Display */}
              {message && (
                <div
                  className={`mt-2 py-1.5 px-4 rounded-lg text-xs ${
                    message.type === "success"
                      ? "bg-green-500/20 text-green-700"
                      : "bg-red-500/20 text-red"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>

            {/* Form Inputs */}
            <div className="space-y-2 2xl:space-y-3">
              <div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isUploading}
                  placeholder="mail*"
                  aria-required="true"
                  className="w-full py-1.5 px-8 2xl:py-3 bg-white rounded-[10px] text-black placeholder:text-black"
                  required
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUploading}
                  className="w-full py-1.5 px-8 2xl:py-3 bg-white rounded-[10px] text-black placeholder:text-black"
                  placeholder="name*"
                  required
                />
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-red-dark text-white font-bold text-center w-full py-1.5 2xl:py-3 rounded-[10px] hover:bg-red-dark/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading…" : "send files"}
                  <MoveUpRight size={20} />
                </button>
              </div>
            </div>
          </form>
        )}
        {!submitSuccess && (
          <p className="text-black font-extralight">
            {t.sendFiles.audioFiles.termsAndConditions}
          </p>
        )}
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden md:flex flex-col items-center md:items-end justify-start space-y-4 2xl:space-y-20">
        {submitSuccess ? (
          <div className="flex flex-col self-start">
            <span className="text-5xl xl:text-[90px] 2xl:text-[100px] font-bold text-white leading-[0.8]">
              {t.sendFiles.audioFiles.successHeadline1}
            </span>
            <span className="text-5xl xl:text-[90px] 2xl:text-[100px] font-bold text-black leading-[0.8]">
              {t.sendFiles.audioFiles.successHeadline2}
            </span>
          </div>
        ) : (
          <div className="flex flex-col self-start">
            <span className="text-5xl xl:text-[90px] 2xl:text-[100px] font-bold text-white leading-[0.8]">
              {t.sendFiles.audioFiles.headline1}
            </span>
            <span className="text-5xl xl:text-[90px] 2xl:text-[100px] font-bold text-black leading-[0.8]">
              {t.sendFiles.audioFiles.headline2}
            </span>
            <span className="text-5xl xl:text-[90px] 2xl:text-[100px] font-bold text-black leading-[0.8]">
              {t.sendFiles.audioFiles.headline3}
            </span>
          </div>
        )}
        <Image
          src="https://www.dropbox.com/scl/fi/iwj6fuky5hk2my2qa0pa7/send-files.webp?rlkey=ucreqy7vx1p7mhahrv6hatzgc&st=3u0iinfy&dl=1"
          alt="Edouard SendFiles Illustration"
          width={271}
          height={271}
          className="object-cover w-48 h-48 2xl:w-[271px] 2xl:h-[271px]"
        />
      </div>
      {isUploading && <LoadingSpinner />}
    </>
  );
}
