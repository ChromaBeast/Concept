import { Client, Databases, Query } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const databaseId = '6a97fc7c0037107a5f9a';
const key = 'YOUR_APPWRITE_API_KEY';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);
const databases = new Databases(client);

async function testQuery() {
  console.log('Testing Appwrite Query string output:');
  console.log('Query.equal("status", "pending"):', Query.equal('status', 'pending'));
  console.log('Query.equal("status", ["pending"]):', Query.equal('status', ['pending']));

  const res = await databases.listDocuments(databaseId, 'roadmapTopics', [
    Query.equal('status', ['pending']),
    Query.limit(3),
  ]);
  console.log('Matching documents count:', res.total);
}

testQuery();
