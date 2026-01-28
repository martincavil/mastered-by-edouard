import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

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
