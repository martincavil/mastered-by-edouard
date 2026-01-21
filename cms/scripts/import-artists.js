const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STRAPI_URL = process.env.STRAPI_URL || 'https://mastered-by-edouard-production.up.railway.app';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function login(email, password) {
  try {
    const response = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }

    const data = await response.json();
    return data.data.token;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

async function importArtists() {
  try {
    console.log('🔐 Admin Login Required\n');

    const email = await question('Admin Email: ');
    const password = await question('Admin Password: ');

    console.log('\n🔄 Logging in...');
    const token = await login(email, password);
    console.log('✅ Logged in successfully\n');

    // Read exported artists
    const artistsPath = path.join(__dirname, 'artists-export.json');
    const artists = JSON.parse(fs.readFileSync(artistsPath, 'utf8'));

    console.log(`📦 Found ${artists.length} artists to import\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const artist of artists) {
      try {
        const response = await fetch(`${STRAPI_URL}/api/artists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              name: artist.name,
              picture: artist.picture,
              link: artist.link,
            },
          }),
        });

        if (response.ok) {
          console.log(`✅ Imported: ${artist.name}`);
          successCount++;
        } else {
          const error = await response.json();
          console.error(`❌ Failed to import ${artist.name}:`, error.error?.message || 'Unknown error');
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error importing ${artist.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📦 Total: ${artists.length}`);

    rl.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

importArtists();
