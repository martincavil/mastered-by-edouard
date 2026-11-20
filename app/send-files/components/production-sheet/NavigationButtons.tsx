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
  "flex-1 bg-red-dark text-white font-bold text-lg px-6 py-2.5 2xl:py-3 rounded-[10px] hover:bg-black transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-dark";

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
    <div className="flex flex-col gap-2">
      {currentStep === 3 && (
        <label className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-[10px] cursor-pointer">
          <input
            type="checkbox"
            checked={allInfoChecked}
            onChange={(e) => onAllInfoCheckedChange(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-black">{labels.allInfoChecked}</span>
        </label>
      )}

      <div className="flex items-stretch gap-2 w-full">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onBack}
            className="bg-white text-black font-bold px-5 py-2.5  rounded-[10px] hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            {labels.back}
          </button>
        )}

        {currentStep === 1 && (
          <button type="button" onClick={onStep2Click} className={primaryClass}>
            {labels.nextTrackList}
            <ArrowUpRight size={20} />
          </button>
        )}

        {currentStep === 2 && (
          <button type="button" onClick={onStep3Click} className={primaryClass}>
            {labels.nextCredits}
            <ArrowUpRight size={20} />
          </button>
        )}

        {currentStep === 3 && (
          <button
            type="submit"
            disabled={isSubmitting || !allInfoChecked}
            className={primaryClass}
          >
            {labels.sendDocument}
            <ArrowUpRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  currentStep: number;
  t: Translations;
  /** Only previous steps can be reached from the indicator (next steps need validation) */
  onStepClick: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  t,
  onStepClick,
}: StepIndicatorProps) {
  const labels = t.sendFiles.productionSheet;
  const steps = [labels.step1Title, labels.step2Title, labels.step3Title];

  return (
    <ol className="flex items-center gap-2 mb-3 2xl:mb-5">
      {steps.map((title, index) => {
        const step = index + 1;
        const isCurrent = step === currentStep;
        const isPast = step < currentStep;
        return (
          <li key={step} className="flex-1 min-w-0">
            <button
              type="button"
              disabled={!isPast}
              onClick={() => onStepClick(step)}
              aria-current={isCurrent ? "step" : undefined}
              className="w-full text-left disabled:cursor-default group"
            >
              <span
                className={`block h-1.5 rounded-full transition-colors ${
                  isCurrent || isPast ? "bg-red-dark" : "bg-[#E5E5E5]"
                }`}
              />
              <span
                className={`block mt-1.5 text-xs 2xl:text-sm truncate ${
                  isCurrent
                    ? "text-black font-bold"
                    : "text-black/50 group-enabled:group-hover:text-black"
                }`}
              >
                {step}. {title.replace(/\.$/, "")}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
