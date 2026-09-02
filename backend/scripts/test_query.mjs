import { Client, Databases, Query } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const databaseId = process.env.APPWRITE_DATABASE_ID || '6a97fc7c0037107a5f9a';
const key = process.env.APPWRITE_API_KEY || '';

const client = new Client().setEndpoint(endpoint).setProject(projectId);
if (key) client.setKey(key);
const databases = new Databases(client);

async function testQuery() {
  const res = await databases.listDocuments(databaseId, 'roadmapTopics', [
    Query.equal('status', ['pending']),
    Query.limit(3),
  ]);
  console.log('Matching documents count:', res.total);
}

testQuery();
