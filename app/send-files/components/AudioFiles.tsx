"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";
import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from "react";
import { MoveUpRight, X, Upload } from "lucide-react";

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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.wav', '.aif'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
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
        type: 'error',
        text: `Invalid file type(s): ${invalidFiles.join(', ')}. Only WAV and AIF files are allowed.`,
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one file' });
      return;
    }

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name' });
      return;
    }

    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      selectedFiles.forEach(({ file }) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage({ type: 'success', text: 'Files sent successfully' });
      setSelectedFiles([]);
      setName('');
      setEmail('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to upload files',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center cursor-pointer hover:border-white/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".wav,.aif"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Upload className="mx-auto mb-4 text-white/60" size={48} />
            <p className="text-white text-lg mb-2">
              Drag & drop your audio files here
            </p>
            <p className="text-white/60 text-sm">
              or click to browse (WAV, AIF)
            </p>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-3">Selected Files:</h3>
              {selectedFiles.map(({ file, id }) => (
                <div
                  key={id}
                  className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{file.name}</p>
                    <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(id)}
                    className="ml-4 text-white/60 hover:text-red transition-colors"
                    disabled={isUploading}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form Inputs */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-white mb-2">
                Name <span className="text-red">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isUploading}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2">
                Email <span className="text-red">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isUploading}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="bg-red text-black font-bold px-6 py-3 rounded-lg hover:bg-red/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading…' : 'send files'}
            <MoveUpRight size={20} />
          </button>
        </form>
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden md:flex flex-col items-center md:items-end justify-start space-y-4 2xl:space-y-20">
        <div className="flex flex-col self-start">
          <span className="text-5xl xl:text-[100px] font-bold text-white leading-[0.8]">
            {t.sendFiles.audioFiles.headline1}
          </span>
          <span className="text-5xl xl:text-[100px] font-bold text-black leading-[0.8]">
            {t.sendFiles.audioFiles.headline2}
          </span>
          <span className="text-5xl xl:text-[100px] font-bold text-black leading-[0.8]">
            {t.sendFiles.audioFiles.headline3}
          </span>
        </div>
        <Image
          src="https://www.dropbox.com/scl/fi/iwj6fuky5hk2my2qa0pa7/send-files.webp?rlkey=ucreqy7vx1p7mhahrv6hatzgc&st=3u0iinfy&dl=1"
          alt="Edouard SendFiles Illustration"
          width={271}
          height={271}
          className="object-cover w-48 h-48 2xl:w-[271px] 2xl:h-[271px]"
        />
      </div>
    </>
  );
}
