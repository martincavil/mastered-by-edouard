"use client";

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
}: UploadProgressScreenProps) {
  // Calculate safe progress percentage
  const safeProgress = totalFiles > 0 ? Math.round(uploadProgress) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        upload in progress
      </h1>

      {/* Pourcentage */}
      <div className="bg-white rounded-[10px] px-8 py-2">
        <span className="text-2xl font-bold text-black">{safeProgress}%</span>
      </div>

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="w-full max-w-md space-y-2">
          <p className="text-white text-sm font-medium mb-2">
            Uploaded files ({uploadedFiles.length}/{totalFiles})
          </p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="border-2 border-white bg-transparent rounded-[10px] py-2 px-4"
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
