import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

// Initialize Resend (optional)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function createFolder(path: string): Promise<void> {
  const response = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, autorename: false }),
  });

  if (!response.ok && response.status !== 409) {
    const errorData = await response.json();
    console.error('Dropbox create folder error:', {
      status: response.status,
      path,
      error: errorData,
    });
    throw new Error(`Failed to create folder in Dropbox: ${JSON.stringify(errorData)}`);
  }
}

async function uploadFile(file: Buffer, path: string): Promise<void> {
  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path,
        mode: 'add',
        autorename: true,
        mute: false,
      }),
    },
    body: new Uint8Array(file),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Dropbox upload error:', {
      status: response.status,
      path,
      error: errorText,
    });
    throw new Error(`Failed to upload file: ${path} - ${errorText}`);
  }
}

async function sendProductionSheetNotificationEmails(
  uploaderName: string,
  uploaderEmail: string,
  artistName: string,
  projectTitle: string,
  filesUploaded: string[],
  folderPath: string
): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured, skipping email notifications');
    return;
  }

  const clientEmail = process.env.RESEND_TO_EMAIL || 'contact@masteredbyedouard.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  console.log('Sending production sheet emails with config:', {
    from: fromEmail,
    toClient: clientEmail,
    toUploader: uploaderEmail,
    resendConfigured: !!resend,
  });

  // Email pour le client (Edouard)
  const clientEmailResult = await resend.emails.send({
    from: fromEmail,
    to: clientEmail,
    subject: `Nouvelle Production Sheet uploadée - ${artistName}`,
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
      <h1>Nouvelle Production Sheet uploadée</h1>
    </div>

    <div class="section">
      <div class="section-title">INFORMATIONS CLIENT</div>
      <div class="field"><span class="label">Nom :</span> ${uploaderName}</div>
      <div class="field"><span class="label">Email :</span> <a href="mailto:${uploaderEmail}">${uploaderEmail}</a></div>
      <div class="field"><span class="label">Artiste :</span> ${artistName}</div>
      <div class="field"><span class="label">Projet :</span> ${projectTitle}</div>
    </div>

    <div class="section">
      <div class="section-title">DÉTAILS DE L'UPLOAD</div>
      <div class="field"><span class="label">Nombre de fichiers :</span> ${filesUploaded.length}</div>
      <div class="field"><span class="label">Dossier Dropbox :</span> ${folderPath}</div>
    </div>

    <div class="file-list">
      <div class="section-title">FICHIERS UPLOADÉS</div>
      ${filesUploaded.map((fileName, index) => `<div class="file-item">${index + 1}. ${fileName}</div>`).join('')}
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
    subject: 'Confirmation de votre Production Sheet - Mastered by Edouard',
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
      <h1>Production Sheet confirmée !</h1>
    </div>

    <div class="section">
      <p>Bonjour ${uploaderName},</p>
      <p>Votre Production Sheet pour <strong>${artistName} - ${projectTitle}</strong> a été uploadée avec succès sur Mastered by Edouard.</p>
    </div>

    <div class="file-list">
      <div class="section-title">FICHIERS UPLOADÉS (${filesUploaded.length})</div>
      ${filesUploaded.map((fileName, index) => `<div class="file-item">${index + 1}. ${fileName}</div>`).join('')}
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
    if (!DROPBOX_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'DROPBOX_ACCESS_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const formDataString = formData.get('formData') as string;
    const parsedData = JSON.parse(formDataString);

    const coverFile = formData.get('cover') as File | null;
    const otherFiles = formData.getAll('otherFiles') as File[];
    const productionSheetPdf = formData.get('productionSheetPdf') as File | null;

    // Create folder name
    const timestamp = Date.now();
    const artistName = parsedData.artist.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const folderName = `${artistName}-${timestamp}`;
    const basePath = `/01_uploads/${folderName}`;

    // Create folder in Dropbox
    await createFolder(basePath);

    // Upload production sheet PDF with artist name
    if (productionSheetPdf) {
      const pdfBuffer = Buffer.from(await productionSheetPdf.arrayBuffer());
      await uploadFile(pdfBuffer, `${basePath}/${artistName}-production_sheet.pdf`);
    }

    // Upload cover image to root
    if (coverFile) {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      const coverExtension = coverFile.name.split('.').pop();
      await uploadFile(coverBuffer, `${basePath}/cover.${coverExtension}`);
    }

    // Upload other files to root
    for (const file of otherFiles) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await uploadFile(fileBuffer, `${basePath}/${file.name}`);
    }

    // Send notification emails
    try {
      const filesUploaded: string[] = [];

      if (productionSheetPdf) {
        filesUploaded.push(`${artistName}-production_sheet.pdf`);
      }
      if (coverFile) {
        filesUploaded.push(`cover.${coverFile.name.split('.').pop()}`);
      }
      otherFiles.forEach(file => {
        filesUploaded.push(file.name);
      });

      await sendProductionSheetNotificationEmails(
        parsedData.name,
        parsedData.email,
        parsedData.artist,
        parsedData.projectTitle,
        filesUploaded,
        basePath
      );
      console.log('Production sheet notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send production sheet notification emails (non-blocking):', emailError);
      // Don't fail the entire request if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'Production sheet uploaded successfully to Dropbox',
      folder: folderName,
      dropboxPath: basePath,
    });
  } catch (error) {
    console.error('Production sheet error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload production sheet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
