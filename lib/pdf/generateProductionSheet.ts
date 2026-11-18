import { jsPDF } from "jspdf";

/**
 * Production sheet PDF, generated in the browser with jsPDF.
 *
 * Layout follows the mockup lib/pdf/Production sheet.pdf (A4, 210 x 297 mm).
 * Every position below is in millimetres and was measured on the mockup
 * (992 x 1403 px render, 1 px = 0.2117 mm). Values only, no labels, in fixed
 * height grey blocks; texts are truncated to their block, never wrapped over
 * the next element.
 */

export interface ProductionSheetTrack {
  id: string;
  title: string;
  isrc: string;
}

export interface ProductionSheetData {
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
  tracks: ProductionSheetTrack[];
  composer: string;
  arranger: string;
  genre: string;
  label: string;
  recordingEngineer: string;
  mixingEngineer: string;
  otherCredits: string;
}

// ---------- Design tokens ----------
const RED_DARK: [number, number, number] = [113, 6, 0]; // #710600
const RED: [number, number, number] = [226, 6, 0]; // #E20600
const BLACK: [number, number, number] = [22, 22, 22]; // #161616
const GREY: [number, number, number] = [229, 229, 229]; // #E5E5E5
const WHITE: [number, number, number] = [255, 255, 255];

const PAGE_W = 210;
const PAGE_H = 297;

// ---------- Grid (mm) ----------
const BODY = { x: 1.7, y: 37.7, w: 206.6, h: 257.6, r: 1.7 };
const BODY_NEXT_PAGE = { x: 1.7, y: 1.7, w: 206.6, h: 293.6, r: 1.7 };
const COL_A = { x: 10.2, w: 44 }; // name / artist / composer / genre / recording
const COL_B = { x: 56.9, w: 44 }; // mail / project / arranger / label / mixing
const RIGHT = { x: 105, w: 96.1 }; // pills, UPC, other credits
const BLOCK_H = 7.6;
const BLOCK_R = 1.3;
const VALUE_SIZE = 8.5; // pt
const SECTION_SIZE = 26; // pt

const LAYOUT = {
  logo: { w: 40, h: 40 / 3.924, y: 5 },
  title: { x: 10.2, baseline: 33.2, maxW: 189.6, maxSize: 34, minSize: 14 },
  info: { title: 51.6, row1: 55.7, row2: 65.4 },
  pills: { y: 59.5, h: 4.7, gap: 2.4, size: 6.5 },
  upc: { y: 66.3, h: 4.8, cdX: 105, vinylX: 154.7, w: 46.4 },
  credits: { title: 87.0, rows: [90.4, 100.1, 110.3], otherH: 27.5 },
  tracks: {
    title: 132.1,
    header: 139.4,
    firstRow: 142.5,
    pitch: 9.74,
    titleCol: { x: 10.2, w: 61.6 },
    isrcCol: { x: 73.9, w: 61.6 },
    cover: { x: 137.6, w: 61.4 },
    bottom: 286.5,
  },
};

// ---------- Assets ----------
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFont(doc: jsPDF, file: string, name: string, style: string) {
  const response = await fetch(`/fonts/${file}`);
  if (!response.ok) throw new Error(`Failed to load font ${file}`);
  doc.addFileToVFS(file, arrayBufferToBase64(await response.arrayBuffer()));
  doc.addFont(file, name, style);
}

/** Draws any browser-readable image (webp, jpeg, png) into a canvas -> data URL */
function imageToDataUrl(
  src: string,
  maxSize: number,
  type: "image/png" | "image/jpeg",
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve({ dataUrl: canvas.toDataURL(type, 0.85), width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error(`Failed to load image ${src}`));
    img.src = src;
  });
}

