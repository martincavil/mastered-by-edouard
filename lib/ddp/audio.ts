/**
 * Gapless, sample-accurate playback of a DDP audio image with the Web Audio API.
 *
 * The image is read lazily with Blob.slice: only small segments (4 s) are
 * read and converted to AudioBuffers. Each segment is scheduled to start
 * exactly when the previous one ends (start time + length / 44100), on the
 * AudioContext clock, so there is no gap at segment or track boundaries: the
 * image is played as one continuous stream, like a CD player, pauses
 * (index 00) included. Only the next segment is prepared ahead (about 4 to 8 s
 * in memory), which keeps memory low enough for iOS Safari.
 */

import { BYTES_PER_SECTOR, SAMPLE_RATE, SAMPLES_PER_SECTOR, type DdpDisc } from "./parse";

export type ByteOrder = "little" | "big";

const SEGMENT_SAMPLES = SAMPLE_RATE * 4; // 4 s per scheduled buffer
const SCHEDULE_AHEAD = 6; // seconds of audio kept scheduled ahead of the play head

/** Concatenates the audio data files (first one from its starting offset) */
export function buildImageBlob(disc: DdpDisc, get: (name: string) => Blob | undefined): Blob {
  const parts = disc.audioFiles.map((f) => {
    const blob = get(f.name)!;
    return f.offset ? blob.slice(f.offset) : blob;
  });
  return parts.length === 1 ? parts[0] : new Blob(parts);
}

/**
 * DDP has no byte-order field. Interpreting 16-bit PCM with the wrong byte
 * order turns music into near white noise, so the order whose consecutive
 * samples are the most correlated (smallest average difference) is the right
 * one. Windows are taken inside the first tracks, away from silences.
 */
export async function detectByteOrder(image: Blob, disc: DdpDisc): Promise<{ order: ByteOrder; confident: boolean }> {
  const windows: number[] = [];
  for (const track of disc.tracks.slice(0, 4)) {
    const mid = Math.floor((track.startSector + track.endSector) / 2);
    windows.push(mid);
  }
  let little = 0;
  let big = 0;
  for (const sector of windows) {
    const start = (sector - disc.imageStartSector) * BYTES_PER_SECTOR;
    if (start < 0 || start >= image.size) continue;
    const bytes = new DataView(await image.slice(start, start + 65536).arrayBuffer());
    let prevL = 0;
    let prevB = 0;
    for (let i = 0; i + 4 <= bytes.byteLength; i += 4) {
      const l = bytes.getInt16(i, true);
      const b = bytes.getInt16(i, false);
      little += Math.abs(l - prevL);
      big += Math.abs(b - prevB);
      prevL = l;
      prevB = b;
    }
  }
  if (little === 0 && big === 0) return { order: "little", confident: false };
  const ratio = Math.max(little, big) / Math.max(1, Math.min(little, big));
  return { order: little <= big ? "little" : "big", confident: ratio > 1.5 };
}

export interface PlayerState {
  playing: boolean;
  paused: boolean;
  /** Absolute disc position, in sample frames */
  position: number;
}

type AudioContextCtor = typeof AudioContext;

export class DdpPlayer {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private sources: AudioBufferSourceNode[] = [];
  private generation = 0;
  private startCtxTime = 0;
  private startSample = 0;
  private nextSample = 0;
  private nextTime = 0;
  private endSample: number;
  private imageStartSample: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private state: PlayerState;
  private iosUnlock: HTMLAudioElement | null = null;
  private pumping = false;

  constructor(
    private image: Blob,
    private disc: DdpDisc,
    private byteOrder: ByteOrder,
    private onState: (state: PlayerState) => void,
    private onError: (error: Error) => void,
  ) {
    this.imageStartSample = disc.imageStartSector * SAMPLES_PER_SECTOR;
    const imageEnd = this.imageStartSample + Math.floor(image.size / 4);
    this.endSample = Math.min(imageEnd, disc.leadOutSector * SAMPLES_PER_SECTOR);
    const first = disc.tracks[0];
    this.state = { playing: false, paused: false, position: first.startSector * SAMPLES_PER_SECTOR };
  }

  setByteOrder(order: ByteOrder) {
    this.byteOrder = order;
    if (this.state.playing) this.seek(this.getPosition());
  }

  get totalStart() {
    return this.disc.tracks[0].pregapSector * SAMPLES_PER_SECTOR;
  }

  get totalEnd() {
    return this.endSample;
  }

