import { NextRequest, NextResponse } from 'next/server';

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

// Store upload sessions in memory (in production, use Redis or database)
const uploadSessions = new Map<string, {
  sessionId: string;
  offset: number;
  folderPath: string;
  fileName: string;
}>();

export async function POST(request: NextRequest) {
  try {
    if (!DROPBOX_ACCESS_TOKEN) {
      console.error('[Upload Chunked] DROPBOX_ACCESS_TOKEN is not configured');
      return NextResponse.json(
        { error: 'DROPBOX_ACCESS_TOKEN is not configured' },
        { status: 500 }
      );
    }

    console.log('[Upload Chunked] Token configured:', DROPBOX_ACCESS_TOKEN ? 'YES' : 'NO');

    // Check if request is FormData (for append action with chunk)
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      // Handle append/finish action with chunk
      const formData = await request.formData();
      const uploadId = formData.get('uploadId') as string;
      const chunk = formData.get('chunk') as Blob;
      const isLastChunk = formData.get('isLastChunk') === 'true';

      const session = uploadSessions.get(uploadId);
      if (!session) {
        return NextResponse.json(
          { error: 'Upload session not found' },
          { status: 404 }
        );
      }

      const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

      if (!isLastChunk) {
        // Append chunk
        const appendResponse = await fetch('https://content.dropboxapi.com/2/files/upload_session/append_v2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify({
              cursor: {
                session_id: session.sessionId,
                offset: session.offset,
              },
            }),
          },
          body: new Uint8Array(chunkBuffer),
        });

        if (!appendResponse.ok) {
          const errorText = await appendResponse.text();
          throw new Error(`Failed to append chunk: ${errorText}`);
        }

        // Update offset
        session.offset += chunkBuffer.length;
        uploadSessions.set(uploadId, session);

        return NextResponse.json({
          success: true,
          offset: session.offset,
        });
      } else {
        // Finish upload with last chunk
        const filePath = `${session.folderPath}/${session.fileName}`;

        const finishResponse = await fetch('https://content.dropboxapi.com/2/files/upload_session/finish', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify({
              cursor: {
                session_id: session.sessionId,
                offset: session.offset,
              },
              commit: {
                path: filePath,
                mode: 'add',
                autorename: true,
                mute: false,
              },
            }),
          },
          body: new Uint8Array(chunkBuffer),
        });

        if (!finishResponse.ok) {
          const errorText = await finishResponse.text();
          throw new Error(`Failed to finish upload: ${errorText}`);
        }

        // Clean up session
        uploadSessions.delete(uploadId);

        return NextResponse.json({
          success: true,
          filePath,
        });
      }
    }

    // Handle JSON actions
    const body = await request.json();
    const { action } = body;

    // Create folder action
    if (action === 'create-folder') {
      const { folderPath } = body;
      console.log('[Upload Chunked] Creating folder:', folderPath);

      const folderResponse = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: folderPath, autorename: false }),
      });

      if (!folderResponse.ok && folderResponse.status !== 409) {
        const errorText = await folderResponse.text();
        console.error('[Upload Chunked] Failed to create folder:', errorText);
        throw new Error(`Failed to create folder: ${errorText}`);
      }

      console.log('[Upload Chunked] Folder created successfully');
      return NextResponse.json({ success: true, folderPath });
    }

    // Start a new upload session
    if (action === 'start') {
      const { fileName, folderPath } = body;

      // Start Dropbox upload session
      console.log('[Upload Chunked] Starting Dropbox upload session for:', fileName);

      const startResponse = await fetch('https://content.dropboxapi.com/2/files/upload_session/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
        body: new Uint8Array(0), // Empty for start
      });

      if (!startResponse.ok) {
        const errorText = await startResponse.text();
        console.error('[Upload Chunked] Dropbox start session error:', {
          status: startResponse.status,
          statusText: startResponse.statusText,
          error: errorText,
        });
        throw new Error(`Failed to start upload session: ${startResponse.status} - ${errorText}`);
      }

      const { session_id } = await startResponse.json();
      console.log('[Upload Chunked] Session started successfully:', session_id);
      const uploadId = `${session_id}-${Date.now()}`;

      // Store session info
      uploadSessions.set(uploadId, {
        sessionId: session_id,
        offset: 0,
        folderPath,
        fileName,
      });

      return NextResponse.json({
        success: true,
        uploadId,
        folderPath,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Upload chunked error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process upload';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