// ---------- Drawing helpers ----------
const setFill = (doc: jsPDF, c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
const setText = (doc: jsPDF, c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
const setDraw = (doc: jsPDF, c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

/** Truncates text with an ellipsis so it fits maxWidth (mm) at the current font */
function fit(doc: jsPDF, text: string, maxWidth: number): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (doc.getTextWidth(clean) <= maxWidth) return clean;
  let out = clean;
  while (out.length > 0 && doc.getTextWidth(`${out}…`) > maxWidth) out = out.slice(0, -1);
  return `${out.trimEnd()}…`;
}

/** Vertical baseline to center a single line of `size` pt in a box of height h */
const centeredBaseline = (y: number, h: number, size: number) => y + h / 2 + (size * 0.3528) * 0.35;

function valueBlock(doc: jsPDF, x: number, y: number, w: number, value: string, h = BLOCK_H) {
  setFill(doc, GREY);
  doc.roundedRect(x, y, w, h, BLOCK_R, BLOCK_R, "F");
  if (!value?.trim()) return;
  doc.setFont("Poppins", "normal");
  doc.setFontSize(VALUE_SIZE);
  setText(doc, BLACK);
  const padX = 3.8;
  doc.text(fit(doc, value, w - padX * 2), x + padX, centeredBaseline(y, h, VALUE_SIZE));
}

/** Multi-line block with a fixed height: extra lines are dropped, last kept line gets an ellipsis */
function multilineBlock(doc: jsPDF, x: number, y: number, w: number, h: number, value: string) {
  setFill(doc, GREY);
  doc.roundedRect(x, y, w, h, BLOCK_R, BLOCK_R, "F");
  if (!value?.trim()) return;
  doc.setFont("Poppins", "normal");
  doc.setFontSize(VALUE_SIZE);
  setText(doc, BLACK);
  const padX = 3.8;
  const lineH = VALUE_SIZE * 0.3528 * 1.35;
  const maxLines = Math.floor((h - 4) / lineH);
  const lines: string[] = doc.splitTextToSize(value.trim(), w - padX * 2);
  const kept = lines.slice(0, maxLines);
  if (lines.length > maxLines && kept.length > 0) {
    kept[kept.length - 1] = fit(doc, `${kept[kept.length - 1]}…`, w - padX * 2);
  }
  kept.forEach((line, i) => doc.text(line, x + padX, y + 2.2 + lineH * (i + 0.8)));
}

function pill(doc: jsPDF, x: number, y: number, label: string, selected: boolean, maxW?: number): number {
  const { h, size } = LAYOUT.pills;
  doc.setFont("Poppins", "normal");
  doc.setFontSize(size);
  const padX = 2.6;
  const text = maxW ? fit(doc, label, maxW - padX * 2) : label;
  const w = doc.getTextWidth(text) + padX * 2;
  setDraw(doc, BLACK);
  doc.setLineWidth(0.25);
  if (selected) {
    setFill(doc, BLACK);
    doc.roundedRect(x, y, w, h, h / 2, h / 2, "FD");
    setText(doc, WHITE);
  } else {
    setFill(doc, WHITE);
    doc.roundedRect(x, y, w, h, h / 2, h / 2, "FD");
    setText(doc, BLACK);
  }
  doc.text(text, x + padX, centeredBaseline(y, h, size));
  return w;
}

function outlinedValue(doc: jsPDF, x: number, y: number, w: number, h: number, value: string) {
  setDraw(doc, BLACK);
  doc.setLineWidth(0.25);
  setFill(doc, WHITE);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, "FD");
  if (!value?.trim()) return;
  doc.setFont("Poppins", "normal");
  doc.setFontSize(LAYOUT.pills.size);
  setText(doc, BLACK);
  doc.text(fit(doc, value, w - 5.2), x + 2.6, centeredBaseline(y, h, LAYOUT.pills.size));
}

function sectionTitle(doc: jsPDF, text: string, baseline: number) {
  doc.setFont("Poppins", "bold");
  doc.setFontSize(SECTION_SIZE);
  setText(doc, BLACK);
  doc.setCharSpace(-0.35);
  doc.text(text, 10.2, baseline);
  doc.setCharSpace(0);
}

function pageBackground(doc: jsPDF, body: typeof BODY) {
  setFill(doc, RED_DARK);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  setFill(doc, WHITE);
  doc.roundedRect(body.x, body.y, body.w, body.h, body.r, body.r, "F");
}

function drawTitle(doc: jsPDF, artist: string, project: string) {
  const { x, baseline, maxW, maxSize, minSize } = LAYOUT.title;
  const left = `${artist.trim()}_`;
  const right = project.trim();
  let size = maxSize;
  const measure = () => {
    doc.setFontSize(size);
    doc.setFont("Poppins", "light");
    const a = doc.getTextWidth(left);
    doc.setFont("Poppins", "bold");
    return a + doc.getTextWidth(right);
  };
  while (size > minSize && measure() > maxW) size -= 1;
  measure();

  setText(doc, RED);
  doc.setFont("Poppins", "light");
  const leftText = fit(doc, left, maxW * 0.55);
  doc.text(leftText, x, baseline);
  const leftW = doc.getTextWidth(leftText);
  doc.setFont("Poppins", "bold");
  doc.text(fit(doc, right, maxW - leftW), x + leftW, baseline);
}

// ---------- Main ----------
export async function generateProductionSheetPDF(
  data: ProductionSheetData,
  cover?: File | Blob | null,
): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });

  await Promise.all([
    loadFont(doc, "Poppins-Light.ttf", "Poppins", "light"),
    loadFont(doc, "Poppins-Regular.ttf", "Poppins", "normal"),
    loadFont(doc, "Poppins-Bold.ttf", "Poppins", "bold"),
  ]);

  const [logo, coverImage] = await Promise.all([
    imageToDataUrl("/images/logo-white.webp", 1200, "image/png").catch(() => null),
    cover
      ? (async () => {
          const url = URL.createObjectURL(cover);
          try {
            return await imageToDataUrl(url, 600, "image/jpeg");
          } finally {
            URL.revokeObjectURL(url);
          }
        })().catch(() => null)
      : Promise.resolve(null),
  ]);

  // ===== Page 1: background, header =====
  pageBackground(doc, BODY);
  if (logo) {
    const { w, h, y } = LAYOUT.logo;
    doc.addImage(logo.dataUrl, "PNG", (PAGE_W - w) / 2, y, w, h);
  }
  drawTitle(doc, data.artist || "artist", data.projectTitle || "project");

  // ===== informations. =====
  sectionTitle(doc, "informations.", LAYOUT.info.title);
  valueBlock(doc, COL_A.x, LAYOUT.info.row1, COL_A.w, data.name);
  valueBlock(doc, COL_B.x, LAYOUT.info.row1, COL_B.w, data.email);
  valueBlock(doc, COL_A.x, LAYOUT.info.row2, COL_A.w, data.artist);
  valueBlock(doc, COL_B.x, LAYOUT.info.row2, COL_B.w, data.projectTitle);

  // Format pills (black = selected)
  const altVersions = data.formats.alternativeVersions;
  const formats: [string, boolean][] = [
    ["streaming", data.formats.streaming],
    ["dolby atmos", data.formats.dolbyAtmos],
    ["vinyl", data.formats.vinyl],
    ["cd", data.formats.cd],
  ];
  let px = RIGHT.x;
  formats.forEach(([label, selected]) => {
    px += pill(doc, px, LAYOUT.pills.y, label, selected) + LAYOUT.pills.gap;
  });
  const altLabel = altVersions.length > 0 ? `alt. : ${altVersions.join(", ")}` : "alternative version(s)";
  pill(doc, px, LAYOUT.pills.y, altLabel, altVersions.length > 0, RIGHT.x + RIGHT.w - px);

  outlinedValue(doc, LAYOUT.upc.cdX, LAYOUT.upc.y, LAYOUT.upc.w, LAYOUT.upc.h, data.cdUpc);
  outlinedValue(doc, LAYOUT.upc.vinylX, LAYOUT.upc.y, LAYOUT.upc.w, LAYOUT.upc.h, data.vinylUpc);

  // ===== credits. =====
  sectionTitle(doc, "credits.", LAYOUT.credits.title);
  const [r1, r2, r3] = LAYOUT.credits.rows;
  valueBlock(doc, COL_A.x, r1, COL_A.w, data.composer);
  valueBlock(doc, COL_B.x, r1, COL_B.w, data.arranger);
  valueBlock(doc, COL_A.x, r2, COL_A.w, data.genre);
  valueBlock(doc, COL_B.x, r2, COL_B.w, data.label);
  valueBlock(doc, COL_A.x, r3, COL_A.w, data.recordingEngineer);
  valueBlock(doc, COL_B.x, r3, COL_B.w, data.mixingEngineer);
  multilineBlock(doc, RIGHT.x, r1, RIGHT.w, LAYOUT.credits.otherH, data.otherCredits);

  // ===== track list. =====
  const T = LAYOUT.tracks;
  sectionTitle(doc, "track list.", T.title);

  const columnHeader = (y: number) => {
    doc.setFont("Poppins", "bold");
    doc.setFontSize(7.5);
    setText(doc, BLACK);
    doc.text("track title", T.titleCol.x + T.titleCol.w / 2, y, { align: "center" });
    doc.text("ISRC code", T.isrcCol.x + T.isrcCol.w / 2, y, { align: "center" });
  };
  columnHeader(T.header);
  doc.setFont("Poppins", "bold");
  doc.setFontSize(7.5);
  doc.text("cover", T.cover.x + T.cover.w / 2, T.header, { align: "center" });

  // Cover: one square preview on the right of the table
  setFill(doc, GREY);
  doc.roundedRect(T.cover.x, T.firstRow, T.cover.w, T.cover.w, BLOCK_R, BLOCK_R, "F");
  if (coverImage) {
    const ratio = coverImage.width / coverImage.height;
    const w = ratio >= 1 ? T.cover.w : T.cover.w * ratio;
    const h = ratio >= 1 ? T.cover.w / ratio : T.cover.w;
    doc.addImage(
      coverImage.dataUrl,
      "JPEG",
      T.cover.x + (T.cover.w - w) / 2,
      T.firstRow + (T.cover.w - h) / 2,
      w,
      h,
    );
  }

  // Rows. Up to 15 tracks at the mockup pitch; up to 22 tracks the pitch is
  // tightened so everything still fits on one page; beyond that the list
  // continues on the next page(s).
  const tracks = data.tracks.filter((t) => t.title.trim() || t.isrc.trim());
  const available = T.bottom - T.firstRow;
  const singlePagePitch = available / Math.max(1, tracks.length);
  const fitsOnePage = tracks.length <= 22;
  const pitch = fitsOnePage ? Math.min(T.pitch, singlePagePitch) : T.pitch;
  const rowH = Math.min(BLOCK_H, pitch * 0.78);

  let y = T.firstRow;
  tracks.forEach((track, index) => {
    if (y + rowH > T.bottom) {
      doc.addPage();
      pageBackground(doc, BODY_NEXT_PAGE);
      sectionTitle(doc, "track list.", 16);
      columnHeader(23.5);
      y = 26.6;
    }
    valueBlock(doc, T.titleCol.x, y, T.titleCol.w, `${index + 1}. ${track.title}`, rowH);
    valueBlock(doc, T.isrcCol.x, y, T.isrcCol.w, track.isrc.toUpperCase(), rowH);
    y += pitch;
  });

  return doc.output("blob");
}
