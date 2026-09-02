import { Client, Functions } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const key = 'YOUR_APPWRITE_API_KEY';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);

async function checkVars() {
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
