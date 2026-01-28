"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Track } from "./production-sheet/TrackListSection";
import { FormStep1 } from "./production-sheet/FormStep1";
import { FormStep2 } from "./production-sheet/FormStep2";
import { FormStep3 } from "./production-sheet/FormStep3";
import { SuccessView } from "./production-sheet/SuccessView";
import { NavigationButtons } from "./production-sheet/NavigationButtons";
import { generateProductionSheetPDF } from "@/lib/pdf/generateProductionSheet";

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
  composer: string;
  arranger: string;
  genre: string;
  label: string;
  recordingEngineer: string;
  mixingEngineer: string;
  otherCredits: string;
}

export function ProductionSheet() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [allInfoChecked, setAllInfoChecked] = useState(false);
  const [isAlternativeVersionsOpen, setIsAlternativeVersionsOpen] =
    useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    artist: "",
    email: "",
    projectTitle: "",
    formats: {
      streaming: true,
      dolbyAtmos: false,
      vinyl: false,
      cd: false,
      alternativeVersions: [],
    },
    cdUpc: "",
    vinylUpc: "",
    composer: "",
    arranger: "",
    genre: "",
    label: "",
    recordingEngineer: "",
    mixingEngineer: "",
    otherCredits: "",
  });

  const [tracks, setTracks] = useState<Track[]>([
    { id: "1", title: "", isrc: "" },
  ]);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle format toggles
  const toggleFormat = (format: keyof FormData["formats"]) => {
    if (format === "alternativeVersions") return;
    setFormData((prev) => ({
      ...prev,
      formats: {
        ...prev.formats,
        [format]: !prev.formats[format],
      },
    }));
  };

  // Handle alternative versions toggle
  const toggleAlternativeVersion = (version: string) => {
    setFormData((prev) => {
      const currentVersions = prev.formats.alternativeVersions;
      const isSelected = currentVersions.includes(version);

      return {
        ...prev,
        formats: {
          ...prev.formats,
          alternativeVersions: isSelected
            ? currentVersions.filter((v) => v !== version)
            : [...currentVersions, version],
        },
      };
    });
  };

  // Handle cover upload
  const handleCoverUpload = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setMessage({
        type: "error",
        text: t.sendFiles.productionSheet.errorCoverFormat,
      });
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      if (img.width < 500 || img.height < 500) {
        setMessage({
          type: "error",
          text: t.sendFiles.productionSheet.errorCoverSize,
        });
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setMessage(null);
    };
    img.src = URL.createObjectURL(file);
  };

  // Handle other files upload
  const handleOtherFilesUpload = (files: FileList) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validFiles = Array.from(files).filter((file) => {
      return allowedTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      setMessage({
        type: "error",
        text: t.sendFiles.productionSheet.errorOtherFilesFormat,
      });
    }

    setOtherFiles((prev) => [...prev, ...validFiles]);
  };

  const removeOtherFile = (index: number) => {
    setOtherFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle tracks
  const addTrack = () => {
    setTracks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", isrc: "" },
    ]);
  };

  const removeTrack = (id: string) => {
    if (tracks.length > 1) {
      setTracks((prev) => prev.filter((track) => track.id !== id));
    }
  };

  const updateTrack = (id: string, field: "title" | "isrc", value: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === id ? { ...track, [field]: value } : track,
      ),
    );
  };

  // Validation
  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim())
      newErrors.name = t.sendFiles.productionSheet.errorNameRequired;
    if (!formData.artist.trim())
      newErrors.artist = t.sendFiles.productionSheet.errorArtistRequired;
    if (!formData.email.trim()) {
      newErrors.email = t.sendFiles.productionSheet.errorEmailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.sendFiles.productionSheet.errorEmailInvalid;
    }
    if (!formData.projectTitle.trim())
      newErrors.projectTitle =
        t.sendFiles.productionSheet.errorProjectTitleRequired;

    const hasFormat =
      formData.formats.streaming ||
      formData.formats.dolbyAtmos ||
      formData.formats.vinyl ||
      formData.formats.cd ||
      formData.formats.alternativeVersions.length > 0;

    if (!hasFormat) {
      newErrors.formats = t.sendFiles.productionSheet.errorFormatRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (tracks.length === 0) {
      newErrors.tracks = t.sendFiles.productionSheet.errorTracksRequired;
    } else {
      const emptyTitles = tracks.filter((t) => !t.title.trim());
      if (emptyTitles.length > 0) {
        newErrors.tracks = t.sendFiles.productionSheet.errorTracksTitleRequired;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!allInfoChecked) {
      newErrors.checkbox = t.sendFiles.productionSheet.errorCheckboxRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const goToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    }
  };

  const goToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      setErrors({});
    }
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setErrors({});
  };

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Generate PDF
      const pdfBlob = await generateProductionSheetPDF({
        ...formData,
        tracks,
      });

      const submitData = new FormData();
      submitData.append("formData", JSON.stringify({ ...formData, tracks }));

      if (coverFile) {
        submitData.append("cover", coverFile);
      }

      otherFiles.forEach((file) => {
        submitData.append("otherFiles", file);
      });

      // Add generated PDF
      submitData.append("productionSheetPdf", pdfBlob, "production-sheet.pdf");

      const response = await fetch("/api/production-sheet", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSubmitSuccess(true);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-3">
        {submitSuccess ? (
          <SuccessView t={t} />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-2 2xl:space-y-4"
          >
            <div className="bg-white px-4 py-6 2xl:py-8 2xl:px-6 rounded-[10px] h-[350px] max-h-[350px] 2xl:h-full 2xl:max-h-[700px] overflow-y-auto">
              <div key={currentStep} className="animate-slide-in">
                {/* STEP 1 - INFORMATIONS */}
                {currentStep === 1 && (
                  <FormStep1
                    formData={formData}
                    errors={errors}
                    t={t}
                    onInputChange={handleInputChange}
                    onFormatToggle={toggleFormat}
                    onAlternativeVersionToggle={toggleAlternativeVersion}
                    isAlternativeVersionsOpen={isAlternativeVersionsOpen}
                    setIsAlternativeVersionsOpen={setIsAlternativeVersionsOpen}
                    coverPreview={coverPreview}
                    setCoverFile={setCoverFile}
                    setCoverPreview={setCoverPreview}
                    handleCoverUpload={handleCoverUpload}
                    handleOtherFilesUpload={handleOtherFilesUpload}
                    otherFiles={otherFiles}
                    removeOtherFile={removeOtherFile}
                  />
                )}

                {/* STEP 2 - TRACK LIST */}
                {currentStep === 2 && (
                  <FormStep2
                    tracks={tracks}
                    errors={errors}
                    t={t}
                    onAddTrack={addTrack}
                    onRemoveTrack={removeTrack}
                    onUpdateTrack={updateTrack}
                    onBack={goBack}
                  />
                )}

                {/* STEP 3 - CREDITS */}
                {currentStep === 3 && (
                  <FormStep3
                    formData={formData}
                    t={t}
                    onInputChange={handleInputChange}
                    onBack={goBack}
                  />
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`mt-2 py-1.5 px-4 rounded-lg text-xs ${
                    message.type === "success"
                      ? "bg-green-500/20 text-green-700"
                      : "bg-red-500/20 text-red"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <NavigationButtons
              currentStep={currentStep}
              allInfoChecked={allInfoChecked}
              isSubmitting={isSubmitting}
              t={t}
              onAllInfoCheckedChange={setAllInfoChecked}
              onStep2Click={goToStep2}
              onStep3Click={goToStep3}
            />
          </form>
        )}

        {!submitSuccess && (
          <p className="text-black font-extralight text-sm">
            {t.sendFiles.productionSheet.termsAndConditions}
          </p>
        )}
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden md:flex flex-col items-center md:items-end justify-end space-y-4 2xl:space-y-20">
        <div className="flex flex-col self-start">
          <span className="text-5xl xl:text-[90px] 2xl:text-[100px] font-bold text-white leading-[0.8]">
            {submitSuccess
              ? t.sendFiles.productionSheet.headlineSuccess1
              : t.sendFiles.productionSheet.headline1}
          </span>
          <span className="text-5xl xl:text-[90px] 2xl:text-[100px] font-bold text-black leading-[0.8]">
            {submitSuccess
              ? t.sendFiles.productionSheet.headlineSuccess2
              : t.sendFiles.productionSheet.headline2}
          </span>
        </div>
        <Image
          src="https://www.dropbox.com/scl/fi/iwj6fuky5hk2my2qa0pa7/send-files.webp?rlkey=ucreqy7vx1p7mhahrv6hatzgc&st=3u0iinfy&dl=1"
          alt="Edouard SendFiles Illustration"
          width={271}
          height={271}
          className="object-cover w-48 h-48 2xl:w-[271px] 2xl:h-[271px]"
        />
      </div>
      {isSubmitting && <LoadingSpinner />}
    </>
  );
}
