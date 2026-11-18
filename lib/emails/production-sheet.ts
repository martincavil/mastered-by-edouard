import { Resend } from 'resend';
import { assertEmailsSent } from '@/lib/emails/assert-sent';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendProductionSheetNotificationEmails(
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

  // Email pour le client (Edouard)
  const clientEmailResult = await resend.emails.send({
    from: 'Mastered by Edouard <contact@masteredbyedouard.com>',
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

  // Email pour l'uploader (confirmation)
  const uploaderEmailResult = await resend.emails.send({
    from: 'Mastered by Edouard <contact@masteredbyedouard.com>',
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

  assertEmailsSent({ client: clientEmailResult, uploader: uploaderEmailResult });
}
