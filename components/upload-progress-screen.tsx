"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";

interface UploadProgressScreenProps {
  uploadProgress: number;
  uploadedFiles: string[];
  totalFiles: number;
  allFiles: string[];
  onClose: () => void;
}

export function UploadProgressScreen({
  uploadProgress,
  allFiles,
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

      {/* Liste de tous les fichiers */}
      {allFiles.length > 0 && (
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