  /** Must be called from a user gesture (iOS Safari) */
  private ensureContext(): AudioContext {
    if (this.ctx) return this.ctx;
    const Ctor: AudioContextCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: AudioContextCtor }).webkitAudioContext;
    try {
      this.ctx = new Ctor({ sampleRate: SAMPLE_RATE, latencyHint: "playback" });
    } catch {
      // Older Safari: no options, the browser resamples 44.1 kHz buffers
      this.ctx = new Ctor();
    }
    this.gain = this.ctx.createGain();
    this.gain.connect(this.ctx.destination);
    this.unlockIos();
    return this.ctx;
  }

  /** iOS: play through the ringer/silent switch (media playback session) */
  private unlockIos() {
    try {
      const nav = navigator as Navigator & { audioSession?: { type: string } };
      if (nav.audioSession) nav.audioSession.type = "playback";
    } catch {}
    if (this.iosUnlock || !/iPad|iPhone|iPod/.test(navigator.userAgent)) return;
    // A looping silent <audio> switches the iOS audio session to "playback"
    const silent =
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQQAAAAAAA==";
    const el = new Audio(silent);
    el.loop = true;
    el.setAttribute("playsinline", "");
    el.play().catch(() => {});
    this.iosUnlock = el;
  }

  private emit(patch: Partial<PlayerState>) {
    this.state = { ...this.state, ...patch };
    this.onState(this.state);
  }

  getPosition(): number {
    if (!this.ctx || !this.state.playing) return this.state.position;
    const elapsed = Math.max(0, this.ctx.currentTime - this.startCtxTime);
    return Math.min(this.endSample, this.startSample + Math.round(elapsed * SAMPLE_RATE));
  }

  private async readSegment(start: number, count: number, ctx: AudioContext): Promise<AudioBuffer> {
    const byteStart = (start - this.imageStartSample) * 4;
    const data = new DataView(await this.image.slice(byteStart, byteStart + count * 4).arrayBuffer());
    const frames = Math.floor(data.byteLength / 4);
    const buffer = ctx.createBuffer(2, Math.max(1, frames), SAMPLE_RATE);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    const littleEndian = this.byteOrder === "little";
    for (let i = 0; i < frames; i++) {
      left[i] = data.getInt16(i * 4, littleEndian) / 32768;
      right[i] = data.getInt16(i * 4 + 2, littleEndian) / 32768;
    }
    return buffer;
  }

  private stopSources() {
    this.generation++;
    for (const s of this.sources) {
      try {
        s.onended = null;
        s.stop();
        s.disconnect();
      } catch {}
    }
    this.sources = [];
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private async pump(generation: number) {
    // One reader at a time, otherwise two pumps could schedule the same segment
    if (this.pumping) return;
    this.pumping = true;
    try {
      await this.fill(generation);
    } finally {
      this.pumping = false;
    }
  }

  private async fill(generation: number) {
    const ctx = this.ctx!;
    while (
      generation === this.generation &&
      this.nextSample < this.endSample &&
      this.nextTime - ctx.currentTime < SCHEDULE_AHEAD
    ) {
      const count = Math.min(SEGMENT_SAMPLES, this.endSample - this.nextSample);
      const at = this.nextSample;
      let buffer: AudioBuffer;
      try {
        buffer = await this.readSegment(at, count, ctx);
      } catch (error) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
        this.stop();
        return;
      }
      if (generation !== this.generation) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gain!);
      // If reading was slower than real time, never schedule in the past
      if (this.nextTime < ctx.currentTime) {
        this.startCtxTime += ctx.currentTime + 0.05 - this.nextTime;
        this.nextTime = ctx.currentTime + 0.05;
      }
      source.start(this.nextTime);
      this.sources.push(source);
      source.onended = () => {
        this.sources = this.sources.filter((s) => s !== source);
      };
      this.nextSample += count;
      this.nextTime += count / SAMPLE_RATE;
    }
    if (generation === this.generation && this.nextSample >= this.endSample && this.sources.length === 0) {
      this.stop();
    }
  }

  async playFrom(sample: number) {
    const ctx = this.ensureContext();
    this.stopSources();
    if (ctx.state === "suspended") await ctx.resume();
    const start = Math.max(this.imageStartSample, Math.min(sample, this.endSample - 1));
    this.startSample = start;
    this.nextSample = start;
    this.startCtxTime = ctx.currentTime + 0.08;
    this.nextTime = this.startCtxTime;
    const generation = this.generation;
    this.emit({ playing: true, paused: false, position: start });
    await this.pump(generation);
    this.timer = setInterval(() => {
      if (generation !== this.generation) return;
      const position = this.getPosition();
      if (position >= this.endSample) {
        this.stop();
        return;
      }
      this.state = { ...this.state, position };
      this.onState(this.state);
      void this.pump(generation);
    }, 250);
  }

  async play() {
    if (this.state.paused && this.ctx) {
      await this.ctx.resume();
      this.emit({ paused: false, playing: true });
      return;
    }
    await this.playFrom(this.state.position);
  }

  async pause() {
    if (!this.ctx || !this.state.playing) return;
    const position = this.getPosition();
    await this.ctx.suspend();
    this.state = { ...this.state, paused: true, position };
    this.onState(this.state);
  }

  stop() {
    this.stopSources();
    if (this.ctx?.state === "suspended") void this.ctx.resume();
    this.emit({ playing: false, paused: false, position: this.disc.tracks[0].startSector * SAMPLES_PER_SECTOR });
  }

  seek(sample: number) {
    if (this.state.playing && !this.state.paused) void this.playFrom(sample);
    else {
      this.stopSources();
      if (this.ctx?.state === "suspended") void this.ctx.resume();
      this.emit({ playing: false, paused: false, position: sample });
    }
  }

  async destroy() {
    this.stopSources();
    this.iosUnlock?.pause();
    this.iosUnlock = null;
    await this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}
