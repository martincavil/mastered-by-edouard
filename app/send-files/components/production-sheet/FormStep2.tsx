"use client";

import { ArrowLeft } from "lucide-react";
import { Translations } from "@/lib/i18n/types";
import { TrackListSection, Track } from "./TrackListSection";

interface FormStep2Props {
  tracks: Track[];
  errors: { [key: string]: string };
  t: Translations;
  onAddTrack: () => void;
  onRemoveTrack: (id: string) => void;
  onUpdateTrack: (id: string, field: "title" | "isrc", value: string) => void;
  onBack: () => void;
}

export function FormStep2({
  tracks,
  errors,
  t,
  onAddTrack,
  onRemoveTrack,
  onUpdateTrack,
  onBack,
}: FormStep2Props) {
  return (
    <div className="space-y-2 2xl:space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl 2xl:text-6xl font-bold text-black">
          {t.sendFiles.productionSheet.step2Title}
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

      <TrackListSection
        tracks={tracks}
        onAddTrack={onAddTrack}
        onRemoveTrack={onRemoveTrack}
        onUpdateTrack={onUpdateTrack}
        trackTitleLabel={t.sendFiles.productionSheet.trackTitle}
        isrcCodeLabel={t.sendFiles.productionSheet.isrcCode}
        addTrackLabel={t.sendFiles.productionSheet.addTrack}
      />

      {errors.tracks && <p className="text-red text-xs">{errors.tracks}</p>}
    </div>
  );
}
