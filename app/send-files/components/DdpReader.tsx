"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import { Lock, Pause, Play, SkipBack, SkipForward, Square, Volume2, VolumeX, Check, X as XIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { DdpError, SAMPLE_RATE, SAMPLES_PER_SECTOR, sectorsToMsf, parseDdp, type DdpDisc } from "@/lib/ddp/parse";
import {
  DdpSourceError,
  MAX_ZIP_SIZE,
  filesFromDataTransfer,
  sourceFromFiles,
  sourceFromZip,
  type DdpSource,
} from "@/lib/ddp/source";
import { DdpPlayer, buildImageBlob, detectByteOrder, type ByteOrder, type PlayerState } from "@/lib/ddp/audio";
import { findChecksums, verifyChecksums, type ChecksumResult } from "@/lib/ddp/checksum";
import { exportPqCsv, exportPqPdf } from "@/lib/ddp/export";

const MAX_SIZE_LABEL = "1,5 GB";

const formatClock = (samples: number) => {
  const totalSeconds = Math.max(0, Math.floor(samples / SAMPLE_RATE));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// mm:ss from CD sectors (75 per second), as in the mockup track table
const sectorsToClock = (sectors: number) => formatClock(sectors * SAMPLES_PER_SECTOR);

type Md5State =
  | { status: "idle" }
  | { status: "running"; progress: number; file: string }
  | { status: "done"; results: ChecksumResult[]; reference: boolean };

/** Collapsible block of the "details." panel (advanced info, kept discreet) */
function More({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-t border-black/20 pt-2">
      <summary className="cursor-pointer list-none flex items-center justify-between text-sm text-black/70 hover:text-black">
        {title}
        <span className="text-red text-lg leading-none transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pt-2 pb-1 text-sm text-black">{children}</div>
    </details>
  );
}

export function DdpReader() {
  const t = useTranslations();
  const l = t.ddpPlayer;
  const r = l.reader;

  const [source, setSource] = useState<DdpSource | null>(null);
  const [disc, setDisc] = useState<DdpDisc | null>(null);
  const [loading, setLoading] = useState<{ label: string; progress: number | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [byteOrder, setByteOrder] = useState<ByteOrder>("little");
  const [byteOrderConfident, setByteOrderConfident] = useState(true);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [md5, setMd5] = useState<Md5State>({ status: "idle" });
  const [folderSupported, setFolderSupported] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const playerRef = useRef<DdpPlayer | null>(null);
  const md5AbortRef = useRef<AbortController | null>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // iOS Safari exposes webkitdirectory but cannot pick folders
    const input = document.createElement("input");
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const supported = "webkitdirectory" in input && !isIos;
    if (!supported) setFolderSupported(false);
  }, []);

  useEffect(() => {
    playerRef.current?.setVolume(muted ? 0 : volume);
  }, [volume, muted, disc]);

  const reset = useCallback(async () => {
    md5AbortRef.current?.abort();
    await playerRef.current?.destroy();
    playerRef.current = null;
    await source?.dispose();
    setSource(null);
    setDisc(null);
    setPlayerState(null);
    setMd5({ status: "idle" });
    setError(null);
  }, [source]);

  useEffect(() => {
    return () => {
      md5AbortRef.current?.abort();
      void playerRef.current?.destroy();
    };
  }, []);

  const errorMessage = useCallback(
    (err: unknown): string => {
      const e = l.errors;
      if (err instanceof DdpSourceError) {
        const map = { "too-large": e.tooLarge, empty: e.empty, "bad-zip": e.badZip, encrypted: e.encrypted };
        return map[err.code].replace("{size}", MAX_SIZE_LABEL);
      }
      if (err instanceof DdpError) {
        const map = {
          "missing-ddpid": e.missingDdpid,
          "missing-ddpms": e.missingDdpms,
          "invalid-ddpid": e.invalidDdpid,
          "invalid-ddpms": e.invalidDdpms,
          "missing-pq": e.missingPq,
          "invalid-pq": e.invalidPq,
          "missing-audio": e.missingAudio,
          "not-audio": e.notAudio,
        };
        return map[err.code].replace("{detail}", err.detail ?? "");
      }
      return e.generic;
    },
    [l.errors],
  );

  // MD5 runs automatically as soon as the DDP is opened
  const runMd5 = useCallback(async (src: DdpSource, parsed: DdpDisc) => {
    const controller = new AbortController();
    md5AbortRef.current = controller;
    setMd5({ status: "running", progress: 0, file: "" });
    try {
      const found = await findChecksums(src);
      const lines = found?.lines ?? parsed.audioFiles.map((f) => ({ file: f.name, expected: "" }));
      const results = await verifyChecksums(
        src,
        lines,
        (progress, file) => setMd5({ status: "running", progress, file }),
        controller.signal,
      );
      if (!controller.signal.aborted) setMd5({ status: "done", results, reference: !!found });
    } catch {
      if (!controller.signal.aborted) setMd5({ status: "idle" });
    } finally {
      if (md5AbortRef.current === controller) md5AbortRef.current = null;
    }
  }, []);

  const open = useCallback(
    async (load: () => Promise<DdpSource>) => {
      await reset();
      setLoading({ label: l.reading, progress: null });
      let src: DdpSource | null = null;
      try {
        src = await load();
        setLoading({ label: l.reading, progress: null });
        const parsed = await parseDdp(src);
        const image = buildImageBlob(parsed, src.get);
        const detected = await detectByteOrder(image, parsed);
        setByteOrder(detected.order);
        setByteOrderConfident(detected.confident);
        playerRef.current = new DdpPlayer(
          image,
          parsed,
          detected.order,
          (state) => setPlayerState(state),
          () => setError(l.errors.playback),
        );
        setPlayerState({ playing: false, paused: false, position: parsed.tracks[0].startSector * SAMPLES_PER_SECTOR });
        setSource(src);
        setDisc(parsed);
        void runMd5(src, parsed);
      } catch (err) {
        console.error("DDP load error:", err);
        await src?.dispose();
        setError(errorMessage(err));
      } finally {
        setLoading(null);
      }
    },
    [reset, l.reading, l.errors.playback, errorMessage, runMd5],
  );

  const openZip = (file: File) => {
    if (file.size > MAX_ZIP_SIZE) {
      setError(l.errors.tooLarge.replace("{size}", MAX_SIZE_LABEL));
      return;
    }
    void open(() => sourceFromZip(file, (fraction) => setLoading({ label: l.unzipping, progress: fraction })));
  };

  const openFiles = (files: File[], label: string) => {
    const zip = files.length === 1 && /\.zip$/i.test(files[0].name) ? files[0] : null;
    if (zip) return openZip(zip);
    void open(async () => sourceFromFiles(files, label));
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    let files: File[] = [];
    try {
      files = e.dataTransfer.items?.length ? await filesFromDataTransfer(e.dataTransfer.items) : [];
    } catch {
      files = [];
    }
    if (files.length === 0) files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    openFiles(files, files[0].name);
  };

  // ---------- Player helpers ----------
  const position = playerState?.position ?? 0;
  const currentTrackIndex = useMemo(() => {
    if (!disc) return 0;
    const sector = position / SAMPLES_PER_SECTOR;
    let index = 0;
    disc.tracks.forEach((track, i) => {
      if (sector >= track.pregapSector) index = i;
    });
    return index;
  }, [disc, position]);
  const currentTrack = disc?.tracks[currentTrackIndex];

  const playTrack = (index: number) => {
    if (!disc || !playerRef.current) return;
    const track = disc.tracks[Math.max(0, Math.min(disc.tracks.length - 1, index))];
    void playerRef.current.playFrom(track.startSector * SAMPLES_PER_SECTOR);
  };

  const isPlaying = !!playerState?.playing && !playerState.paused;

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player || !playerState) return;
    if (isPlaying) void player.pause();
    else void player.play();
  };

  const previous = () => {
    if (!disc || !currentTrack) return;
    const intoTrack = position - currentTrack.startSector * SAMPLES_PER_SECTOR;
    if (intoTrack > 3 * SAMPLE_RATE) playTrack(currentTrackIndex);
    else playTrack(currentTrackIndex - 1);
  };

  const next = () => {
    if (!disc) return;
    if (currentTrackIndex < disc.tracks.length - 1) playTrack(currentTrackIndex + 1);
  };

  const trackStart = currentTrack ? currentTrack.startSector * SAMPLES_PER_SECTOR : 0;
  const trackEnd = currentTrack ? currentTrack.endSector * SAMPLES_PER_SECTOR : 1;
  const inPause = position < trackStart;
  const trackElapsed = position - trackStart;
  const trackProgress = Math.max(0, Math.min(1, trackElapsed / Math.max(1, trackEnd - trackStart)));

  const seekInTrack = (clientX: number, element: HTMLElement) => {
    if (!playerRef.current || !currentTrack) return;
    const rect = element.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    playerRef.current.seek(Math.round(trackStart + fraction * (trackEnd - trackStart)));
  };

  const changeByteOrder = (order: ByteOrder) => {
    setByteOrder(order);
    playerRef.current?.setByteOrder(order);
  };

  const md5Ok = md5.status === "done" ? md5.results.filter((x) => x.status === "ok").length : 0;
  const md5AllOk = md5.status === "done" && md5.reference && md5Ok === md5.results.length;

  const pill =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-1.5 xl:py-2 text-lg xl:text-3xl mdshort:text-2xl font-light transition-colors duration-300";

  // ---------- Empty state (mockup "ddp reader") ----------
  if (!disc || !playerState) {
    return (
      <div className="bg-white rounded-[10px] h-full min-h-0 p-5 md:p-8 mdshort:p-5 flex flex-col gap-6 mdshort:gap-4 overflow-y-auto">
        <div className="grid md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-6 md:gap-8 xl:gap-12 flex-1 shrink-0">
          <div className="flex flex-col gap-4">
            <p className="text-black font-light text-base xl:text-xl mdshort:text-lg">{r.intro}</p>

            {error && (
              <div role="alert" className="rounded-[10px] bg-red/10 text-red px-5 py-3 text-sm md:text-base">
                {error}
              </div>
            )}

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-[10px] border border-dashed border-black/40 px-6 py-6 xl:py-10 mdshort:py-4 flex-1 min-h-[160px] mdshort:min-h-[130px] flex flex-col items-center justify-center gap-5 text-center transition-colors ${
                isDragging ? "bg-black/10" : "bg-[#E5E5E5]"
              }`}
            >
              {loading ? (
                <div className="w-full max-w-md flex flex-col items-center gap-3" aria-live="polite">
                  <p className="text-black text-lg">{loading.label}…</p>
                  <div className="w-full h-3 rounded-full bg-white overflow-hidden">
                    <div
                      className={`h-full bg-red-dark rounded-full ${loading.progress === null ? "w-1/3 animate-pulse" : ""}`}
                      style={loading.progress === null ? undefined : { width: `${Math.round(loading.progress * 100)}%` }}
                    />
                  </div>
                  {loading.progress !== null && (
                    <p className="text-black/60 text-sm">{Math.round(loading.progress * 100)}%</p>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-black text-xl md:text-2xl xl:text-4xl mdshort:text-3xl">{r.dropTitle}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => (folderSupported ? folderInputRef.current : filesInputRef.current)?.click()}
                      className={`${pill} bg-red-dark text-white border border-red-dark hover:bg-black hover:border-black`}
                    >
                      {r.chooseFolder}
                    </button>
                    <button
                      type="button"
                      onClick={() => zipInputRef.current?.click()}
                      className={`${pill} text-red-dark border border-red-dark hover:bg-red-dark hover:text-white`}
                    >
                      {r.chooseZip}
                    </button>
                  </div>
                  {!folderSupported && <p className="text-black/60 text-xs max-w-md">{l.folderUnsupported}</p>}
                  <p className="text-black/50 text-xs">{l.maxSize.replace("{size}", MAX_SIZE_LABEL)}</p>
                </>
              )}
              <input
                ref={zipInputRef}
                type="file"
                accept=".zip,application/zip"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) openZip(file);
                }}
              />
              <input
                ref={folderInputRef}
                type="file"
                className="hidden"
                multiple
                {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  if (files.length) openFiles(files, r.chooseFolder);
                }}
              />
              <input
                ref={filesInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  if (files.length) openFiles(files, files[0].name);
                }}
              />
            </div>

            <p className="text-red-dark text-base xl:text-xl mdshort:text-lg">{r.privacy}</p>
          </div>

          <div className="hidden md:flex flex-col justify-between items-start gap-6">
            <p className="self-end flex items-center gap-2 text-black text-lg xl:text-2xl mdshort:text-xl">
              <Lock size={20} strokeWidth={1.5} aria-hidden="true" />
              {r.localBadge}
            </p>
            <div className="flex flex-col text-5xl lg:text-6xl xl:text-[100px] mdshort:text-[80px] font-bold text-black !leading-[0.8]">
              {r.headline.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
            <span />
          </div>
        </div>

        <div className="border-t border-black/20 pt-5 grid sm:grid-cols-3 gap-6 shrink-0">
          {r.steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center sm:items-start sm:pl-[10%]">
              <p className="text-3xl xl:text-5xl mdshort:text-4xl font-bold text-black leading-none">
                {step.number} {step.title}
              </p>
              <p className="text-lg xl:text-2xl mdshort:text-xl font-bold text-black pl-8">{step.subtitle}</p>
              <p className="text-sm xl:text-lg mdshort:text-base font-light text-black pl-8 mt-1">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="text-black/40 text-xs">{l.trademark}</p>
      </div>
    );
  }

  // ---------- Loaded state (mockup "ddp reader" with a DDP) ----------
  const subtitle = [
    disc.albumPerformer,
    r.tracksCount.replace("{n}", String(disc.tracks.length)),
    sectorsToClock(disc.leadOutSector - disc.tracks[0].startSector),
    r.cdAudioStereo,
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-[10px] h-full min-h-0 p-5 md:p-8 mdshort:p-5 flex flex-col gap-6 mdshort:gap-4 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold text-black truncate">
            {disc.albumTitle || l.untitled}
          </h2>
          <p className="text-black font-light text-base 2xl:text-lg">{subtitle.join("  ·  ")}</p>
        </div>
        <button
          type="button"
          onClick={() => void reset()}
          className="self-start flex items-center justify-between gap-10 rounded-full border border-red-dark text-red-dark px-6 py-1.5 text-lg xl:text-2xl font-light hover:bg-red-dark hover:text-white transition-colors duration-300"
        >
          {l.loadAnother}
          <ArrowUpRight size={22} />
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-[10px] bg-red/10 text-red px-5 py-3 text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-6 md:gap-8 xl:gap-12 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          {/* Player */}
          <section className="rounded-[10px] bg-red-dark text-white p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase font-bold tracking-tight">
                  {r.nowPlaying}
                  {inPause && playerState.playing ? ` · ${l.table.pause}` : ""}
                </p>
                <p className="text-xl md:text-2xl 2xl:text-3xl font-bold truncate">
                  {currentTrack?.title || `${l.pqTrack} ${currentTrack?.number ?? 1}`}
                </p>
              </div>
              <p className="text-lg 2xl:text-xl tabular-nums flex-shrink-0">
                {inPause ? "-" : ""}
                {formatClock(Math.abs(trackElapsed))} / {formatClock(trackEnd - trackStart)}
              </p>
            </div>

            <div
              role="slider"
              tabIndex={0}
              aria-label={l.seek}
              aria-valuemin={0}
              aria-valuemax={Math.round((trackEnd - trackStart) / SAMPLE_RATE)}
              aria-valuenow={Math.round(Math.max(0, trackElapsed) / SAMPLE_RATE)}
              onClick={(e) => seekInTrack(e.clientX, e.currentTarget)}
              onKeyDown={(e) => {
                if (!playerRef.current) return;
                if (e.key === "ArrowRight") playerRef.current.seek(position + 5 * SAMPLE_RATE);
                if (e.key === "ArrowLeft") playerRef.current.seek(Math.max(trackStart, position - 5 * SAMPLE_RATE));
              }}
              className="relative h-4 cursor-pointer flex items-center"
            >
              <div className="absolute inset-x-0 h-[3px] rounded-full bg-red" />
              <div className="absolute left-0 h-[3px] rounded-full bg-white" style={{ width: `${trackProgress * 100}%` }} />
              <div
                className="absolute w-3 h-3 rounded-full bg-white -translate-x-1/2"
                style={{ left: `${trackProgress * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-2">
              <p className="text-sm 2xl:text-base font-light">
                {r.trackOf.replace("{n}", String(currentTrack?.number ?? 1)).replace("{total}", String(disc.tracks.length))}
              </p>
              <div className="flex items-center justify-center gap-3 md:gap-5">
                <button type="button" onClick={previous} aria-label={l.previous} className="p-1 hover:text-red">
                  <SkipBack size={20} fill="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? l.pause : l.play}
                  className="w-12 h-12 rounded-full bg-white text-red-dark flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
                </button>
                <button type="button" onClick={next} aria-label={l.next} className="p-1 hover:text-red">
                  <SkipForward size={20} fill="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={() => playerRef.current?.stop()}
                  aria-label={l.stop}
                  className="p-1 hover:text-red"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={r.volume}
                  className="hover:text-red"
                >
                  {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setMuted(false);
                    setVolume(Number(e.target.value));
                  }}
                  aria-label={r.volume}
                  className="w-20 md:w-24 accent-white"
                />
              </div>
            </div>
          </section>

          {/* Track list */}
          <div className="overflow-x-auto">
            <table className="w-full text-black">
              <thead className="text-xs uppercase font-bold">
                <tr>
                  <th className="text-left px-4 py-2 w-12">{l.table.number}</th>
                  <th className="text-left px-4 py-2">{l.table.title}</th>
                  <th className="text-left px-4 py-2 hidden sm:table-cell">{l.table.start}</th>
                  <th className="text-left px-4 py-2">{l.table.duration}</th>
                  <th className="text-left px-4 py-2 hidden md:table-cell">{l.table.isrc}</th>
                </tr>
              </thead>
              <tbody>
                {disc.tracks.map((track, i) => {
                  const active = i === currentTrackIndex;
                  return (
                    <tr
                      key={track.number}
                      onClick={() => playTrack(i)}
                      className={`cursor-pointer border-t border-black/10 transition-colors ${
                        active ? "bg-[#E5E5E5]" : "hover:bg-[#F2F2F2]"
                      }`}
                    >
                      <td className={`px-4 py-3 tabular-nums ${active ? "text-red font-bold" : ""}`}>
                        {String(track.number).padStart(2, "0")}
                      </td>
                      <td className={`px-4 py-3 text-lg 2xl:text-xl ${active ? "text-red font-bold" : "font-light"}`}>
                        <span className="block truncate max-w-[45vw] lg:max-w-[22vw]">
                          {track.title || <span className="text-black/40">{l.untitled}</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-light hidden sm:table-cell">
                        {sectorsToClock(track.startSector - disc.tracks[0].startSector)}
                      </td>
                      <td className="px-4 py-3 tabular-nums font-light">
                        {sectorsToClock(track.endSector - track.startSector)}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-sm font-light hidden md:table-cell">{track.isrc || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* details. */}
        <aside className="rounded-[10px] bg-[#E5E5E5] p-5 xl:p-6 flex flex-col gap-4 text-black">
          <h3 className="text-5xl xl:text-6xl 2xl:text-7xl mdshort:text-5xl font-bold leading-none">{r.detailsTitle}</h3>
          <div>
            <p className="text-red text-xs uppercase font-bold">{r.masterInfo}</p>
            <p className="text-xl 2xl:text-2xl font-bold mt-1">{disc.albumTitle || l.untitled}</p>
            {disc.albumPerformer && <p className="font-light">{disc.albumPerformer}</p>}
          </div>
          <dl className="border-y border-black/60 py-3 grid grid-cols-2 gap-y-2 text-sm 2xl:text-base">
            <dt className="font-light">{r.audioFormat}</dt>
            <dd className="font-bold">{r.audioFormatValue}</dd>
            <dt className="font-light">{r.channels}</dt>
            <dd className="font-bold">{r.stereo}</dd>
            <dt className="font-light">{r.upc}</dt>
            <dd className={disc.upc ? "font-bold tabular-nums" : "font-light"}>{disc.upc || r.notProvided}</dd>
          </dl>

          {/* MD5, started automatically on load */}
          <div aria-live="polite">
            {md5.status === "running" && (
              <div className="flex flex-col gap-2">
                <p className="text-red-dark font-bold">{r.md5Checking}…</p>
                <div className="h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full bg-red-dark rounded-full" style={{ width: `${md5.progress * 100}%` }} />
                </div>
                <p className="text-xs font-light truncate">
                  {md5.file} · {Math.floor(md5.progress * 100)}%
                </p>
              </div>
            )}
            {md5.status === "done" && (
              <>
                {md5.reference ? (
                  <p className={`flex items-center gap-2 font-bold text-lg ${md5AllOk ? "text-red-dark" : "text-red"}`}>
                    {md5AllOk ? <Check size={20} /> : <XIcon size={20} />}
                    {md5AllOk ? r.md5Verified : r.md5Failed}
                  </p>
                ) : (
                  <p className="font-light text-sm">{r.md5Reference}</p>
                )}
                {md5.reference && (
                  <p className="text-sm font-light mt-1">
                    {r.md5FilesOk.replace("{ok}", String(md5Ok)).replace("{total}", String(md5.results.length))}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Advanced information, kept discreet */}
          <div className="flex flex-col gap-2">
            {md5.status === "done" && (
              <More title={r.md5Details}>
                <ul className="space-y-1">
                  {md5.results.map((x) => (
                    <li key={x.file} className="flex flex-col">
                      <span className="flex justify-between gap-2">
                        <span className="truncate">{x.file}</span>
                        <span className={`font-bold ${!md5.reference || x.status === "ok" ? "" : "text-red"}`}>
                          {!md5.reference ? l.md5Computed : x.status === "ok" ? "OK" : x.status === "ko" ? "KO" : l.md5Missing}
                        </span>
                      </span>
                      {x.actual && <span className="text-xs text-black/60 font-mono break-all">{x.actual}</span>}
                    </li>
                  ))}
                </ul>
              </More>
            )}

            <More title={`${l.pqEvents} (${disc.pq.length})`}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs tabular-nums">
                  <thead className="text-black/60">
                    <tr>
                      <th className="text-left font-medium pr-2">{l.pqTrack}</th>
                      <th className="text-left font-medium pr-2">{l.pqIndex}</th>
                      <th className="text-left font-medium pr-2">{l.pqTime}</th>
                      <th className="text-left font-medium pr-2">{l.pqControl}</th>
                      <th className="text-left font-medium">ISRC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disc.pq.map((e, i) => (
                      <tr key={i}>
                        <td className="pr-2">{e.track === "AA" ? l.leadOut : e.track}</td>
                        <td className="pr-2">{String(e.index).padStart(2, "0")}</td>
                        <td className="pr-2">{e.msf}</td>
                        <td className="pr-2">{[e.control1, e.control2].filter(Boolean).join(" ") || "-"}</td>
                        <td>{e.isrc || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </More>

            <More title={l.byteOrder}>
              <select
                value={byteOrder}
                onChange={(e) => changeByteOrder(e.target.value as ByteOrder)}
                className="bg-white rounded-full px-3 py-1"
              >
                <option value="little">{l.byteOrderLittle}</option>
                <option value="big">{l.byteOrderBig}</option>
              </select>
              {!byteOrderConfident && <p className="text-xs mt-2">{l.byteOrderUncertain}</p>}
            </More>

            <More title={l.exportTitle}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => exportPqCsv(disc)}
                  className="rounded-full border border-black px-4 py-1 hover:bg-black hover:text-white transition-colors"
                >
                  {l.exportCsv}
                </button>
                <button
                  type="button"
                  onClick={() => void exportPqPdf(disc)}
                  className="rounded-full border border-black px-4 py-1 hover:bg-black hover:text-white transition-colors"
                >
                  {l.exportPdf}
                </button>
              </div>
            </More>

            <More title={l.faqTitle}>
              <div className="flex flex-col gap-3">
                {l.faq.map((item) => (
                  <div key={item.question}>
                    <p className="font-bold">{item.question}</p>
                    <p className="font-light">{item.answer}</p>
                  </div>
                ))}
              </div>
            </More>
            <p className="text-black/40 text-xs pt-2">{l.trademark}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
