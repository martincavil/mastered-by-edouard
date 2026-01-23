"use client";

import { X } from "lucide-react";

interface FormatToggleButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function FormatToggleButton({
  label,
  isSelected,
  onClick,
}: FormatToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1 2xl:py-2 rounded-full border-2 text-sm transition-colors flex items-center gap-2 ${
        isSelected
          ? "bg-black text-white border-black"
          : "bg-white text-black border-black"
      }`}
    >
      {label}
      {isSelected && <X size={16} />}
    </button>
  );
}
