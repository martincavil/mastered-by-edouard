"use client";

import { DragEvent, useRef, ChangeEvent, useState } from "react";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

interface UploadSectionProps {
  label: string;
  hint: string;
  tooltipTitle: string;
  tooltipHints: string[];
  onUpload: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
}

export function UploadSection({
  label,
  hint,
  tooltipTitle,
  tooltipHints,
  onUpload,
  accept,
  multiple = false,
  children,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const tooltipButtonRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTooltipHover = () => {
    if (tooltipButtonRef.current) {
      const rect = tooltipButtonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.left,
      });
      setShowTooltip(true);
    }
  };

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
          className="relative border-dashed-custom rounded-[10px] py-3 px-6 cursor-pointer bg-black/10 transition-colors hover:opacity-80"
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
            <ArrowUpRight size={14} className="text-black/60" />
          </div>
          <div
            ref={tooltipButtonRef}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleTooltipHover}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center cursor-help bg-transaprent hover:bg-black hover:text-white transition-colors shadow-md shadow-black/30">
              <span className="text-xs font-medium">i</span>
            </div>
          </div>
          {/* Tooltip with fixed positioning */}
          {showTooltip && (
            <div
              className="fixed bg-black backdrop-blur-md text-white rounded-lg p-5 text-xs border border-white z-[9999] w-max max-w-[200px] md:max-w-xs"
              style={{
                top: `${tooltipPosition.top - 10}px`,
                left:
                  window.innerWidth < 768
                    ? `${tooltipPosition.left - 100}px`
                    : `${tooltipPosition.left + 30}px`,
                transform:
                  window.innerWidth < 768
                    ? "translateY(-100%)"
                    : "translateY(-50%)",
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">{tooltipTitle}</span>
                {tooltipHints.map((hint, index) => (
                  <span key={index} className="font-poppins text-xs">
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
