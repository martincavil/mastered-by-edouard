/**
 * DDP 2.0 parser (100 % in the browser, metadata files only are read in memory).
 *
 * Field layouts (offset / length in bytes, ASCII unless stated otherwise) were
 * checked against the open-source ddplib implementation (NonStaticEu/ddplib,
 * DCA spec 1.01 / 2.0):
 *
 * DDPID (128 bytes)
 *   0  8  DDP level ("DDP 2.00")      8 13 UPC/EAN       21 8 MSS
 *   29 8  MSL                         37 48 master ID   ...
 *
 * DDPMS map packet (128 bytes, repeated)
 *   0  4  "VVVM"   4  2 DST (D0 data, D2 lead-in, D3 lead-out, D4 fill, Tn text, S0 subcode)
 *   6  8  DSP      14 8 DSL          22 8 DSS (start sector of the stream on disc)
 *   30 8  SUB ("PQ DESCR", "CDTEXT", RW..)   38 2 CDM ("DA" = CD audio)
 *   40 1  SSM      41 1 SCR          42 4 PRE1  46 4 PRE2  50 4 PST
 *   54 1  MED      55 2 TRK          57 2 IDX   59 12 ISRC
 *   71 3  DSI size 74 17 DSI (file name)        91 1 NEW
 *   92 4  PRE1NXT  96 8 PAUSEADD     104 9 OFS (starting byte offset in the file)
 *   113 15 padding
 *
 * PQ descriptor entry (64 bytes, repeated)
 *   0 4 "VVVS"  4 2 track ("AA" = lead-out)  6 2 index  8 2 hours  10 2 min
 *   12 2 sec  14 2 frames  16 2 control 1  18 2 control 2  20 12 ISRC
 *   32 13 UPC/EAN  45 19 user text
 *
 * CD-Text: raw 18-byte lead-in packs (type, track, seq, block/pos, 12 data, CRC).
 *
 * Audio: CD-DA, 44.1 kHz, 16 bit, 2 channels, 2352 bytes per sector (588 sample
 * frames). DDP has no byte-order field: the order is detected from the audio
 * itself (see detectByteOrder in audio.ts) instead of being assumed.
 */

export const SAMPLE_RATE = 44100;
export const BYTES_PER_SECTOR = 2352;
export const SAMPLES_PER_SECTOR = 588;
export const SECTORS_PER_SECOND = 75;

export class DdpError extends Error {
  constructor(
    public code:
      | "missing-ddpid"
      | "missing-ddpms"
      | "invalid-ddpid"
      | "invalid-ddpms"
      | "missing-pq"
      | "invalid-pq"
      | "missing-audio"
      | "not-audio",
    public detail?: string,
  ) {
    super(detail ? `${code}: ${detail}` : code);
    this.name = "DdpError";
  }
}

export interface MapPacket {
  dst: string;
  dsp: number | null;
  dsl: number | null;
  dss: number | null;
  sub: string;
  cdm: string;
  ssm: number | null;
  trk: string;
  idx: number | null;
  isrc: string;
  dsi: string;
  ofs: number | null;
}

export interface PqEntry {
  track: string; // "01".."99", "00" lead-in, "AA" lead-out
  index: number;
  /** Absolute disc position in sectors (75 per second) */
  sector: number;
  msf: string;
  control1: string;
  control2: string;
  isrc: string;
  upc: string;
  text: string;
}

export interface DdpTrack {
  number: number;
  title: string;
  performer: string;
  songwriter: string;
  composer: string;
  isrc: string;
  /** Sector of index 00 (pause start), equals start when there is no pause */
  pregapSector: number;
  /** Sector of index 01 */
  startSector: number;
  /** Sector where the next track (index 00 or 01) or the lead-out begins */
  endSector: number;
  preEmphasis: boolean;
  indexes: { index: number; sector: number }[];
}

