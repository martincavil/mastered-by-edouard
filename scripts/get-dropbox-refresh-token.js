#!/usr/bin/env node

/**
 * Script to help obtain a Dropbox refresh token
 *
 * Usage:
 *   node scripts/get-dropbox-refresh-token.js <authorization_code> <app_key> <app_secret>
 *
 * Steps:
 * 1. Get your App Key and App Secret from https://www.dropbox.com/developers/apps
 * 2. Visit this URL (replace YOUR_APP_KEY):
 *    https://www.dropbox.com/oauth2/authorize?client_id=YOUR_APP_KEY&token_access_type=offline&response_type=code
 * 3. Authorize the app and copy the authorization code
 * 4. Run this script with the authorization code, app key, and app secret
 */

const authCode = process.argv[2];
const appKey = process.argv[3];
const appSecret = process.argv[4];

if (!authCode || !appKey || !appSecret) {
  console.error('❌ Missing required arguments\n');
  console.log('Usage:');
  console.log('  node scripts/get-dropbox-refresh-token.js <authorization_code> <app_key> <app_secret>\n');
  console.log('Steps to get authorization code:');
  console.log('  1. Get your App Key from https://www.dropbox.com/developers/apps');
  console.log('  2. Visit: https://www.dropbox.com/oauth2/authorize?client_id=YOUR_APP_KEY&token_access_type=offline&response_type=code');
  console.log('  3. Authorize the app and copy the code\n');
  process.exit(1);
}

console.log('🔄 Exchanging authorization code for refresh token...\n');

const params = new URLSearchParams({
  code: authCode,
  grant_type: 'authorization_code',
  client_id: appKey,
  client_secret: appSecret,
});

fetch('https://api.dropbox.com/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: params,
})
  .then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log('✅ Success! Your Dropbox credentials:\n');
    console.log('Add these to your .env.local file:\n');
    console.log(`DROPBOX_APP_KEY=${appKey}`);
    console.log(`DROPBOX_APP_SECRET=${appSecret}`);
    console.log(`DROPBOX_REFRESH_TOKEN=${data.refresh_token}`);
    console.log(`\n📝 Also received (for reference):`);
    console.log(`  Access Token: ${data.access_token.substring(0, 20)}...`);
    console.log(`  Expires in: ${data.expires_in} seconds`);
    console.log(`\n✨ Your refresh token will never expire and can be used to generate new access tokens automatically!`);
  })
  .catch((error) => {
    console.error('❌ Error obtaining refresh token:', error.message);
    console.log('\nTroubleshooting:');
    console.log('  - Make sure the authorization code is correct (they expire quickly!)');
    console.log('  - Verify your App Key and App Secret');
    console.log('  - Check that your Dropbox app has the correct permissions');
    process.exit(1);
  });
