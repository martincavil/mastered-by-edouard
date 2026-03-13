"use client";

import { X, CheckCircle, Clock } from "lucide-react";

interface UploadProgressScreenProps {
  uploadProgress: number;
  uploadedFiles: string[];
  totalFiles: number;
  allFiles: string[];
  onClose: () => void;
}

export function UploadProgressScreen({
  uploadProgress,
  uploadedFiles,
  totalFiles,
  allFiles,
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

  // Calculate safe progress percentage
  const safeProgress = totalFiles > 0 ? Math.round(uploadProgress) : 0;

  // Get pending files (not yet uploaded)
  const pendingFiles = allFiles.filter(file => !uploadedFiles.includes(file));

  return (
    <div className="fixed inset-0 bg-red/95 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-20">
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
        <div className="relative w-full max-w-[600px] h-12 md:h-16 bg-white rounded-full border-2 border-black mb-8 md:mb-12">
          <div
            className="h-full bg-red-dark rounded-full transition-all duration-300"
            style={{ width: `${safeProgress}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold text-black">
            {safeProgress}%
          </span>
        </div>

        {/* Stats */}
        <div className="text-white text-center mb-8">
          <p className="text-lg md:text-xl font-medium">
            {uploadedFiles.length} / {totalFiles} fichiers uploadés
          </p>
        </div>

        {/* Grille de listes de fichiers */}
        <div className="w-full max-w-[800px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fichiers en attente */}
          {pendingFiles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="text-white" size={24} />
                <h2 className="text-lg md:text-xl text-white font-medium">
                  En attente ({pendingFiles.length})
                </h2>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {pendingFiles.map((file, index) => (
                  <div
                    key={index}
                    className="border-2 border-white/50 rounded-lg py-2 md:py-3 px-4 md:px-6 flex items-center gap-3 bg-white/10"
                  >
                    <Clock className="text-white/70 flex-shrink-0" size={20} />
                    <span className="text-white/70 text-sm md:text-base truncate flex-1">
                      {file}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fichiers uploadés */}
          {uploadedFiles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-white" size={24} />
                <h2 className="text-lg md:text-xl text-white font-medium">
                  Uploadés ({uploadedFiles.length})
                </h2>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="border-2 border-white rounded-lg py-2 md:py-3 px-4 md:px-6 flex items-center gap-3 bg-white/20"
                  >
                    <CheckCircle className="text-white flex-shrink-0" size={20} />
                    <span className="text-white text-sm md:text-base truncate flex-1">
                      {file}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
