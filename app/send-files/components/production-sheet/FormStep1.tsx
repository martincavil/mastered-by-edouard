"use client";

import { X } from "lucide-react";
import { ChangeEvent } from "react";
import { Translations } from "@/lib/i18n/types";
import { FormatToggleButton } from "./FormatToggleButton";
import { AlternativeVersionsDropdown } from "./AlternativeVersionsDropdown";
import { UploadSection } from "./UploadSection";

interface FormData {
  name: string;
  artist: string;
  email: string;
  projectTitle: string;
  formats: {
    streaming: boolean;
    dolbyAtmos: boolean;
    vinyl: boolean;
    cd: boolean;
    alternativeVersions: string[];
  };
  cdUpc: string;
  vinylUpc: string;
}

interface FormStep1Props {
  formData: FormData;
  errors: { [key: string]: string };
  t: Translations;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFormatToggle: (format: keyof FormData["formats"]) => void;
  onAlternativeVersionToggle: (version: string) => void;
  isAlternativeVersionsOpen: boolean;
  setIsAlternativeVersionsOpen: (open: boolean) => void;
  coverPreview: string | null;
  setCoverFile: (file: File | null) => void;
  setCoverPreview: (preview: string | null) => void;
  handleCoverUpload: (files: FileList) => void;
  handleOtherFilesUpload: (files: FileList) => void;
  otherFiles: File[];
  removeOtherFile: (index: number) => void;
}

export function FormStep1({
  formData,
  errors,
  t,
  onInputChange,
  onFormatToggle,
  onAlternativeVersionToggle,
  isAlternativeVersionsOpen,
  setIsAlternativeVersionsOpen,
  coverPreview,
  setCoverFile,
  setCoverPreview,
  handleCoverUpload,
  handleOtherFilesUpload,
  otherFiles,
  removeOtherFile,
}: FormStep1Props) {
  return (
    <div className="space-y-2 2xl:space-y-3">
      <h2 className="text-3xl 2xl:text-6xl font-bold text-black">
        {t.sendFiles.productionSheet.step1Title}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.name}
          className={`w-full px-4 py-1.5 2xl:px-6 2xl:py-3 bg-gray-100 rounded-lg text-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
            errors.name ? "ring-2 ring-inset ring-red" : ""
          }`}
          required
        />
        <input
          type="text"
          name="artist"
          value={formData.artist}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.artist}
          className={`w-full px-4 py-1.5 2xl:px-6 2xl:py-3 bg-gray-100 rounded-lg text-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
            errors.artist ? "ring-2 ring-inset ring-red" : ""
          }`}
          required
        />
      </div>

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder={t.sendFiles.productionSheet.mail}
        className={`w-full px-4 py-1.5 2xl:px-6 2xl:py-3 bg-gray-100 rounded-lg text-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
          errors.email ? "ring-2 ring-inset ring-red" : ""
        }`}
        required
      />

      <input
        type="text"
        name="projectTitle"
        value={formData.projectTitle}
        onChange={onInputChange}
        placeholder={t.sendFiles.productionSheet.projectTitle}
        className={`w-full px-4 py-1.5 2xl:px-6 2xl:py-3 bg-gray-100 rounded-lg text-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
          errors.projectTitle ? "ring-2 ring-inset ring-red" : ""
        }`}
        required
      />

      {/* Formats */}
      <div className="flex flex-wrap gap-2 2xl:gap-4 items-start">
        {(
          [
            { key: "streaming", label: t.sendFiles.productionSheet.streaming },
            {
              key: "dolbyAtmos",
              label: t.sendFiles.productionSheet.dolbyAtmos,
            },
            { key: "vinyl", label: t.sendFiles.productionSheet.vinyl },
            { key: "cd", label: t.sendFiles.productionSheet.cd },
          ] as const
        ).map((format) => (
          <FormatToggleButton
            key={format.key}
            label={format.label}
            isSelected={formData.formats[format.key]}
            onClick={() => onFormatToggle(format.key)}
          />
        ))}

        <AlternativeVersionsDropdown
          label={t.sendFiles.productionSheet.alternativeVersions}
          selectedVersions={formData.formats.alternativeVersions}
          isOpen={isAlternativeVersionsOpen}
          onToggle={() =>
            setIsAlternativeVersionsOpen(!isAlternativeVersionsOpen)
          }
          onVersionToggle={onAlternativeVersionToggle}
        />
      </div>
      {errors.formats && <p className="text-red text-xs">{errors.formats}</p>}

      {/* UPC Codes */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="cdUpc"
          value={formData.cdUpc}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.cdUpc}
          className="w-full px-4 py-1 2xl:py-2 border border-black rounded-full text-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-red outline-none"
        />
        <input
          type="text"
          name="vinylUpc"
          value={formData.vinylUpc}
          onChange={onInputChange}
          placeholder={t.sendFiles.productionSheet.vinylUpc}
          className="w-full px-4 py-1 2xl:py-2 border border-black rounded-full text-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-red outline-none"
        />
      </div>

      <div className="flex items-center w-full gap-3">
        {/* Upload Cover */}
        <UploadSection
          label={t.sendFiles.productionSheet.uploadCover}
          hint={t.sendFiles.productionSheet.uploadCoverHint}
          tooltipTitle={t.sendFiles.productionSheet.uploadCoverTooltipTitle}
          tooltipHints={t.sendFiles.productionSheet.uploadCoverTooltipHints}
          onUpload={handleCoverUpload}
          accept=".jpeg,.jpg,.png"
        >
          {coverPreview ? (
            <div className="relative">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview(null);
                }}
                className="absolute top-2 right-2 bg-red text-white p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ) : undefined}
        </UploadSection>

        {/* Upload Other Files */}
        <UploadSection
          label={t.sendFiles.productionSheet.uploadOtherFiles}
          hint={t.sendFiles.productionSheet.uploadOtherFilesHint}
          tooltipTitle={
            t.sendFiles.productionSheet.uploadOtherFilesTooltipTitle
          }
          tooltipHints={
            t.sendFiles.productionSheet.uploadOtherFilesTooltipHints
          }
          onUpload={handleOtherFilesUpload}
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          multiple
        />
      </div>

      {/* Other Files List */}
      {otherFiles.length > 0 && (
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {otherFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-black/10 rounded-lg px-3 py-1"
            >
              <p className="text-xs text-black truncate">{file.name}</p>
              <button
                type="button"
                onClick={() => removeOtherFile(index)}
                className="text-red hover:text-red-dark"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
