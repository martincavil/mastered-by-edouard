import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendAudioFilesNotificationEmails(
  uploaderName: string,
  uploaderEmail: string,
  filesCount: number,
  fileNames: string[],
  folderPath: string
): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured, skipping email notifications');
    return;
  }

  const clientEmail = process.env.RESEND_TO_EMAIL || 'contact@masteredbyedouard.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  console.log('Sending audio files notification emails with config:', {
    from: fromEmail,
    toClient: clientEmail,
    toUploader: uploaderEmail,
    resendConfigured: !!resend,
  });

  // Email pour le client (Edouard)
  const clientEmailResult = await resend.emails.send({
    from: fromEmail,
    to: clientEmail,
    subject: `Nouveaux fichiers audio uploadés - ${uploaderName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
    .section-title { font-weight: bold; color: #000; margin-bottom: 10px; font-size: 16px; }
    .field { margin: 8px 0; }
    .label { font-weight: bold; color: #666; }
    .file-list { background-color: #fff; border-left: 4px solid #000; padding: 15px; margin-top: 20px; }
    .file-item { padding: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouveaux fichiers audio uploadés</h1>
    </div>

    <div class="section">
      <div class="section-title">INFORMATIONS CLIENT</div>
      <div class="field"><span class="label">Nom :</span> ${uploaderName}</div>
      <div class="field"><span class="label">Email :</span> <a href="mailto:${uploaderEmail}">${uploaderEmail}</a></div>
    </div>

    <div class="section">
      <div class="section-title">DÉTAILS DE L'UPLOAD</div>
      <div class="field"><span class="label">Nombre de fichiers :</span> ${filesCount}</div>
      <div class="field"><span class="label">Dossier Dropbox :</span> ${folderPath}</div>
    </div>

    <div class="file-list">
      <div class="section-title">LISTE DES FICHIERS</div>
      ${fileNames.map((fileName, index) => `<div class="file-item">${index + 1}. ${fileName}</div>`).join('')}
    </div>
  </div>
</body>
</html>
    `,
  });

  console.log('Client email result:', clientEmailResult);

  // Email pour l'uploader (confirmation)
  const uploaderEmailResult = await resend.emails.send({
    from: fromEmail,
    to: uploaderEmail,
    subject: 'Confirmation de votre upload - Mastered by Edouard',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
    .section-title { font-weight: bold; color: #000; margin-bottom: 10px; font-size: 16px; }
    .field { margin: 8px 0; }
    .file-list { background-color: #fff; border-left: 4px solid #000; padding: 15px; margin-top: 20px; }
    .file-item { padding: 5px 0; }
    .footer { margin-top: 30px; padding: 15px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Upload confirmé !</h1>
    </div>

    <div class="section">
      <p>Bonjour ${uploaderName},</p>
      <p>Vos fichiers audio ont été uploadés avec succès sur Mastered by Edouard.</p>
    </div>

    <div class="file-list">
      <div class="section-title">FICHIERS UPLOADÉS (${filesCount})</div>
      ${fileNames.map((fileName, index) => `<div class="file-item">${index + 1}. ${fileName}</div>`).join('')}
    </div>

    <div class="footer">
      <p>Merci de votre confiance !</p>
      <p><strong>Mastered by Edouard</strong></p>
    </div>
  </div>
</body>
</html>
    `,
  });

  console.log('Uploader email result:', uploaderEmailResult);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, fileNames, folderPath } = body;

    if (!name || !email || !fileNames || !folderPath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send notification emails
    await sendAudioFilesNotificationEmails(
      name,
      email,
      fileNames.length,
      fileNames,
      folderPath
    );

    console.log('Audio files notification emails sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Notification emails sent successfully',
    });
  } catch (error) {
    console.error('Audio files notification error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send notification emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
