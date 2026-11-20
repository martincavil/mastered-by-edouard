import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

export async function fillProductionSheetPDF(
  data: ProductionSheetData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let yPosition = height - 50;

  // Title
  page.drawText('PRODUCTION SHEET', {
    x: 50,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // Artist and Project
  page.drawText(`${data.artist} - ${data.projectTitle}`, {
    x: 50,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // Contact Information
  page.drawText('CONTACT INFORMATION', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 25;
  page.drawText(`Name: ${data.name}`, { x: 50, y: yPosition, size: 12, font });

  yPosition -= 20;
  page.drawText(`Email: ${data.email}`, { x: 50, y: yPosition, size: 12, font });

  yPosition -= 20;
  page.drawText(`Artist/Group: ${data.artist}`, { x: 50, y: yPosition, size: 12, font });

  yPosition -= 20;
  page.drawText(`Project Title: ${data.projectTitle}`, { x: 50, y: yPosition, size: 12, font });

  yPosition -= 40;

  // Formats
  page.drawText('FORMATS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 25;
  const formats = [];
  if (data.formats.streaming) formats.push('Streaming');
  if (data.formats.dolbyAtmos) formats.push('Dolby Atmos');
  if (data.formats.vinyl) formats.push('Vinyl');
  if (data.formats.cd) formats.push('CD');
  if (data.formats.alternativeVersions.length > 0) formats.push('Alternative Versions');

  page.drawText(formats.join(', ') || 'None', { x: 50, y: yPosition, size: 12, font });

  yPosition -= 25;
  if (data.cdUpc) {
    page.drawText(`CD UPC: ${data.cdUpc}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }
  if (data.vinylUpc) {
    page.drawText(`Vinyl UPC: ${data.vinylUpc}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }

  yPosition -= 20;

  // Credits
  page.drawText('CREDITS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 25;
  if (data.composer) {
    page.drawText(`Composer: ${data.composer}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }
  if (data.arranger) {
    page.drawText(`Arranger: ${data.arranger}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }
  if (data.genre) {
    page.drawText(`Genre: ${data.genre}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }
  if (data.label) {
    page.drawText(`Label: ${data.label}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }
  if (data.recordingEngineer) {
    page.drawText(`Recording Engineer: ${data.recordingEngineer}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }
  if (data.mixingEngineer) {
    page.drawText(`Mixing Engineer: ${data.mixingEngineer}`, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 20;
  }
  if (data.otherCredits) {
    page.drawText('Other Credits:', { x: 50, y: yPosition, size: 12, font: boldFont });
    yPosition -= 20;
    const creditLines = data.otherCredits.split('\n');
    creditLines.forEach(line => {
      page.drawText(line, { x: 50, y: yPosition, size: 12, font });
      yPosition -= 20;
    });
  }

  yPosition -= 20;

  // Track List
  page.drawText('TRACK LIST', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 25;

  data.tracks.forEach((track, index) => {
    if (yPosition < 50) {
      const newPage = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    page.drawText(`${index + 1}. ${track.title}`, { x: 50, y: yPosition, size: 12, font });
    if (track.isrc) {
      page.drawText(`ISRC: ${track.isrc}`, { x: 300, y: yPosition, size: 12, font });
    }
    yPosition -= 20;
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
