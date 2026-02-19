import { NextResponse } from 'next/server';
import { getDropboxToken } from '@/lib/dropbox-token';

/**
 * API route to get a temporary Dropbox access token for client-side uploads
 * This token is valid for ~4 hours and allows file uploads only
 */
export async function GET() {
  try {
    // Get a valid access token (will auto-refresh if needed)
    const accessToken = await getDropboxToken();

    // Return the token to the client
    // The token will be used for direct uploads to Dropbox from the browser
    return NextResponse.json({
      accessToken,
      expiresIn: 14400, // 4 hours in seconds
    });
  } catch (error) {
    console.error('[Dropbox Token API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get Dropbox token' },
      { status: 500 }
    );
  }
}
