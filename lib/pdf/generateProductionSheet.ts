import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Track {
  id: string;
  title: string;
  isrc: string;
}

interface ProductionSheetData {
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
  tracks: Track[];
  composer: string;
  arranger: string;
  genre: string;
  label: string;
  recordingEngineer: string;
  mixingEngineer: string;
  otherCredits: string;
}

export function generateProductionSheetPDF(
  data: ProductionSheetData,
): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const redHeader = [255, 0, 0]; // #FF0000
    const darkRed = [204, 0, 0]; // #CC0000
    const lightGray = [229, 229, 229]; // #E5E5E5
    const black = [0, 0, 0];
    const white = [255, 255, 255];

    // ========== HEADER (Red background) ==========
    doc.setFillColor(redHeader[0], redHeader[1], redHeader[2]);
    doc.rect(0, 0, pageWidth, 50, "F");

    // Logo centered
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("mastered by edouard", pageWidth / 2, 15, { align: "center" });

    // Project title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    const projectText = `${data.artist}_${data.projectTitle}`;
    doc.text(projectText, pageWidth / 2, 35, { align: "center" });

    // ========== BODY (White with rounded top) ==========
    // Simulate rounded corners with white rect
    doc.setFillColor(white[0], white[1], white[2]);
    doc.roundedRect(10, 45, pageWidth - 20, pageHeight - 55, 5, 5, "F");

    let yPosition = 60;
    const leftMargin = 15;
    const contentWidth = pageWidth - 30;
    const columnWidth = contentWidth / 2 - 5;

    // Helper function to draw gray input box
    const drawInput = (
      x: number,
      y: number,
      width: number,
      height: number,
      text: string,
    ) => {
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.roundedRect(x, y, width, height, 2, 2, "F");
      doc.setTextColor(black[0], black[1], black[2]);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(text, x + 3, y + height / 2 + 1.5);
    };

    // Helper function to draw pill (format button)
    const drawPill = (
      x: number,
      y: number,
      text: string,
      selected: boolean,
    ) => {
      const pillWidth = doc.getTextWidth(text) + 10;
      const pillHeight = 7;

      if (selected) {
        doc.setFillColor(black[0], black[1], black[2]);
        doc.roundedRect(x, y, pillWidth, pillHeight, 3, 3, "F");
        doc.setTextColor(white[0], white[1], white[2]);
      } else {
        doc.setDrawColor(black[0], black[1], black[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, pillWidth, pillHeight, 3, 3, "S");
        doc.setTextColor(black[0], black[1], black[2]);
      }

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(text, x + 5, y + 5);

      return pillWidth + 5; // Return width + gap
    };

    // ========== SECTION 1: INFORMATIONS ==========
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("informations.", leftMargin, yPosition);
    yPosition += 10;

    // Row 1: Name + Email
    drawInput(leftMargin, yPosition, columnWidth, 8, `name: ${data.name}`);
    drawInput(
      leftMargin + columnWidth + 10,
      yPosition,
      columnWidth,
      8,
      `mail: ${data.email}`,
    );
    yPosition += 12;

    // Row 2: Artist + Project Title
    drawInput(
      leftMargin,
      yPosition,
      columnWidth,
      8,
      `artist / group: ${data.artist}`,
    );
    drawInput(
      leftMargin + columnWidth + 10,
      yPosition,
      columnWidth,
      8,
      `project title: ${data.projectTitle}`,
    );
    yPosition += 12;

    // Format pills
    let pillX = leftMargin;
    pillX += drawPill(pillX, yPosition, "streaming", data.formats.streaming);
    pillX += drawPill(
      pillX,
      yPosition,
      "dolby atmos",
      data.formats.dolbyAtmos,
    );
    pillX += drawPill(pillX, yPosition, "vinyl", data.formats.vinyl);
    pillX += drawPill(pillX, yPosition, "cd", data.formats.cd);
    if (data.formats.alternativeVersions.length > 0) {
      pillX += drawPill(
        pillX,
        yPosition,
        `alternative versions (${data.formats.alternativeVersions.length})`,
        true,
      );
    }
    yPosition += 12;

    // UPC codes
    if (data.cdUpc) {
      drawInput(
        leftMargin,
        yPosition,
        columnWidth,
        8,
        `cd UPC: ${data.cdUpc}`,
      );
    }
    if (data.vinylUpc) {
      drawInput(
        leftMargin + columnWidth + 10,
        yPosition,
        columnWidth,
        8,
        `vinyl UPC: ${data.vinylUpc}`,
      );
    }
    yPosition += 15;

    // ========== SECTION 2: CREDITS ==========
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("credits.", leftMargin, yPosition);
    yPosition += 10;

    // Row 1: Composer + Arranger
    if (data.composer) {
      drawInput(
        leftMargin,
        yPosition,
        columnWidth,
        8,
        `composer: ${data.composer}`,
      );
    }
    if (data.arranger) {
      drawInput(
        leftMargin + columnWidth + 10,
        yPosition,
        columnWidth,
        8,
        `arranger: ${data.arranger}`,
      );
    }
    yPosition += 12;

    // Row 2: Genre + Label
    if (data.genre) {
      drawInput(leftMargin, yPosition, columnWidth, 8, `genre: ${data.genre}`);
    }
    if (data.label) {
      drawInput(
        leftMargin + columnWidth + 10,
        yPosition,
        columnWidth,
        8,
        `label: ${data.label}`,
      );
    }
    yPosition += 12;

    // Row 3: Recording Engineer + Mixing Engineer
    if (data.recordingEngineer) {
      drawInput(
        leftMargin,
        yPosition,
        columnWidth,
        8,
        `rec. engineer: ${data.recordingEngineer}`,
      );
    }
    if (data.mixingEngineer) {
      drawInput(
        leftMargin + columnWidth + 10,
        yPosition,
        columnWidth,
        8,
        `mix. engineer: ${data.mixingEngineer}`,
      );
    }
    yPosition += 12;

    // Other credits (textarea)
    if (data.otherCredits) {
      const lines = doc.splitTextToSize(data.otherCredits, contentWidth - 6);
      const textHeight = Math.max(15, lines.length * 4);
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.roundedRect(
        leftMargin,
        yPosition,
        contentWidth,
        textHeight,
        2,
        2,
        "F",
      );
      doc.setTextColor(black[0], black[1], black[2]);
      doc.setFontSize(8);
      doc.text(lines, leftMargin + 3, yPosition + 5);
      yPosition += textHeight + 5;
    }
    yPosition += 5;

    // ========== SECTION 3: TRACK LIST ==========
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("track list.", leftMargin, yPosition);
    yPosition += 10;

    // Table with autoTable
    const tableData = data.tracks.map((track, index) => [
      `${index + 1}. ${track.title}`,
      track.isrc || "-",
      "", // Cover placeholder
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["track title", "ISRC code", "cover"]],
      body: tableData,
      theme: "plain",
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0],
        fontStyle: "normal",
        fontSize: 8,
        halign: "center",
      },
      bodyStyles: {
        fillColor: [229, 229, 229],
        textColor: [0, 0, 0],
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [239, 239, 239],
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 60, halign: "center" },
        2: { cellWidth: 20, halign: "center" },
      },
      margin: { left: leftMargin, right: leftMargin },
      didDrawCell: (data) => {
        // Draw gray square for cover column
        if (data.column.index === 2 && data.section === "body") {
          const cellX = data.cell.x + 5;
          const cellY = data.cell.y + 2;
          doc.setFillColor(200, 200, 200);
          doc.rect(cellX, cellY, 10, 10, "F");
        }
      },
    });

    // Convert to Blob
    const pdfBlob = doc.output("blob");
    resolve(pdfBlob);
  });
}