export interface DdpDisc {
  level: string;
  upc: string;
  masterId: string;
  albumTitle: string;
  albumPerformer: string;
  tracks: DdpTrack[];
  pq: PqEntry[];
  leadOutSector: number;
  /** Map packets, for display/debug */
  map: MapPacket[];
  /** Audio data files in map order, with the first file's starting offset */
  audioFiles: { name: string; offset: number }[];
  /** Disc sector where the audio image starts (DSS of the first data packet) */
  imageStartSector: number;
  cdTextFile: string | null;
  pqFile: string;
  hasCdText: boolean;
}

const latin1 = new TextDecoder("latin1");
const ascii = (bytes: Uint8Array, start: number, length: number) =>
  latin1.decode(bytes.subarray(start, start + length));
const field = (bytes: Uint8Array, start: number, length: number) =>
  ascii(bytes, start, length).replace(/\0/g, " ").trim();
const intField = (bytes: Uint8Array, start: number, length: number): number | null => {
  const value = field(bytes, start, length);
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
};

export function sectorsToMsf(sectors: number): string {
  const s = Math.max(0, Math.round(sectors));
  const f = s % 75;
  const totalSec = Math.floor(s / 75);
  const m = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

export function parseDdpId(bytes: Uint8Array) {
  if (bytes.length < 128) throw new DdpError("invalid-ddpid", `size ${bytes.length}`);
  const level = field(bytes, 0, 8);
  if (!/^DDP/i.test(level)) throw new DdpError("invalid-ddpid", `level "${level}"`);
  return {
    level,
    upc: field(bytes, 8, 13),
    masterId: field(bytes, 37, 48),
  };
}

export function parseDdpMs(bytes: Uint8Array): MapPacket[] {
  if (bytes.length < 128 || bytes.length % 128 !== 0) {
    throw new DdpError("invalid-ddpms", `size ${bytes.length} is not a multiple of 128`);
  }
  const packets: MapPacket[] = [];
  for (let p = 0; p < bytes.length; p += 128) {
    const pkt = bytes.subarray(p, p + 128);
    if (ascii(pkt, 0, 4) !== "VVVM") {
      throw new DdpError("invalid-ddpms", `packet ${p / 128 + 1} does not start with VVVM`);
    }
    const dsiSize = intField(pkt, 71, 3) ?? 17;
    packets.push({
      dst: field(pkt, 4, 2),
      dsp: intField(pkt, 6, 8),
      dsl: intField(pkt, 14, 8),
      dss: intField(pkt, 22, 8),
      sub: field(pkt, 30, 8),
      cdm: field(pkt, 38, 2),
      ssm: intField(pkt, 40, 1),
      trk: field(pkt, 55, 2),
      idx: intField(pkt, 57, 2),
      isrc: field(pkt, 59, 12),
      dsi: field(pkt, 74, Math.min(17, dsiSize)),
      ofs: intField(pkt, 104, 9),
    });
  }
  return packets;
}

export function parsePq(bytes: Uint8Array): PqEntry[] {
  if (bytes.length < 64) throw new DdpError("invalid-pq", `size ${bytes.length}`);
  const entries: PqEntry[] = [];
  for (let p = 0; p + 64 <= bytes.length; p += 64) {
    const e = bytes.subarray(p, p + 64);
    if (ascii(e, 0, 4) !== "VVVS") {
      throw new DdpError("invalid-pq", `entry ${p / 64 + 1} does not start with VVVS`);
    }
    const hours = intField(e, 8, 2) ?? 0;
    const min = intField(e, 10, 2) ?? 0;
    const sec = intField(e, 12, 2) ?? 0;
    const frames = intField(e, 14, 2) ?? 0;
    const sector = ((hours * 60 + min) * 60 + sec) * 75 + frames;
    entries.push({
      track: field(e, 4, 2).toUpperCase(),
      index: intField(e, 6, 2) ?? 0,
      sector,
      msf: sectorsToMsf(sector),
      control1: field(e, 16, 2),
      control2: field(e, 18, 2),
      isrc: field(e, 20, 12),
      upc: field(e, 32, 13),
      text: field(e, 45, 19),
    });
  }
  return entries;
}

// ---------- CD-Text ----------
interface CdTextResult {
  album: Record<number, string>; // by pack type
  tracks: Record<number, Record<number, string>>; // track -> type -> text
}

export function parseCdText(raw: Uint8Array): CdTextResult {
  let bytes = raw;
  // Some tools prepend a 4-byte header (size + 2 reserved) or append a 0 byte
  const remainder = bytes.length % 18;
  if (remainder === 4 || remainder === 5) bytes = bytes.subarray(4);

  const packs: { type: number; track: number; seq: number; block: number; dbcc: boolean; data: Uint8Array }[] = [];
  for (let p = 0; p + 18 <= bytes.length; p += 18) {
    const type = bytes[p];
    if (type < 0x80 || type > 0x8f) continue;
    packs.push({
      type,
      track: bytes[p + 1] & 0x7f,
      seq: bytes[p + 2],
      block: (bytes[p + 3] >> 4) & 0x07,
      dbcc: (bytes[p + 3] & 0x80) !== 0,
      data: bytes.subarray(p + 4, p + 16),
    });
  }

  // Character code of block 0 from the size information pack (0x8F, seq 0)
  const sizeInfo = packs
    .filter((pk) => pk.type === 0x8f && pk.block === 0)
    .sort((a, b) => a.track - b.track)[0];
  const charCode = sizeInfo ? sizeInfo.data[0] : 0;
  const decoderLabel = charCode === 0x80 ? "shift_jis" : "latin1";
  let decoder: TextDecoder;
  try {
    decoder = new TextDecoder(decoderLabel);
  } catch {
    decoder = latin1;
  }

  const result: CdTextResult = { album: {}, tracks: {} };
  const textTypes = [0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x8e];
  for (const type of textTypes) {
    const list = packs.filter((pk) => pk.type === type && pk.block === 0).sort((a, b) => a.seq - b.seq);
    if (list.length === 0) continue;
    const dbcc = list[0].dbcc;
    const all = new Uint8Array(list.length * 12);
    list.forEach((pk, i) => all.set(pk.data, i * 12));
    // Split on terminators (one 0 byte, or two for double-byte text)
    const strings: string[] = [];
    let start = 0;
    const step = dbcc ? 2 : 1;
    for (let i = 0; i < all.length; i += step) {
      const isEnd = dbcc ? all[i] === 0 && all[i + 1] === 0 : all[i] === 0;
      if (isEnd) {
        strings.push(decoder.decode(all.subarray(start, i)));
        start = i + step;
      }
    }
    let track = list[0].track;
    let previous = "";
    for (const s of strings) {
      // A single TAB means "same as previous track"
      const value = s === "\t" || s === "\t\t" ? previous : s.trim();
      previous = value;
      if (track === 0) result.album[type] = value;
      else {
        result.tracks[track] = result.tracks[track] ?? {};
        result.tracks[track][type] = value;
      }
      track++;
    }
  }
  return result;
}

// ---------- Disc model ----------
export interface DdpFiles {
  /** Looks up a file of the DDP by name (case-insensitive) */
  get(name: string): Blob | undefined;
}

async function readAll(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

export async function parseDdp(files: DdpFiles): Promise<DdpDisc> {
  const ddpIdBlob = files.get("DDPID");
  if (!ddpIdBlob) throw new DdpError("missing-ddpid");
  const ddpMsBlob = files.get("DDPMS");
  if (!ddpMsBlob) throw new DdpError("missing-ddpms");

  const id = parseDdpId(await readAll(ddpIdBlob));
  const map = parseDdpMs(await readAll(ddpMsBlob));

  // PQ descriptor: subcode packet with SUB "PQ DESCR"
  const pqPacket = map.find((m) => m.sub.replace(/\s/g, "").toUpperCase() === "PQDESCR");
  const pqName = pqPacket?.dsi || "PQDESCR";
  const pqBlob = files.get(pqName);
  if (!pqBlob) throw new DdpError("missing-pq", pqName);
  const pq = parsePq(await readAll(pqBlob));

  // CD-Text (optional)
  const cdTextPacket = map.find((m) => m.sub.toUpperCase() === "CDTEXT");
  const cdTextBlob = cdTextPacket ? files.get(cdTextPacket.dsi) : undefined;
  const cdText = cdTextBlob ? parseCdText(await readAll(cdTextBlob)) : null;

  // Audio data streams: main data (D0), not lead-in/out or fill
  const dataPackets = map.filter((m) => m.dst === "D0" && !m.sub);
  if (dataPackets.length === 0) throw new DdpError("missing-audio", "no D0 data stream in DDPMS");
  const nonAudio = dataPackets.find((m) => m.cdm && m.cdm !== "DA");
  if (nonAudio) throw new DdpError("not-audio", `CD mode ${nonAudio.cdm}`);
  const audioFiles = dataPackets.map((m, i) => ({ name: m.dsi, offset: i === 0 ? (m.ofs ?? 0) : 0 }));
  for (const f of audioFiles) {
    if (!files.get(f.name)) throw new DdpError("missing-audio", f.name);
  }
  const imageStartSector = dataPackets[0].dss ?? 0;

  // Tracks from the PQ entries
  const leadOut = pq.find((e) => e.track === "AA");
  const programEntries = pq.filter((e) => /^\d+$/.test(e.track) && Number(e.track) > 0);
  const byTrack = new Map<number, PqEntry[]>();
  for (const e of programEntries) {
    const n = Number(e.track);
    byTrack.set(n, [...(byTrack.get(n) ?? []), e]);
  }
  const numbers = [...byTrack.keys()].sort((a, b) => a - b);
  if (numbers.length === 0) throw new DdpError("invalid-pq", "no track entries");

  const tracks: DdpTrack[] = numbers.map((n) => {
    const entries = byTrack.get(n)!.sort((a, b) => a.index - b.index);
    const idx1 = entries.find((e) => e.index === 1) ?? entries[0];
    const idx0 = entries.find((e) => e.index === 0);
    const text = cdText?.tracks[n] ?? {};
    // Control 1 holds the Q-channel control bits as hex; bit 0 = pre-emphasis
    const control = Number.parseInt(idx1.control1 || "0", 16);
    return {
      number: n,
      title: text[0x80] ?? "",
      performer: text[0x81] ?? "",
      songwriter: text[0x82] ?? "",
      composer: text[0x83] ?? "",
      isrc: idx1.isrc || text[0x8e] || map.find((m) => Number(m.trk) === n && m.isrc)?.isrc || "",
      pregapSector: idx0 ? idx0.sector : idx1.sector,
      startSector: idx1.sector,
      endSector: 0,
      preEmphasis: Number.isFinite(control) && (control & 0x01) === 1,
      indexes: entries.map((e) => ({ index: e.index, sector: e.sector })),
    };
  });

  const leadOutSector =
    leadOut?.sector ??
    Math.max(...programEntries.map((e) => e.sector)) + 2 * SECTORS_PER_SECOND;
  tracks.forEach((t, i) => {
    t.endSector = i + 1 < tracks.length ? tracks[i + 1].pregapSector : leadOutSector;
  });

  return {
    level: id.level,
    upc: id.upc || pq.find((e) => e.upc)?.upc || cdText?.album[0x8e] || "",
    masterId: id.masterId,
    albumTitle: cdText?.album[0x80] ?? "",
    albumPerformer: cdText?.album[0x81] ?? "",
    tracks,
    pq,
    leadOutSector,
    map,
    audioFiles,
    imageStartSector,
    cdTextFile: cdTextPacket?.dsi ?? null,
    pqFile: pqName,
    hasCdText: !!cdText,
  };
}
