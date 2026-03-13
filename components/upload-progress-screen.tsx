"use client";

import { X } from "lucide-react";

interface UploadProgressScreenProps {
  uploadProgress: number;
  uploadedFiles: string[];
  totalFiles: number;
  onClose: () => void;
}

export function UploadProgressScreen({
  uploadProgress,
  uploadedFiles,
  totalFiles,
  onClose,
}: UploadProgressScreenProps) {
  const handleClose = () => {
    // Si l'upload n'est pas terminé, demander confirmation
    if (uploadProgress < 100) {
      const confirmed = window.confirm(
        "Upload in progress. Are you sure you want to cancel?",
      );
      if (!confirmed) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-red flex flex-col items-center justify-center px-4 md:px-8 z-50">
      {/* Bouton X fermer */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 hover:opacity-80 transition-opacity"
        aria-label="Close"
      >
        <X size={48} className="text-white" />
      </button>

      {/* Titre */}
      <h1 className="text-4xl md:text-6xl font-bold text-red-dark mb-8 md:mb-12 text-center">
        upload in progress...
      </h1>

      {/* Barre de progression */}
      <div className="relative w-full max-w-[500px] h-12 md:h-16 bg-white rounded-full border-2 border-black mb-8 md:mb-12">
        <div
          className="h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold text-black">
          {Math.round(uploadProgress)}%
        </span>
      </div>

      {/* Liste fichiers uploadés */}
      <div className="w-full max-w-[500px]">
        <h2 className="text-lg md:text-xl text-white mb-3 md:mb-4 font-medium">
          Uploaded file{uploadedFiles.length !== 1 ? "s" : ""}
        </h2>
        <div className="space-y-2 max-h-[200px] md:max-h-[300px] overflow-y-auto">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="border-2 border-white rounded-lg py-2 md:py-3 px-4 md:px-6 flex items-center justify-between bg-transparent"
            >
              <span className="text-white text-sm md:text-lg truncate flex-1 pr-2">
                {file}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
