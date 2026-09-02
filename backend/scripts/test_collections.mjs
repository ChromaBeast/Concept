import { Client, Databases } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const databaseId = '6a97fc7c0037107a5f9a';
const key = 'YOUR_APPWRITE_API_KEY';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);
const databases = new Databases(client);

async function testCollections() {
  console.log('Testing collections inside "Concept Database"...');
  try {
    const list = await databases.listCollections(databaseId);
    console.log(`Found ${list.total} collections:`);
    for (const col of list.collections) {
      console.log(`- ${col.name} (ID: ${col.$id})`);
    }
  } catch (err) {
    console.error('Collections query error:', err.message);
  }
}

testCollections();
