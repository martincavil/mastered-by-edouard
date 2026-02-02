import { NextRequest, NextResponse } from 'next/server';
import { fillProductionSheetPDF } from '@/lib/pdf/fillProductionSheet';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const pdfBytes = await fillProductionSheetPDF(data);

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="production-sheet-${data.artist}-${data.projectTitle}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Production sheet PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate production sheet PDF' },
      { status: 500 }
    );
  }
}
