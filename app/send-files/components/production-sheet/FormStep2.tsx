"use client";

import { Translations } from "@/lib/i18n/types";
import { TrackListSection, Track } from "./TrackListSection";

interface FormStep2Props {
  tracks: Track[];
  errors: { [key: string]: string };
  t: Translations;
  onAddTrack: () => void;
  onRemoveTrack: (id: string) => void;
  onUpdateTrack: (id: string, field: "title" | "isrc", value: string) => void;
}

export function FormStep2({
  tracks,
  errors,
  t,
  onAddTrack,
  onRemoveTrack,
  onUpdateTrack,
}: FormStep2Props) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-2 2xl:space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-black">
            {t.sendFiles.productionSheet.step2Title}
          </h2>
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
    </div>
  );
}
