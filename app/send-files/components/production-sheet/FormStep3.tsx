"use client";

import { ChangeEvent } from "react";
import { Translations } from "@/lib/i18n/types";

interface FormData {
  composer: string;
  arranger: string;
  genre: string;
  label: string;
  recordingEngineer: string;
  mixingEngineer: string;
  otherCredits: string;
}

interface FormStep3Props {
  formData: FormData;
  t: Translations;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function FormStep3({ formData, t, onInputChange }: FormStep3Props) {
  return (
    <div className="space-y-4 2xl:space-y-6 mdshort:space-y-3 py-1">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl xl:text-5xl 2xl:text-6xl mdshort:text-4xl font-bold text-black leading-none mb-2 2xl:mb-4 mdshort:mb-1">
          {t.sendFiles.productionSheet.step3Title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <input
          type="text"
          name="composer"
          value={formData.composer}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.composer}
          className="w-full px-6 py-2.5 2xl:py-4 mdshort:py-2 bg-[#E5E5E5] rounded-[10px] text-lg 2xl:text-xl mdshort:text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-0"
        />
        <input
          type="text"
          name="arranger"
          value={formData.arranger}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.arranger}
          className="w-full px-6 py-2.5 2xl:py-4 mdshort:py-2 bg-[#E5E5E5] rounded-[10px] text-lg 2xl:text-xl mdshort:text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-0"
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.genre}
          className="w-full px-6 py-2.5 2xl:py-4 mdshort:py-2 bg-[#E5E5E5] rounded-[10px] text-lg 2xl:text-xl mdshort:text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-0"
        />
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.label}
          className="w-full px-6 py-2.5 2xl:py-4 mdshort:py-2 bg-[#E5E5E5] rounded-[10px] text-lg 2xl:text-xl mdshort:text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-0"
        />
        <input
          type="text"
          name="recordingEngineer"
          value={formData.recordingEngineer}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.recordingEngineer}
          className="w-full px-6 py-2.5 2xl:py-4 mdshort:py-2 bg-[#E5E5E5] rounded-[10px] text-lg 2xl:text-xl mdshort:text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-0"
        />
        <input
          type="text"
          name="mixingEngineer"
          value={formData.mixingEngineer}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.mixingEngineer}
          className="w-full px-6 py-2.5 2xl:py-4 mdshort:py-2 bg-[#E5E5E5] rounded-[10px] text-lg 2xl:text-xl mdshort:text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-0"
        />
      </div>

      <textarea
        name="otherCredits"
        value={formData.otherCredits}
        onChange={onInputChange}
        placeholder={t.sendFiles.productionSheet.otherCredits}
        rows={4}
        className="w-full px-6 py-2.5 2xl:py-4 mdshort:py-2 bg-[#E5E5E5] rounded-[10px] text-lg 2xl:text-xl mdshort:text-base text-black placeholder:text-black resize-none focus:ring-2 focus:ring-red outline-none"
      />
    </div>
  );
}
