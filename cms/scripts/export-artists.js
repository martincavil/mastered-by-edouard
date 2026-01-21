const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Path to SQLite database
const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');

try {
  const db = new Database(dbPath, { readonly: true });

  // Query artists from SQLite
  const artists = db.prepare(`
    SELECT
      id,
      name,
      picture,
      link,
      created_at,
      updated_at,
      published_at
    FROM artists
    WHERE published_at IS NOT NULL
    ORDER BY name ASC
  `).all();

  console.log(`✅ Found ${artists.length} artists in local database`);

  // Export to JSON
  const outputPath = path.join(__dirname, 'artists-export.json');
  fs.writeFileSync(outputPath, JSON.stringify(artists, null, 2));

  console.log(`✅ Exported to: ${outputPath}`);
  console.log('\nArtists:');
  artists.forEach((artist, index) => {
    console.log(`${index + 1}. ${artist.name}`);
  });

  db.close();
} catch (error) {
  console.error('❌ Error exporting artists:', error.message);
  process.exit(1);
}
