"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import Link from "next/link";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { UploadProgressScreen } from "@/components/upload-progress-screen";
import { useUploadTracker } from "@/lib/use-upload-tracker";
import {
  createDropboxFolder,
  getDropboxUploadToken,
  sanitizeForDropbox,
  uploadToDropbox,
} from "@/lib/dropbox-upload";
import { Track } from "./production-sheet/TrackListSection";
import { FormStep1 } from "./production-sheet/FormStep1";
import { FormStep2 } from "./production-sheet/FormStep2";
import { FormStep3 } from "./production-sheet/FormStep3";
import { NavigationButtons } from "./production-sheet/NavigationButtons";
import { Button } from "@/components/button";

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

interface ProductionSheetProps {
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  /** Called once everything is on Dropbox (shows the "files sent." screen) */
  onSuccess: () => void;
}

export function ProductionSheet({
  isUploading,
  setIsUploading,
  onSuccess,
}: ProductionSheetProps) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [allInfoChecked, setAllInfoChecked] = useState(false);
  const [isAlternativeVersionsOpen, setIsAlternativeVersionsOpen] =
    useState(false);
  const tracker = useUploadTracker();
  const abortRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    artist: "",
    email: "",
    projectTitle: "",
    formats: {
      streaming: false,
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

  // Submit: PDF generated in the browser, then every file (PDF, cover, other
  // files) is uploaded directly to Dropbox, one after the other. Progress is
  // computed on the total bytes of all of them.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setMessage(null);
    setIsUploading(true);

    const artistName = sanitizeForDropbox(formData.artist.toLowerCase());
    const pdfName = `${artistName}-production_sheet.pdf`;
    const coverName = coverFile
      ? `cover.${coverFile.name.split(".").pop()}`
      : null;

    // Show the screen right away, with a size estimate for the PDF until it exists
    const plannedNames = [
      pdfName,
      ...(coverName ? [coverName] : []),
      ...otherFiles.map((f) => f.name),
    ];
    tracker.start([
      { name: pdfName, size: 200 * 1024 },
      ...(coverFile && coverName
        ? [{ name: coverName, size: coverFile.size }]
        : []),
      ...otherFiles.map((f) => ({ name: f.name, size: f.size })),
    ]);

    try {
      // PDF generated server-side (pdf-lib), as before
      const pdfResponse = await fetch("/api/production-sheet-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tracks }),
      });
      if (!pdfResponse.ok) throw new Error("Failed to generate PDF");
      const pdfBlob = await pdfResponse.blob();

      const uploads: { name: string; blob: Blob }[] = [
        { name: pdfName, blob: pdfBlob },
        ...(coverFile && coverName
          ? [{ name: coverName, blob: coverFile as Blob }]
          : []),
        ...otherFiles.map((f) => ({ name: f.name, blob: f as Blob })),
      ];
      // Real sizes now that the PDF is generated
      tracker.start(uploads.map((u) => ({ name: u.name, size: u.blob.size })));

      const accessToken = await getDropboxUploadToken();
      const folderPath = `/01_uploads/${artistName}`;
      await createDropboxFolder(accessToken, folderPath);

      for (const [index, upload] of uploads.entries()) {
        tracker.setStatus(index, "uploading");
        try {
          await uploadToDropbox(upload.blob, {
            token: accessToken,
            path: `${folderPath}/${sanitizeForDropbox(upload.name)}`,
            onProgress: (bytes) => tracker.setLoaded(index, bytes),
            signal: controller.signal,
          });
          tracker.setStatus(index, "done");
        } catch (err) {
          tracker.setStatus(index, "error");
          throw err;
        }
      }

      // Notification + confirmation emails (non-blocking: files are already on Dropbox)
      try {
        const emailResponse = await fetch(
          "/api/production-sheet-notification",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              artist: formData.artist,
              projectTitle: formData.projectTitle,
              fileNames: plannedNames,
              folderPath,
            }),
          },
        );
        if (!emailResponse.ok) {
          console.error(
            "Production sheet notification failed:",
            await emailResponse.text(),
          );
        }
      } catch (emailError) {
        console.error("Production sheet notification failed:", emailError);
      }

      // Let the bar reach 100% before closing the progress screen
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSuccess();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit",
      });
    } finally {
      abortRef.current = null;
      tracker.stop();
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <UploadProgressScreen
        uploadProgress={tracker.progress}
        uploadedFiles={tracker.files
          .filter((f) => f.status === "done")
          .map((f) => f.name)}
        totalFiles={tracker.files.length}
        allFiles={tracker.files.map((f) => f.name)}
        onClose={() => {}}
      />
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="hidden md:flex bg-white rounded-[10px] h-full min-h-0 p-6 md:p-8 xl:p-10 mdshort:p-6 flex-col gap-4 xl:gap-6 mdshort:gap-3 overflow-y-auto"
      >
        <div key={currentStep} className="animate-slide-in flex-1">
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
            />
          )}

          {/* STEP 3 - CREDITS */}
          {currentStep === 3 && (
            <FormStep3
              formData={formData}
              t={t}
              onInputChange={handleInputChange}
            />
          )}
        </div>

        {message && (
          <div
            role="alert"
            className={`py-2 px-4 rounded-[10px] text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-700"
                : "bg-red/10 text-red"
            }`}
          >
            {message.text}
          </div>
        )}

        <p className="text-black text-sm 2xl:text-base font-light">
          {t.sendFiles.productionSheet.termsAndConditions.beforeLink}{" "}
          <Link
            href="/terms-and-conditions"
            target="_blank"
            className="font-bold hover:underline"
          >
            {t.sendFiles.productionSheet.termsAndConditions.linkText}
          </Link>
          {t.sendFiles.productionSheet.termsAndConditions.afterLink}
        </p>

        <NavigationButtons
          currentStep={currentStep}
          allInfoChecked={allInfoChecked}
          isSubmitting={isUploading}
          t={t}
          onAllInfoCheckedChange={setAllInfoChecked}
          onStep2Click={goToStep2}
          onStep3Click={goToStep3}
          onBack={goBack}
        />
      </form>

      {/* Mobile Disclaimer */}
      <div className="md:hidden flex flex-col items-center justify-center bg-black p-6 rounded-[10px] h-full overflow-y-auto text-center text-white space-y-4">
        <p>{t.sendFiles.productionSheet.mobileDisclaimer}</p>
        <Button
          href="/"
          variant="custom"
          bgColor="#ffffff"
          hoverBgColor="#e20600"
          textColor="#000000"
          hoverTextColor="#ffffff"
          borderColor="#ffffff"
          className="rounded-full text-base !py-1"
        >
          {t.notFound.backHome}.
        </Button>
      </div>
    </>
  );
}
