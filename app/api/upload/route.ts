import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks
const LARGE_FILE_THRESHOLD = 150 * 1024 * 1024; // 150MB

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
    throw new Error('Failed to create folder in Dropbox');
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
    const folderName = `${name}-${timestamp}`;
    const folderPath = `/CLIENT_UPLOADS/${folderName}`;

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
