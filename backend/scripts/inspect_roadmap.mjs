import { Client, Databases, Query } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const databaseId = '6a97fc7c0037107a5f9a';
const key = 'YOUR_APPWRITE_API_KEY';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);
const databases = new Databases(client);

async function inspectRoadmap() {
  try {
    const res = await databases.listDocuments(databaseId, 'roadmapTopics', [
      Query.limit(50),
    ]);
    console.log(`📊 Found ${res.total} roadmapTopics in Appwrite DB:`);
    res.documents.forEach((d, i) => {
      console.log(`  [${i + 1}] ID: ${d.$id} | Topic: "${d.topic}" | Category: ${d.category} | Status: ${d.status} | Priority: ${d.priority}`);
    });
  } catch (err) {
    console.error('Error listing roadmapTopics:', err.message);
  }
}

inspectRoadmap();
