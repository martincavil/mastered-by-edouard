import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks
const LARGE_FILE_THRESHOLD = 150 * 1024 * 1024; // 150MB

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
    const errorText = await response.text();
    console.error('Dropbox folder creation error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      path,
    });
    throw new Error(`Failed to create folder in Dropbox: ${response.status} - ${errorText}`);
  }
}

async function uploadSmallFile(file: Buffer, path: string): Promise<void> {
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
    throw new Error(`Failed to upload file: ${path}`);
  }
}

async function uploadLargeFile(file: Buffer, path: string): Promise<void> {
  let offset = 0;
  let sessionId: string | null = null;

  while (offset < file.length) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const isLastChunk = offset + chunk.length >= file.length;

    if (sessionId === null) {
      const startResponse = await fetch('https://content.dropboxapi.com/2/files/upload_session/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
        body: new Uint8Array(chunk),
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start upload session');
      }

      const data = await startResponse.json();
      sessionId = data.session_id;
    } else if (!isLastChunk) {
      const appendResponse = await fetch('https://content.dropboxapi.com/2/files/upload_session/append_v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            cursor: {
              session_id: sessionId,
              offset,
            },
          }),
        },
        body: new Uint8Array(chunk),
      });

      if (!appendResponse.ok) {
        throw new Error('Failed to append to upload session');
      }
    } else {
      const finishResponse = await fetch('https://content.dropboxapi.com/2/files/upload_session/finish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            cursor: {
              session_id: sessionId,
              offset,
            },
            commit: {
              path,
              mode: 'add',
              autorename: true,
              mute: false,
            },
          }),
        },
        body: new Uint8Array(chunk),
      });

      if (!finishResponse.ok) {
        throw new Error('Failed to finish upload session');
      }
    }

    offset += chunk.length;
  }
}

async function createFileRequest(title: string, destination: string): Promise<string> {
  const response = await fetch('https://api.dropboxapi.com/2/file_requests/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      destination,
      open: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to create file request:', errorData);
    throw new Error('Failed to create file request');
  }

  const data = await response.json();
  return data.url;
}

async function sendNotificationEmails(
  uploaderName: string,
  uploaderEmail: string,
  filesCount: number,
  fileNames: string[],
  folderPath: string,
  fileRequestUrl?: string
): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured, skipping email notifications');
    return;
  }

  const clientEmail = process.env.RESEND_TO_EMAIL || 'contact@masteredbyedouard.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  console.log('Sending emails with config:', {
    from: fromEmail,
    toClient: clientEmail,
    toUploader: uploaderEmail,
    resendConfigured: !!resend,
  });

  // Email pour le client (Edouard)
  const clientEmailResult = await resend.emails.send({
    from: fromEmail,
    to: clientEmail,
    subject: `Nouveaux fichiers uploadés - ${uploaderName}`,
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
      <p>Vos fichiers ont été uploadés avec succès sur Mastered by Edouard.</p>
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
    if (!DROPBOX_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'DROPBOX_ACCESS_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const files = formData.getAll('files') as File[];

    if (!name || !email || files.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const allowedExtensions = ['.wav', '.aif'];
    for (const file of files) {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}` },
          { status: 400 }
        );
      }
    }

    const timestamp = Date.now();
    const artistName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const folderName = `${artistName}-${timestamp}`;
    const folderPath = `/01_uploads/${folderName}`;

    await createFolder(folderPath);

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = `${folderPath}/${file.name}`;

      if (buffer.length > LARGE_FILE_THRESHOLD) {
        await uploadLargeFile(buffer, filePath);
      } else {
        await uploadSmallFile(buffer, filePath);
      }
    });

    await Promise.all(uploadPromises);

    // Send notification emails
    try {
      const fileNames = files.map(file => file.name);
      await sendNotificationEmails(
        name,
        email,
        files.length,
        fileNames,
        folderPath
      );
      console.log('Notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send notification emails (non-blocking):', emailError);
      // Don't fail the entire request if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      folder: folderPath,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
