"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import Link from "next/link";
import { Lock, Pause, Play, SkipBack, SkipForward, Square, Upload, FolderOpen, Check, X as XIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
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
import "../navigation-link.css";

const MAX_SIZE_LABEL = "1,5 GB";

const formatClock = (samples: number) => {
  const totalSeconds = Math.max(0, Math.floor(samples / SAMPLE_RATE));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

type Md5State =
  | { status: "idle" }
  | { status: "running"; progress: number; file: string }
  | { status: "done"; results: ChecksumResult[]; reference: boolean };

export default function DdpPlayerPage() {
  const t = useTranslations();
  const l = t.ddpPlayer;

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
      } catch (err) {
        console.error("DDP load error:", err);
        await src?.dispose();
        setError(errorMessage(err));
      } finally {
        setLoading(null);
      }
    },
    [reset, l.reading, l.errors.playback, errorMessage],
  );

  const openZip = (file: File) => {
    if (file.size > MAX_ZIP_SIZE) {
      setError(l.errors.tooLarge.replace("{size}", MAX_SIZE_LABEL));
      return;
    }
    void open(() =>
      sourceFromZip(file, (fraction) => setLoading({ label: l.unzipping, progress: fraction })),
    );
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

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player || !playerState) return;
    if (playerState.playing && !playerState.paused) void player.pause();
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

  // ---------- MD5 ----------
  const runMd5 = async () => {
    if (!source || !disc) return;
    const controller = new AbortController();
    md5AbortRef.current = controller;
    setMd5({ status: "running", progress: 0, file: "" });
    try {
      const found = await findChecksums(source);
      const lines =
        found?.lines ?? disc.audioFiles.map((f) => ({ file: f.name, expected: "" }));
      const results = await verifyChecksums(
        source,
        lines,
        (progress, file) => setMd5({ status: "running", progress, file }),
        controller.signal,
      );
      setMd5({ status: "done", results, reference: !!found });
    } catch {
      setMd5({ status: "idle" });
    } finally {
      md5AbortRef.current = null;
    }
  };

  const md5AllOk = md5.status === "done" && md5.reference && md5.results.every((r) => r.status === "ok");

  // ---------- Render ----------
  const pill =
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-sm md:text-base transition-colors duration-300";

  return (
    <PageTransition>
      <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 md:px-8 px-5 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 md:mb-1.5 xl:mb-5 2xl:mb-10">
            <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">{l.title}</h1>
            <div className="overflow-hidden flex-shrink-0">
              <Link
                href="/"
                className="text-white hover:text-red transition-all hover:rotate-90 duration-300 block"
                aria-label="Back to home"
              >
                <svg
                  className="w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14 2xl:w-[58px] 2xl:h-[58px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 pb-8 max-w-6xl w-full">
            {/* Intro + local notice */}
            <div className="flex flex-col gap-3">
              <p className="text-white/80 font-light text-base md:text-lg max-w-3xl">{l.intro}</p>
              <p className="inline-flex self-start items-center gap-2 rounded-full bg-red text-white px-4 py-1.5 text-sm font-medium">
                <Lock size={16} aria-hidden="true" />
                {l.localNotice}
              </p>
            </div>

            {error && (
              <div role="alert" className="rounded-[10px] bg-red-dark text-white px-5 py-3 text-sm md:text-base">
                {error}
              </div>
            )}

            {/* Drop zone */}
            {!disc && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-[10px] border-2 border-dashed px-6 py-12 md:py-16 flex flex-col items-center justify-center gap-5 text-center transition-colors ${
                  isDragging ? "border-red bg-white/10" : "border-white/40 bg-white/5"
                }`}
              >
                {loading ? (
                  <div className="w-full max-w-md flex flex-col items-center gap-3" aria-live="polite">
                    <p className="text-white text-lg">{loading.label}…</p>
                    <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
                      <div
                        className={`h-full bg-red rounded-full ${loading.progress === null ? "w-1/3 animate-pulse" : ""}`}
                        style={loading.progress === null ? undefined : { width: `${Math.round(loading.progress * 100)}%` }}
                      />
                    </div>
                    {loading.progress !== null && (
                      <p className="text-white/60 text-sm">{Math.round(loading.progress * 100)}%</p>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload size={36} className="text-white" aria-hidden="true" />
                    <div>
                      <p className="text-white text-lg md:text-2xl font-medium">{l.dropTitle}</p>
                      <p className="text-white/60 text-sm mt-1">{l.dropHint}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => zipInputRef.current?.click()}
                        className={`${pill} bg-white text-black border-white hover:bg-red hover:border-red hover:text-white`}
                      >
                        <Upload size={16} aria-hidden="true" />
                        {l.chooseZip}
                      </button>
                      <button
                        type="button"
                        onClick={() => (folderSupported ? folderInputRef.current : filesInputRef.current)?.click()}
                        className={`${pill} text-white border-white hover:bg-white hover:text-black`}
                      >
                        <FolderOpen size={16} aria-hidden="true" />
                        {l.chooseFolder}
                      </button>
                    </div>
                    {!folderSupported && <p className="text-white/60 text-xs max-w-md">{l.folderUnsupported}</p>}
                    <p className="text-white/50 text-xs">{l.maxSize.replace("{size}", MAX_SIZE_LABEL)}</p>
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
                    if (files.length) openFiles(files, l.chooseFolder);
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
            )}

            {disc && playerState && (
              <>
                {/* Disc summary */}
                <section className="rounded-[10px] bg-white text-black p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-black/50">{l.album}</p>
                    <h2 className="text-2xl md:text-4xl font-bold truncate">{disc.albumTitle || l.untitled}</h2>
                    <p className="text-lg md:text-xl font-light truncate">{disc.albumPerformer}</p>
                    {!disc.hasCdText && <p className="text-sm text-black/50 mt-1">{l.noCdText}</p>}
                  </div>
                  <dl className="grid grid-cols-3 gap-4 text-sm md:text-base flex-shrink-0">
                    <div>
                      <dt className="text-black/50 text-xs">{l.upc}</dt>
                      <dd className="font-medium tabular-nums">{disc.upc || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-black/50 text-xs">{l.tracks}</dt>
                      <dd className="font-medium">{disc.tracks.length}</dd>
                    </div>
                    <div>
                      <dt className="text-black/50 text-xs">{l.totalTime}</dt>
                      <dd className="font-medium tabular-nums">{sectorsToMsf(disc.leadOutSector)}</dd>
                    </div>
                  </dl>
                </section>

                {/* Player */}
                <section className="rounded-[10px] bg-red text-white p-5 md:p-6 flex flex-col gap-4 md:sticky md:top-0 z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-white/80">
                        {String(currentTrack?.number ?? 1).padStart(2, "0")}
                        {inPause && playerState.playing ? ` · ${l.table.pause}` : ""}
                      </p>
                      <p className="text-lg md:text-2xl font-bold truncate">
                        {currentTrack?.title || `${l.pqTrack} ${currentTrack?.number ?? 1}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                      <button type="button" onClick={previous} aria-label={l.previous} className="p-2 rounded-full hover:bg-black/20">
                        <SkipBack size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={playerState.playing && !playerState.paused ? l.pause : l.play}
                        className="p-3 rounded-full bg-white text-black hover:bg-black hover:text-white transition-colors"
                      >
                        {playerState.playing && !playerState.paused ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => playerRef.current?.stop()}
                        aria-label={l.stop}
                        className="p-2 rounded-full hover:bg-black/20"
                      >
                        <Square size={20} />
                      </button>
                      <button type="button" onClick={next} aria-label={l.next} className="p-2 rounded-full hover:bg-black/20">
                        <SkipForward size={22} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm tabular-nums">
                    <span className="w-12 text-right">{inPause ? "-" : ""}{formatClock(Math.abs(trackElapsed))}</span>
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
                      className="relative flex-1 h-3 rounded-full bg-black/25 cursor-pointer"
                    >
                      <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${trackProgress * 100}%` }} />
                    </div>
                    <span className="w-12">{formatClock(trackEnd - trackStart)}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/80">
                    <span className="tabular-nums">
                      {sectorsToMsf(position / SAMPLES_PER_SECTOR)} / {sectorsToMsf(disc.leadOutSector)}
                    </span>
                    <label className="flex items-center gap-2">
                      {l.byteOrder}
                      <select
                        value={byteOrder}
                        onChange={(e) => changeByteOrder(e.target.value as ByteOrder)}
                        className="bg-black/20 rounded-full px-2 py-0.5 text-white"
                      >
                        <option value="little">{l.byteOrderLittle}</option>
                        <option value="big">{l.byteOrderBig}</option>
                      </select>
                    </label>
                  </div>
                  {!byteOrderConfident && <p className="text-xs text-white">{l.byteOrderUncertain}</p>}
                </section>

                {/* Track list */}
                <section className="rounded-[10px] bg-white/5 border border-white/10 overflow-x-auto">
                  <table className="w-full text-sm md:text-base text-white">
                    <thead className="text-white/50 text-xs uppercase tracking-wide">
                      <tr className="border-b border-white/10">
                        <th className="text-left font-medium px-3 py-2 w-10">{l.table.number}</th>
                        <th className="text-left font-medium px-3 py-2">{l.table.title}</th>
                        <th className="text-left font-medium px-3 py-2 hidden md:table-cell">{l.table.isrc}</th>
                        <th className="text-right font-medium px-3 py-2 hidden lg:table-cell">{l.table.pause}</th>
                        <th className="text-right font-medium px-3 py-2 hidden lg:table-cell">{l.table.start}</th>
                        <th className="text-right font-medium px-3 py-2 hidden lg:table-cell">{l.table.end}</th>
                        <th className="text-right font-medium px-3 py-2">{l.table.duration}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disc.tracks.map((track, i) => {
                        const active = i === currentTrackIndex && playerState.playing;
                        return (
                          <tr
                            key={track.number}
                            onClick={() => playTrack(i)}
                            className={`cursor-pointer border-b border-white/5 last:border-0 transition-colors ${
                              active ? "bg-red text-white" : "hover:bg-white/10"
                            }`}
                          >
                            <td className="px-3 py-2.5 tabular-nums">{String(track.number).padStart(2, "0")}</td>
                            <td className="px-3 py-2.5">
                              <span className="block truncate max-w-[50vw] md:max-w-xs lg:max-w-sm">
                                {track.title || <span className="text-white/40">{l.untitled}</span>}
                              </span>
                              {track.performer && track.performer !== disc.albumPerformer && (
                                <span className="block text-xs text-white/60 truncate">{track.performer}</span>
                              )}
                              {track.preEmphasis && <span className="text-xs text-white/60">{l.preEmphasis}</span>}
                              <span className="md:hidden block text-xs text-white/50 tabular-nums">{track.isrc}</span>
                            </td>
                            <td className="px-3 py-2.5 hidden md:table-cell tabular-nums">{track.isrc || "-"}</td>
                            <td className="px-3 py-2.5 text-right hidden lg:table-cell tabular-nums">
                              {sectorsToMsf(track.startSector - track.pregapSector)}
                            </td>
                            <td className="px-3 py-2.5 text-right hidden lg:table-cell tabular-nums">{sectorsToMsf(track.startSector)}</td>
                            <td className="px-3 py-2.5 text-right hidden lg:table-cell tabular-nums">{sectorsToMsf(track.endSector)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums">
                              {sectorsToMsf(track.endSector - track.startSector)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* MD5 */}
                  <section className="rounded-[10px] bg-white/5 border border-white/10 p-5 flex flex-col gap-3 text-white">
                    <h3 className="text-xl font-bold">{l.md5Title}</h3>
                    {md5.status === "idle" && (
                      <button
                        type="button"
                        onClick={runMd5}
                        className={`${pill} self-start bg-white text-black border-white hover:bg-red hover:border-red hover:text-white`}
                      >
                        {l.md5Start}
                      </button>
                    )}
                    {md5.status === "running" && (
                      <div className="flex flex-col gap-2" aria-live="polite">
                        <div className="flex justify-between text-sm text-white/70">
                          <span className="truncate">
                            {l.md5Running} {md5.file}
                          </span>
                          <span className="tabular-nums">{Math.floor(md5.progress * 100)}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/15 overflow-hidden">
                          <div className="h-full bg-red rounded-full" style={{ width: `${md5.progress * 100}%` }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => md5AbortRef.current?.abort()}
                          className="self-start text-sm underline text-white/70 hover:text-white"
                        >
                          {l.md5Cancel}
                        </button>
                      </div>
                    )}
                    {md5.status === "done" && (
                      <div className="flex flex-col gap-2 text-sm">
                        {md5.reference ? (
                          <p className={`font-bold ${md5AllOk ? "text-white" : "text-red"} flex items-center gap-2`}>
                            {md5AllOk ? <Check size={18} /> : <XIcon size={18} />}
                            {md5AllOk ? l.md5Ok : l.md5Ko}
                          </p>
                        ) : (
                          <p className="text-white/70">{l.md5NoFile}</p>
                        )}
                        <ul className="space-y-1">
                          {md5.results.map((r) => (
                            <li key={r.file} className="flex flex-col rounded-[6px] bg-black/40 px-3 py-2">
                              <span className="flex justify-between gap-2">
                                <span className="truncate">{r.file}</span>
                                <span
                                  className={`font-bold ${
                                    !md5.reference ? "text-white/60" : r.status === "ok" ? "text-white" : "text-red"
                                  }`}
                                >
                                  {!md5.reference ? l.md5Computed : r.status === "ok" ? "OK" : r.status === "ko" ? "KO" : l.md5Missing}
                                </span>
                              </span>
                              {r.actual && <span className="text-xs text-white/50 font-mono break-all">{r.actual}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>

                  {/* Export + actions */}
                  <section className="rounded-[10px] bg-white/5 border border-white/10 p-5 flex flex-col gap-3 text-white">
                    <h3 className="text-xl font-bold">{l.exportTitle}</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => exportPqCsv(disc)}
                        className={`${pill} bg-white text-black border-white hover:bg-red hover:border-red hover:text-white`}
                      >
                        {l.exportCsv}
                      </button>
                      <button
                        type="button"
                        onClick={() => void exportPqPdf(disc)}
                        className={`${pill} bg-white text-black border-white hover:bg-red hover:border-red hover:text-white`}
                      >
                        {l.exportPdf}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => void reset()}
                      className={`${pill} self-start text-white border-white hover:bg-white hover:text-black mt-auto`}
                    >
                      {l.loadAnother}
                    </button>
                  </section>
                </div>

                {/* PQ events */}
                <details className="rounded-[10px] bg-white/5 border border-white/10 text-white">
                  <summary className="cursor-pointer px-5 py-3 text-lg font-bold">
                    {l.pqEvents} ({disc.pq.length})
                  </summary>
                  <div className="overflow-x-auto px-5 pb-4">
                    <table className="w-full text-sm tabular-nums">
                      <thead className="text-white/50 text-xs uppercase">
                        <tr>
                          <th className="text-left font-medium py-1 pr-3">{l.pqTrack}</th>
                          <th className="text-left font-medium py-1 pr-3">{l.pqIndex}</th>
                          <th className="text-left font-medium py-1 pr-3">{l.pqTime}</th>
                          <th className="text-left font-medium py-1 pr-3">{l.pqControl}</th>
                          <th className="text-left font-medium py-1 pr-3">ISRC</th>
                          <th className="text-left font-medium py-1">UPC/EAN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {disc.pq.map((e, i) => (
                          <tr key={i} className="border-t border-white/5">
                            <td className="py-1 pr-3">{e.track === "AA" ? l.leadOut : e.track}</td>
                            <td className="py-1 pr-3">{String(e.index).padStart(2, "0")}</td>
                            <td className="py-1 pr-3">{e.msf}</td>
                            <td className="py-1 pr-3">{[e.control1, e.control2].filter(Boolean).join(" ") || "-"}</td>
                            <td className="py-1 pr-3">{e.isrc || "-"}</td>
                            <td className="py-1">{e.upc || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </>
            )}

            {/* FAQ */}
            <section className="flex flex-col gap-3 text-white">
              <h2 className="text-3xl md:text-4xl font-bold">{l.faqTitle}</h2>
              <div className="flex flex-col gap-2">
                {l.faq.map((item) => (
                  <details key={item.question} className="group rounded-[10px] bg-white/5 border border-white/10">
                    <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-3 text-base md:text-lg">
                      {item.question}
                      <span className="text-red text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="px-5 pb-4 text-white/70 font-light">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <p className="text-white/40 text-xs">{l.trademark}</p>
          </div>

          <div className="mt-auto shrink-0">
            <Footer color="white" hoverColor="red" />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
