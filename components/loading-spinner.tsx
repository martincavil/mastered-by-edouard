interface LoadingSpinnerProps {
  currentFile?: number;
  totalFiles?: number;
}

export function LoadingSpinner({ currentFile, totalFiles }: LoadingSpinnerProps = {}) {
  const showProgress = currentFile !== undefined && totalFiles !== undefined && totalFiles > 0;
  const percentage = showProgress ? Math.round((currentFile / totalFiles) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        {showProgress && (
          <div className="text-white text-center">
            <p className="text-2xl font-bold">{percentage}%</p>
            <p className="text-sm">
              {currentFile} / {totalFiles} fichiers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
