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
    <>
      {/* Colonne de gauche - Progress */}
      <div className="flex flex-col space-y-6 justify-center">
        {/* Titre */}
        <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white text-center md:text-left">
          upload in progress...
        </h1>

        {/* Barre de progression */}
        <div className="relative w-full h-12 md:h-16 bg-white rounded-full border-2 border-black">
          <div
            className="h-full bg-red-dark rounded-full transition-all duration-300"
            style={{ width: `${safeProgress}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold text-black">
            {safeProgress}%
          </span>
        </div>

        {/* Stats */}
        <div className="text-white text-center md:text-left">
          <p className="text-lg md:text-xl font-medium">
            {uploadedFiles.length} / {totalFiles} fichiers uploadés
          </p>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={handleClose}
          className="bg-white text-black font-bold text-base md:text-lg py-2 md:py-3 rounded-[10px] hover:bg-black/90 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <X size={20} />
          Annuler
        </button>
      </div>

      {/* Colonne de droite - Listes des fichiers */}
      <div className="flex flex-col space-y-6">
        {/* Fichiers en attente */}
        {pendingFiles.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-[10px] p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-white" size={24} />
              <h2 className="text-lg md:text-xl text-white font-medium">
                En attente ({pendingFiles.length})
              </h2>
            </div>
            <div className="space-y-2 max-h-[250px] 2xl:max-h-[400px] overflow-y-auto pr-2">
              {pendingFiles.map((file, index) => (
                <div
                  key={index}
                  className="border-2 border-white/50 rounded-lg py-2 md:py-3 px-4 flex items-center gap-3 bg-white/5"
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
          <div className="bg-white/20 backdrop-blur-sm rounded-[10px] p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-white" size={24} />
              <h2 className="text-lg md:text-xl text-white font-medium">
                Uploadés ({uploadedFiles.length})
              </h2>
            </div>
            <div className="space-y-2 max-h-[250px] 2xl:max-h-[400px] overflow-y-auto pr-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="border-2 border-white rounded-lg py-2 md:py-3 px-4 flex items-center gap-3 bg-white/10"
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
    </>
  );
}
