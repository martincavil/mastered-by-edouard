"use client";

import { X, Plus } from "lucide-react";

export interface Track {
  id: string;
  title: string;
  isrc: string;
}

interface TrackListSectionProps {
  tracks: Track[];
  onAddTrack: () => void;
  onRemoveTrack: (id: string) => void;
  onUpdateTrack: (id: string, field: "title" | "isrc", value: string) => void;
  trackTitleLabel: string;
  isrcCodeLabel: string;
  addTrackLabel: string;
}

export function TrackListSection({
  tracks,
  onAddTrack,
  onRemoveTrack,
  onUpdateTrack,
  trackTitleLabel,
  isrcCodeLabel,
  addTrackLabel,
}: TrackListSectionProps) {
  return (
    <>
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {tracks.map((track, index) => (
          <div key={track.id} className="flex gap-2">
            <input
              type="text"
              value={track.title}
              onChange={(e) => onUpdateTrack(track.id, "title", e.target.value)}
              placeholder={`${index + 1}. ${trackTitleLabel}`}
              className="w-full px-4 py-2 2xl:py-3 bg-gray-100 rounded-lg text-black placeholder:text-black focus:ring-2 focus:ring-red outline-none"
            />
            <input
              type="text"
              value={track.isrc}
              onChange={(e) => onUpdateTrack(track.id, "isrc", e.target.value)}
              placeholder={isrcCodeLabel}
              className="w-full px-4 py-2 2xl:py-3 bg-gray-100 rounded-lg text-black placeholder:text-black focus:ring-2 focus:ring-red outline-none"
            />
            {tracks.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveTrack(track.id)}
                className="text-red hover:text-red-dark"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddTrack}
        className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-black/90 transition-colors"
      >
        <Plus size={20} />
        {addTrackLabel}
      </button>
    </>
  );
}
