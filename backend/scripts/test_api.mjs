const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const key = process.env.APPWRITE_API_KEY || '';

async function test() {
  if (!key) {
    console.error('Error: APPWRITE_API_KEY environment variable is not set.');
    return;
  }
  const res = await fetch(`${endpoint}/account`, {
    headers: { 'X-Appwrite-Project': projectId, 'X-Appwrite-Key': key }
  });
  console.log('Status:', res.status);
}

test();
