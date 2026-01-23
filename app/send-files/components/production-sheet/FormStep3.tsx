"use client";

import { ArrowLeft } from "lucide-react";
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
  onBack: () => void;
}

export function FormStep3({ formData, t, onInputChange, onBack }: FormStep3Props) {
  return (
    <div className="space-y-2 2xl:space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl 2xl:text-6xl font-bold text-black">
          {t.sendFiles.productionSheet.step3Title}
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-black hover:text-red-dark transition-colors"
        >
          <ArrowLeft size={20} />
          {t.sendFiles.productionSheet.back}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="composer"
          value={formData.composer}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.composer}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg text-black placeholder:text-black"
        />
        <input
          type="text"
          name="arranger"
          value={formData.arranger}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.arranger}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg text-black placeholder:text-black"
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.genre}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg text-black placeholder:text-black"
        />
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.label}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg text-black placeholder:text-black"
        />
        <input
          type="text"
          name="recordingEngineer"
          value={formData.recordingEngineer}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.recordingEngineer}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg text-black placeholder:text-black"
        />
        <input
          type="text"
          name="mixingEngineer"
          value={formData.mixingEngineer}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.mixingEngineer}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg text-black placeholder:text-black"
        />
      </div>

      <textarea
        name="otherCredits"
        value={formData.otherCredits}
        onChange={onInputChange}
        placeholder={t.sendFiles.productionSheet.otherCredits}
        rows={4}
        className="w-full px-4 py-1.5 2xl:px-6 2xl:py-3 bg-gray-100 rounded-lg text-black placeholder:text-black resize-none"
      />
    </div>
  );
}
