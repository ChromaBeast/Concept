const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const masterKey = 'YOUR_APPWRITE_API_KEY';

const vars = [
  { key: 'APPWRITE_API_KEY', value: masterKey },
  { key: 'APPWRITE_DATABASE_ID', value: '6a97fc7c0037107a5f9a' },
  { key: 'APPWRITE_ENDPOINT', value: 'https://sgp.cloud.appwrite.io/v1' },
  { key: 'APPWRITE_PROJECT_ID', value: projectId },
  { key: 'GEMINI_MODEL', value: 'gemini-3.7-flash' },
  { key: 'GEMINI_VALIDATOR_MODEL', value: 'gemini-3.5-flash-lite' },
];

async function setVars() {
  console.log('🔧 Setting function environment variables...\n');

  for (const v of vars) {
    try {
      const res = await fetch(`${endpoint}/functions/conceptEngine/variables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': masterKey,
        },
        body: JSON.stringify({
          variableId: 'unique()',
          key: v.key,
          value: v.value,
        }),
      });
      console.log(`   + ${v.key}: Status ${res.status}`);
    } catch (err) {
      console.error(`   ⚠️ Error:`, err.message);
    }
  }

  console.log('\n✨ Function Variables Successfully Created!');
}

setVars();
