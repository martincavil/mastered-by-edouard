import { jsPDF } from "jspdf";

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

// Helper function to load local image as base64
async function loadLocalImage(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load image:", error);
    return "";
  }
}

export function generateProductionSheetPDF(
  data: ProductionSheetData,
): Promise<Blob> {
  return new Promise(async (resolve) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // 595
    const pageHeight = doc.internal.pageSize.getHeight(); // 842

    // ========== COLORS ==========
    const redDark = [139, 0, 0]; // #8B0000
    const red = [255, 0, 0]; // #FF0000
    const lightGray = [229, 229, 229]; // #E5E5E5
    const black = [0, 0, 0];
    const white = [255, 255, 255];

    // ========== PAGE BACKGROUND RED-DARK ==========
    doc.setFillColor(redDark[0], redDark[1], redDark[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // ========== HEADER (1/8 de la page = 105px) ==========
    const headerHeight = 105;
    const pagePaddingX = 12; // 24px total (12px de chaque côté)

    // Charger le logo depuis /public/images/logo-white.webp
    const logoBase64 = await loadLocalImage("/images/logo-white.webp");

    // Logo centré
    if (logoBase64) {
      const logoWidth = 120;
      const logoHeight = 40; // proportionnel
      const logoX = (pageWidth - logoWidth) / 2;
      const logoY = 15;
      try {
        doc.addImage(logoBase64, "WEBP", logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.error("Failed to add logo:", error);
      }
    }

    // Titre "[artist name]_[project name]"
    const titleY = 65;
    doc.setFontSize(32);
    doc.setTextColor(red[0], red[1], red[2]);

    // Calculer largeurs pour centrer
    doc.setFont("helvetica", "normal"); // light
    const artistText = data.artist;
    const artistWidth = doc.getTextWidth(artistText);
    const underscoreText = "_";
    const underscoreWidth = doc.getTextWidth(underscoreText);

    doc.setFont("helvetica", "bold");
    const projectText = data.projectTitle;
    const projectWidth = doc.getTextWidth(projectText);

    const totalTitleWidth = artistWidth + underscoreWidth + projectWidth;
    const titleStartX = (pageWidth - totalTitleWidth) / 2;

    // Artist name (normal/light)
    doc.setFont("helvetica", "normal");
    doc.text(artistText, titleStartX, titleY);

    // Underscore
    doc.text(underscoreText, titleStartX + artistWidth, titleY);

    // Project name (bold)
    doc.setFont("helvetica", "bold");
    doc.text(projectText, titleStartX + artistWidth + underscoreWidth, titleY);

    // ========== BODY BLANC (commence à Y=105, jusqu'à Y=842) ==========
    const bodyStartY = headerHeight;
    const bodyPaddingX = 40;
    const bodyPaddingY = 20;
    const bodyWidth = pageWidth - (pagePaddingX * 2);
    const bodyHeight = pageHeight - bodyStartY;

    doc.setFillColor(white[0], white[1], white[2]);
    doc.rect(pagePaddingX, bodyStartY, bodyWidth, bodyHeight, "F");

    // Content area
    const contentX = pagePaddingX + bodyPaddingX;
    const contentWidth = bodyWidth - (bodyPaddingX * 2);
    let yPosition = bodyStartY + bodyPaddingY;

    // Helper pour dessiner un div gris #E5E5E5 avec texte centré verticalement
    const drawGrayBox = (
      x: number,
      y: number,
      width: number,
      height: number,
      text: string,
      centered: boolean = false,
    ) => {
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.roundedRect(x, y, width, height, 8, 8, "F");
      doc.setTextColor(black[0], black[1], black[2]);
      doc.setFontSize(18);
      doc.setFont("helvetica", "normal");

      const textY = y + height / 2 + 3;
      if (centered) {
        doc.text(text, x + width / 2, textY, { align: "center" });
      } else {
        doc.text(text, x + 12, textY);
      }
    };

    // ========== SECTION 1: "informations." ==========
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text("informations.", contentX, yPosition);
    yPosition += 8; // margin-bottom

    const infoStartY = yPosition;

    // Layout: 2 colonnes avec gap 30px
    const columnGap = 30;
    const leftColWidth = (contentWidth - columnGap) / 2;
    const rightColWidth = (contentWidth - columnGap) / 2;
    const leftColX = contentX;
    const rightColX = contentX + leftColWidth + columnGap;

    // COLONNE DE GAUCHE: Grid 2x2 (4 champs)
    const boxHeight = 45;
    const gridGap = 10;
    const smallBoxWidth = (leftColWidth - gridGap) / 2;

    // Ligne 1: name + mail
    drawGrayBox(leftColX, yPosition, smallBoxWidth, boxHeight, data.name);
    drawGrayBox(leftColX + smallBoxWidth + gridGap, yPosition, smallBoxWidth, boxHeight, data.email);
    yPosition += boxHeight + gridGap;

    // Ligne 2: artist/group + project title
    drawGrayBox(leftColX, yPosition, smallBoxWidth, boxHeight, data.artist);
    drawGrayBox(leftColX + smallBoxWidth + gridGap, yPosition, smallBoxWidth, boxHeight, data.projectTitle);

    // COLONNE DE DROITE: Pills + UPC codes
    let rightY = infoStartY;

    // Helper pour dessiner une pill
    const drawPill = (x: number, y: number, text: string, selected: boolean) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      const pillWidth = doc.getTextWidth(text) + 48; // py-2 px-6 = 48px horizontal padding
      const pillHeight = 12; // py-2 approximation

      if (selected) {
        doc.setFillColor(black[0], black[1], black[2]);
        doc.roundedRect(x, y, pillWidth, pillHeight, 20, 20, "F");
        doc.setTextColor(white[0], white[1], white[2]);
      } else {
        doc.setFillColor(white[0], white[1], white[2]);
        doc.roundedRect(x, y, pillWidth, pillHeight, 20, 20, "F");
        doc.setDrawColor(black[0], black[1], black[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, pillWidth, pillHeight, 20, 20, "S");
        doc.setTextColor(black[0], black[1], black[2]);
      }

      doc.text(text, x + 24, y + pillHeight / 2 + 1.5);
      return pillWidth + 10; // width + gap
    };

    // Pills des formats (afficher tous, sélectionnés ou non)
    let pillX = rightColX;
    let pillY = rightY;

    pillX += drawPill(pillX, pillY, "streaming", data.formats.streaming);
    if (pillX + 80 > rightColX + rightColWidth) {
      pillY += 22;
      pillX = rightColX;
    }
    pillX += drawPill(pillX, pillY, "dolby atmos", data.formats.dolbyAtmos);
    if (pillX + 80 > rightColX + rightColWidth) {
      pillY += 22;
      pillX = rightColX;
    }
    pillX += drawPill(pillX, pillY, "vinyl", data.formats.vinyl);
    if (pillX + 80 > rightColX + rightColWidth) {
      pillY += 22;
      pillX = rightColX;
    }
    pillX += drawPill(pillX, pillY, "cd", data.formats.cd);
    if (pillX + 120 > rightColX + rightColWidth) {
      pillY += 22;
      pillX = rightColX;
    }
    const hasAltVersions = data.formats.alternativeVersions && data.formats.alternativeVersions.length > 0;
    drawPill(pillX, pillY, "alternative version(s)", hasAltVersions);

    // UPC Codes (margin-top 15px)
    rightY = pillY + 27;

    // Grid 2 colonnes pour UPC
    const upcBoxWidth = (rightColWidth - gridGap) / 2;
    if (data.cdUpc) {
      drawGrayBox(rightColX, rightY, upcBoxWidth, boxHeight, data.cdUpc);
    }
    if (data.vinylUpc) {
      drawGrayBox(rightColX + upcBoxWidth + gridGap, rightY, upcBoxWidth, boxHeight, data.vinylUpc);
    }

    // Avancer yPosition
    yPosition = Math.max(yPosition + boxHeight + gridGap, rightY + boxHeight) + 40;

    // ========== SECTION 2: "credits." ==========
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text("credits.", contentX, yPosition);
    yPosition += 8; // margin-bottom

    const creditsStartY = yPosition;

    // COLONNE DE GAUCHE: Grid 2x3 (6 champs)
    // Ligne 1: composer + arranger
    drawGrayBox(leftColX, yPosition, smallBoxWidth, boxHeight, data.composer || "");
    drawGrayBox(leftColX + smallBoxWidth + gridGap, yPosition, smallBoxWidth, boxHeight, data.arranger || "");
    yPosition += boxHeight + gridGap;

    // Ligne 2: genre + label
    drawGrayBox(leftColX, yPosition, smallBoxWidth, boxHeight, data.genre || "");
    drawGrayBox(leftColX + smallBoxWidth + gridGap, yPosition, smallBoxWidth, boxHeight, data.label || "");
    yPosition += boxHeight + gridGap;

    // Ligne 3: recording engineer + mixing engineer
    drawGrayBox(leftColX, yPosition, smallBoxWidth, boxHeight, data.recordingEngineer || "");
    drawGrayBox(leftColX + smallBoxWidth + gridGap, yPosition, smallBoxWidth, boxHeight, data.mixingEngineer || "");

    // COLONNE DE DROITE: Grande box "other credits" (height fixe 160px)
    const otherCreditsHeight = 160;

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(rightColX, creditsStartY, rightColWidth, otherCreditsHeight, 8, 8, "F");

    if (data.otherCredits) {
      doc.setTextColor(black[0], black[1], black[2]);
      doc.setFontSize(18);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(data.otherCredits, rightColWidth - 24);
      doc.text(lines, rightColX + 12, creditsStartY + 15);
    }

    // Avancer yPosition
    yPosition = Math.max(yPosition + boxHeight + gridGap, creditsStartY + otherCreditsHeight) + 40;

    // ========== SECTION 3: "track list." ==========
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > pageHeight - 400) {
      doc.addPage();

      // Redessiner le background red-dark et le body blanc
      doc.setFillColor(redDark[0], redDark[1], redDark[2]);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      doc.setFillColor(white[0], white[1], white[2]);
      doc.rect(pagePaddingX, 0, bodyWidth, pageHeight, "F");

      yPosition = bodyPaddingY;
    }

    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.text("track list.", contentX, yPosition);
    yPosition += 8; // margin-bottom

    // Headers (14px, regular, noir)
    const trackCol1Width = contentWidth / 3;
    const trackCol2Width = contentWidth / 3;
    const trackCol3Width = contentWidth / 3;
    const trackColGap = 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(black[0], black[1], black[2]);

    // Header alignements
    doc.text("track title", contentX, yPosition);
    doc.text("ISRC code", contentX + trackCol1Width + trackColGap + trackCol2Width / 2, yPosition, { align: "center" });
    doc.text("cover", contentX + trackCol1Width + trackCol2Width + (trackColGap * 2) + trackCol3Width / 2, yPosition, { align: "center" });
    yPosition += 10; // margin-bottom header

    // Lignes du tableau - Grid 3 colonnes, gap 10px
    const actualCol1Width = (contentWidth - (trackColGap * 2)) / 3;
    const actualCol2Width = (contentWidth - (trackColGap * 2)) / 3;
    const actualCol3Width = (contentWidth - (trackColGap * 2)) / 3;

    data.tracks.forEach((track, index) => {
      // Vérifier si on doit passer à une nouvelle page (besoin de 360px pour cover)
      if (yPosition > pageHeight - 400) {
        doc.addPage();

        // Redessiner backgrounds
        doc.setFillColor(redDark[0], redDark[1], redDark[2]);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        doc.setFillColor(white[0], white[1], white[2]);
        doc.rect(pagePaddingX, 0, bodyWidth, pageHeight, "F");

        yPosition = bodyPaddingY;
      }

      const rowStartY = yPosition;

      // Colonne 1: Track title (45px height)
      drawGrayBox(contentX, yPosition, actualCol1Width, boxHeight, `${index + 1}. ${track.title}`);

      // Colonne 2: ISRC code (45px height, centré)
      drawGrayBox(
        contentX + actualCol1Width + trackColGap,
        yPosition,
        actualCol2Width,
        boxHeight,
        track.isrc || "",
        true
      );

      // Colonne 3: Cover (350x350px carré)
      const coverSize = 350;
      const coverX = contentX + actualCol1Width + actualCol2Width + (trackColGap * 2);

      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.roundedRect(coverX, yPosition, coverSize, coverSize, 8, 8, "F");

      // TODO: Si track.cover existe, afficher l'image
      // Pour l'instant, juste le background gris

      // Avancer yPosition (cover est plus grand que les autres colonnes)
      yPosition += coverSize + 10; // gap vertical
    });

    // Convert to Blob
    const pdfBlob = doc.output("blob");
    resolve(pdfBlob);
  });
}
