import { NextRequest, NextResponse } from 'next/server';
import { sendProductionSheetNotificationEmails } from '@/lib/emails/production-sheet';

// Called by the ProductionSheet component once the PDF, cover and other files
// have been uploaded directly from the browser to Dropbox.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, artist, projectTitle, fileNames, folderPath } = body;

    if (!name || !email || !artist || !projectTitle || !Array.isArray(fileNames) || !folderPath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await sendProductionSheetNotificationEmails(
      name,
      email,
      artist,
      projectTitle,
      fileNames,
      folderPath
    );

    return NextResponse.json({
      success: true,
      message: 'Notification emails sent successfully',
    });
  } catch (error) {
    console.error('Production sheet notification error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send notification emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
