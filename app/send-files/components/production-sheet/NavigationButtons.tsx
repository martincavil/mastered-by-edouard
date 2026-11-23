"use client";

import { ArrowLeft } from "lucide-react";
import { Translations } from "@/lib/i18n/types";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

interface NavigationButtonsProps {
  currentStep: number;
  allInfoChecked: boolean;
  isSubmitting: boolean;
  t: Translations;
  onAllInfoCheckedChange: (checked: boolean) => void;
  onStep2Click: () => void;
  onStep3Click: () => void;
  onBack: () => void;
}

const primaryClass =
  "w-full max-w-[33%] bg-red-dark text-white font-bold text-lg 2xl:text-xl px-6 py-2.5 2xl:py-3.5 mdshort:py-2 rounded-[10px] hover:bg-black transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-dark";

export function NavigationButtons({
  currentStep,
  allInfoChecked,
  isSubmitting,
  t,
  onAllInfoCheckedChange,
  onStep2Click,
  onStep3Click,
  onBack,
}: NavigationButtonsProps) {
  const labels = t.sendFiles.productionSheet;

  return (
    <div className="flex flex-col gap-3">
      {currentStep === 3 && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allInfoChecked}
            onChange={(e) => onAllInfoCheckedChange(e.target.checked)}
            className="w-4 h-4 accent-black"
          />
          <span className="text-sm 2xl:text-base text-black font-light">
            {labels.allInfoChecked}
          </span>
        </label>
      )}

      <div className="flex items-end justify-between gap-6 w-full">
        {/* Step counter, underlined (mockup "1/3") */}
        <div className="flex items-end gap-4 w-full max-w-[33%]">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-black text-sm 2xl:text-base hover:text-red transition-colors pb-1.5"
            >
              <ArrowLeft size={16} />
              {labels.back}
            </button>
          )}
          <span className="flex-1 text-center font-bold text-black text-lg 2xl:text-xl border-b border-black pb-1">
            {currentStep}/3
          </span>
        </div>

        {currentStep === 1 && (
          <button type="button" onClick={onStep2Click} className={primaryClass}>
            {labels.nextTrackList}
            <ArrowUpRight size={24} />
          </button>
        )}

        {currentStep === 2 && (
          <button type="button" onClick={onStep3Click} className={primaryClass}>
            {labels.nextCredits}
            <ArrowUpRight size={24} />
          </button>
        )}

        {currentStep === 3 && (
          <button
            type="submit"
            disabled={isSubmitting || !allInfoChecked}
            className={primaryClass}
          >
            {labels.sendDocument}
            <ArrowUpRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
