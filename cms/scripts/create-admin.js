const readline = require('readline');

const STRAPI_URL = process.env.STRAPI_URL || 'https://mastered-by-edouard-production.up.railway.app';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('🔐 Create New Admin User\n');

    const firstname = await question('First Name: ');
    const lastname = await question('Last Name: ');
    const email = await question('Email: ');
    const password = await question('Password: ');

    console.log('\n🔄 Creating admin user...');

    const response = await fetch(`${STRAPI_URL}/admin/register-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create admin');
    }

    const data = await response.json();
    console.log('✅ Admin user created successfully!');
    console.log(`\nYou can now login at: ${STRAPI_URL}/admin`);
    console.log(`Email: ${email}`);

    rl.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdmin();
