"use client";

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
}

export function NavigationButtons({
  currentStep,
  allInfoChecked,
  isSubmitting,
  t,
  onAllInfoCheckedChange,
  onStep2Click,
  onStep3Click,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Step indicator / Checkbox for step 3 */}
      {currentStep === 3 ? (
        <label className="w-full flex items-center gap-2 bg-white px-4 py-2 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={allInfoChecked}
            onChange={(e) => onAllInfoCheckedChange(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-black">
            {t.sendFiles.productionSheet.allInfoChecked}
          </span>
          <span className="ml-auto text-black font-bold">{currentStep}/3</span>
        </label>
      ) : (
        <div className="flex items-center justify-center bg-white w-full px-4 py-2 rounded-lg text-black font-bold">
          {currentStep}/3
        </div>
      )}

      {/* Action button */}
      {currentStep === 1 && (
        <button
          type="button"
          onClick={onStep2Click}
          className="w-full bg-red-dark text-white font-bold px-6 py-2 rounded-lg hover:bg-red-dark/80 transition-colors flex items-center justify-center gap-2"
        >
          {t.sendFiles.productionSheet.nextTrackList}
          <ArrowUpRight size={20} />
        </button>
      )}

      {currentStep === 2 && (
        <button
          type="button"
          onClick={onStep3Click}
          className="w-full bg-red-dark text-white font-bold px-6 py-2 rounded-lg hover:bg-red-dark/80 transition-colors flex items-center justify-center gap-2"
        >
          {t.sendFiles.productionSheet.nextCredits}
          <ArrowUpRight size={20} />
        </button>
      )}

      {currentStep === 3 && (
        <button
          type="submit"
          disabled={isSubmitting || !allInfoChecked}
          className="w-full bg-red-dark text-white font-bold px-6 py-2 rounded-lg hover:bg-red-dark/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.sendFiles.productionSheet.sendDocument}
          <ArrowUpRight size={20} />
        </button>
      )}
    </div>
  );
}
