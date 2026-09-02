import { Client } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const key = process.env.APPWRITE_API_KEY || '';

async function checkVars() {
  if (!key) {
    console.error('Error: APPWRITE_API_KEY environment variable is not set.');
    return;
  }
  try {
    const res = await fetch(`${endpoint}/functions/conceptEngine/variables`, {
      headers: {
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': key,
      },
    });
    const data = await res.json();
    console.log('Function Variables:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkVars();
