"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";

interface FileProgress {
  name: string;
  progress?: number; // 0-100
  uploading?: boolean;
}

interface UploadProgressScreenProps {
  uploadProgress: number;
  uploadedFiles: string[];
  totalFiles: number;
  allFiles: string[];
  filesWithProgress?: FileProgress[];
  onClose: () => void;
}

export function UploadProgressScreen({
  uploadProgress,
  allFiles,
  filesWithProgress,
}: UploadProgressScreenProps) {
  const t = useTranslations();
  // Calculate safe progress percentage
  const safeProgress =
    !isNaN(uploadProgress) && isFinite(uploadProgress)
      ? Math.round(uploadProgress)
      : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {/* Pourcentage */}
      <div className="bg-white rounded-[10px] border-black px-12 py-2">
        <span className="text-2xl font-bold text-black">{safeProgress}%</span>
      </div>

      {/* Liste de tous les fichiers avec barres de progression */}
      {(filesWithProgress && filesWithProgress.length > 0) ? (
        <div className="w-full max-w-7xl flex flex-col items-center space-y-2">
          <div className="w-full space-y-3 max-h-[300px] overflow-y-auto px-2">
            {filesWithProgress.map((file, index) => {
              const fileProgress = file.progress || 0;
              const safeFileProgress = !isNaN(fileProgress) && isFinite(fileProgress) ? Math.round(fileProgress) : 0;

              return (
                <div
                  key={index}
                  className="border border-white bg-white/5 rounded-md py-3 px-4 w-full space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm truncate block flex-1">
                      {file.name}
                    </span>
                    <span className="text-white text-sm ml-2 font-medium">
                      {safeFileProgress}%
                    </span>
                  </div>
                  {/* Barre de progression */}
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${safeFileProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : allFiles.length > 0 && (
        <div className="w-full max-w-7xl flex flex-col items-center space-y-2">
          <div className="w-full space-y-2 max-h-[300px] overflow-y-auto">
            {allFiles.map((file, index) => (
              <div
                key={index}
                className="border border-white bg-white/5 rounded-md py-2 px-4 w-full"
              >
                <span className="text-white text-sm truncate block">
                  {file}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
