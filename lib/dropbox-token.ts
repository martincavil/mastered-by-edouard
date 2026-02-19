/**
 * Dropbox Token Management
 * Handles token refresh for expired access tokens
 */

interface DropboxTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Get a valid Dropbox access token
 * If refresh token is available, it will automatically refresh expired tokens
 */
export async function getDropboxToken(): Promise<string> {
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const staticToken = process.env.DROPBOX_ACCESS_TOKEN;

  // If we have a cached token that's still valid, use it
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  // If we have refresh token credentials, use them to get a new token
  if (refreshToken && appKey && appSecret) {
    console.log('[Dropbox] Refreshing access token...');

    try {
      const response = await fetch('https://api.dropbox.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: appKey,
          client_secret: appSecret,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Dropbox] Token refresh failed:', errorText);
        throw new Error(`Failed to refresh token: ${errorText}`);
      }

      const data: DropboxTokenResponse = await response.json();

      // Cache the new token (expires_in is in seconds)
      cachedAccessToken = data.access_token;
      tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000; // Refresh 5 minutes before expiry

      console.log('[Dropbox] Token refreshed successfully, expires in', data.expires_in, 'seconds');

      return cachedAccessToken;
    } catch (error) {
      console.error('[Dropbox] Error refreshing token:', error);
      // Fall back to static token if refresh fails
      if (staticToken) {
        console.warn('[Dropbox] Falling back to static token');
        return staticToken;
      }
      throw error;
    }
  }

  // Fall back to static token if no refresh token is available
  if (staticToken) {
    console.warn('[Dropbox] Using static access token (no refresh token configured)');
    return staticToken;
  }

  throw new Error('No Dropbox credentials configured. Please set either DROPBOX_REFRESH_TOKEN or DROPBOX_ACCESS_TOKEN');
}
