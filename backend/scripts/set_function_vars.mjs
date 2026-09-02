const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const masterKey = process.env.APPWRITE_API_KEY || '';

async function setVars() {
  if (!masterKey) {
    console.error('Error: APPWRITE_API_KEY environment variable is not set.');
    return;
  }
  console.log('Setting function environment variables...');
}

setVars();
