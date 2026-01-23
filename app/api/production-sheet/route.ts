import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

if (!DROPBOX_ACCESS_TOKEN) {
  throw new Error('DROPBOX_ACCESS_TOKEN is not configured');
}

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
    body: file,
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

export async function POST(request: NextRequest) {
  try {
    console.log('=== Production Sheet Upload Started ===');
    console.log('Token configured:', !!DROPBOX_ACCESS_TOKEN);

    const formData = await request.formData();
    const formDataString = formData.get('formData') as string;
    const parsedData = JSON.parse(formDataString);

    const coverFile = formData.get('cover') as File | null;
    const otherFiles = formData.getAll('otherFiles') as File[];
    const productionSheetPdf = formData.get('productionSheetPdf') as File | null;

    // Create folder name
    const timestamp = Date.now();
    const artistName = parsedData.artist.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const projectName = parsedData.projectTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const folderName = `${artistName}_${projectName}_${timestamp}`;
    const basePath = `/CLIENT_UPLOADS/${folderName}`;

    console.log('Creating folder structure:', basePath);

    // Create folder structure in Dropbox
    await createFolder(basePath);
    await createFolder(`${basePath}/informations`);
    if (coverFile) {
      await createFolder(`${basePath}/cover`);
    }
    if (otherFiles.length > 0) {
      await createFolder(`${basePath}/other-files`);
    }

    // Upload production sheet PDF
    if (productionSheetPdf) {
      const pdfBuffer = Buffer.from(await productionSheetPdf.arrayBuffer());
      await uploadFile(pdfBuffer, `${basePath}/informations/production-sheet.pdf`);
    }

    // Upload cover image
    if (coverFile) {
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      const coverExtension = coverFile.name.split('.').pop();
      await uploadFile(coverBuffer, `${basePath}/cover/cover.${coverExtension}`);
    }

    // Upload other files
    for (const file of otherFiles) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await uploadFile(fileBuffer, `${basePath}/other-files/${file.name}`);
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
