"use client";

import { MoveUpRight } from "lucide-react";
import { DragEvent, useRef, ChangeEvent } from "react";

interface UploadSectionProps {
  label: string;
  hint: string;
  onUpload: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
}

export function UploadSection({
  label,
  hint,
  onUpload,
  accept,
  multiple = false,
  children,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="w-full space-y-2">
      {children ? (
        children
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="relative border border-dashed border-black rounded-[10px] py-3 px-6 cursor-pointer hover:border-black/50 bg-black/10 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex justify-center items-center gap-3">
            <p className="text-xs text-black/60">{label}</p>
            <MoveUpRight size={14} className="text-black/60" />
          </div>
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center cursor-help bg-white hover:bg-black hover:text-white transition-colors">
              <span className="text-xs font-medium">i</span>
            </div>
            {/* Tooltip */}
            <div className="absolute right-0 md:left-full bottom-full md:bottom-auto md:top-1/2 md:-translate-y-1/2 mb-2 md:mb-0 md:ml-3 left-1/2 -translate-x-1/2 md:translate-x-0 hidden group-hover:block bg-black text-white rounded-lg px-3 py-2 text-xs shadow-xl z-50 w-max max-w-[200px] md:max-w-xs">
              {hint}
              {/* Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full md:top-1/2 md:left-0 md:-translate-x-0 md:-translate-y-1/2 md:right-full">
                <div className="border-4 border-transparent border-t-black md:border-t-transparent md:border-r-black"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
