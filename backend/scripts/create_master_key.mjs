import fs from 'fs';

const prefs = JSON.parse(fs.readFileSync('C:/Users/sheer/.appwrite/prefs.json', 'utf8'));
const currentKey = prefs.current;
const session = prefs[currentKey];
const token = session.accessToken;
const endpoint = session.endpoint || 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';

console.log('🔑 Attempting to create Full-Access API Key via Project Admin API...');

async function createKey() {
  const allScopes = [
    'users.read',
    'users.write',
    'teams.read',
    'teams.write',
    'databases.read',
    'databases.write',
    'collections.read',
    'collections.write',
    'attributes.read',
    'attributes.write',
    'indexes.read',
    'indexes.write',
    'documents.read',
    'documents.write',
    'files.read',
    'files.write',
    'buckets.read',
    'buckets.write',
    'functions.read',
    'functions.write',
    'execution.read',
    'execution.write',
    'locale.read',
    'avatars.read',
    'health.read',
    'providers.read',
    'providers.write',
    'messages.read',
    'messages.write',
    'topics.read',
    'topics.write',
    'subscribers.read',
    'subscribers.write',
    'targets.read',
    'targets.write',
    'rules.read',
    'rules.write',
    'migrations.read',
    'migrations.write',
  ];

  try {
    const res = await fetch(`${endpoint}/projects/${projectId}/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': 'console',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        keyId: 'unique()',
        name: 'Concept Master Admin Key',
        scopes: allScopes,
      }),
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.secret) {
      console.log('\n🎉 SUCCESS! New Master Key created:');
      console.log(data.secret);
      fs.writeFileSync('backend/scripts/master_key.txt', data.secret);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createKey();
