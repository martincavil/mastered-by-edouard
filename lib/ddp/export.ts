import { sectorsToMsf, type DdpDisc } from "./parse";

const csvCell = (value: string | number) => {
  const s = String(value ?? "");
  return /[";\n,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const safeName = (disc: DdpDisc) =>
  (disc.albumTitle || disc.upc || "ddp").replace(/[^\w.-]+/g, "_").slice(0, 60);

export function pqRows(disc: DdpDisc) {
  return disc.tracks.map((t) => ({
    track: String(t.number).padStart(2, "0"),
    title: t.title,
    performer: t.performer,
    isrc: t.isrc,
    pause: sectorsToMsf(t.startSector - t.pregapSector),
    start: sectorsToMsf(t.startSector),
    end: sectorsToMsf(t.endSector),
    duration: sectorsToMsf(t.endSector - t.startSector),
    preEmphasis: t.preEmphasis ? "yes" : "no",
  }));
}

export function exportPqCsv(disc: DdpDisc) {
  const header = ["track", "title", "performer", "ISRC", "pause", "start", "end", "duration", "pre-emphasis"];
  const lines = [
    `# album;${csvCell(disc.albumTitle)}`,
    `# artist;${csvCell(disc.albumPerformer)}`,
    `# UPC/EAN;${csvCell(disc.upc)}`,
    `# lead-out;${sectorsToMsf(disc.leadOutSector)}`,
    header.join(";"),
    ...pqRows(disc).map((r) =>
      [r.track, r.title, r.performer, r.isrc, r.pause, r.start, r.end, r.duration, r.preEmphasis].map(csvCell).join(";"),
    ),
  ];
  // BOM so Excel opens accents correctly
  download(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }), `${safeName(disc)}_pq-sheet.csv`);
}

export async function exportPqPdf(disc: DdpDisc) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 14;
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PQ sheet", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 7;
  const meta = [
    ["Album", disc.albumTitle || "-"],
    ["Artist", disc.albumPerformer || "-"],
    ["UPC/EAN", disc.upc || "-"],
    ["Tracks", String(disc.tracks.length)],
    ["Total (lead-out)", sectorsToMsf(disc.leadOutSector)],
  ];
  for (const [k, v] of meta) {
    doc.setFont("helvetica", "bold");
    doc.text(`${k}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(v, margin + 30, y);
    y += 5;
  }
  y += 4;

  const cols = [
    { key: "track", label: "#", x: margin, w: 8 },
    { key: "title", label: "Title", x: margin + 8, w: 62 },
    { key: "isrc", label: "ISRC", x: margin + 72, w: 30 },
    { key: "pause", label: "Pause", x: margin + 104, w: 18 },
    { key: "start", label: "Start", x: margin + 122, w: 18 },
    { key: "end", label: "End", x: margin + 140, w: 18 },
    { key: "duration", label: "Duration", x: margin + 158, w: 20 },
  ] as const;

  const header = () => {
    doc.setFillColor(22, 22, 22);
    doc.rect(margin, y - 4, 182, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    cols.forEach((c) => doc.text(c.label, c.x + 1, y));
    doc.setTextColor(22, 22, 22);
    doc.setFont("helvetica", "normal");
    y += 6;
  };
  header();
  pqRows(disc).forEach((row, i) => {
    if (y > 282) {
      doc.addPage();
      y = 18;
      header();
    }
    if (i % 2 === 1) {
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y - 4, 182, 6, "F");
    }
    cols.forEach((c) => {
      const value = String(row[c.key] ?? "");
      const fitted = doc.splitTextToSize(value, c.w - 2)[0] ?? "";
      doc.text(fitted === value ? value : `${fitted.slice(0, -1)}…`, c.x + 1, y);
    });
    y += 6;
  });

  y += 6;
  if (y > 270) {
    doc.addPage();
    y = 18;
  }
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("Generated locally by the mastered by edouard DDP player. DDP® is a trademark of DCA, Inc.", margin, y);

  download(doc.output("blob"), `${safeName(disc)}_pq-sheet.pdf`);
}
