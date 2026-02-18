// Test script to verify Dropbox token
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const DROPBOX_ACCESS_TOKEN = envVars.DROPBOX_ACCESS_TOKEN;

console.log('Testing Dropbox integration...\n');

if (!DROPBOX_ACCESS_TOKEN) {
  console.error('❌ DROPBOX_ACCESS_TOKEN is not configured in .env.local');
  process.exit(1);
}

console.log('✅ Token found:', DROPBOX_ACCESS_TOKEN.substring(0, 20) + '...');

// Test 1: Get current account info
async function testAccountInfo() {
  console.log('\n📋 Test 1: Getting account info...');

  const response = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(null),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Failed to get account info:', response.status, error);
    return false;
  }

  const data = await response.json();
  console.log('✅ Account:', data.name.display_name, `(${data.email})`);
  return true;
}

// Test 2: Start upload session
async function testUploadSession() {
  console.log('\n📤 Test 2: Starting upload session...');

  const response = await fetch('https://content.dropboxapi.com/2/files/upload_session/start', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      'Content-Type': 'application/octet-stream',
    },
    body: new Uint8Array(0),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Failed to start upload session:', response.status, error);
    return false;
  }

  const data = await response.json();
  console.log('✅ Upload session started:', data.session_id);
  return true;
}

// Run tests
(async () => {
  try {
    const test1 = await testAccountInfo();
    const test2 = await testUploadSession();

    console.log('\n' + '='.repeat(50));
    if (test1 && test2) {
      console.log('✅ All tests passed! Dropbox integration is working.');
    } else {
      console.log('❌ Some tests failed. Check your token permissions.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error running tests:', error.message);
    process.exit(1);
  }
})();
