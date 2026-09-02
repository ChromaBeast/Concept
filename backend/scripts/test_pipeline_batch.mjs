import { Client, Functions } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const key = process.env.APPWRITE_API_KEY || '';
const functionId = 'conceptEngine';

const client = new Client().setEndpoint(endpoint).setProject(projectId);
if (key) client.setKey(key);
const functions = new Functions(client);

async function runBatch() {
  const res = await functions.createExecution(
    functionId,
    JSON.stringify({ action: 'pipeline', batch: 3 }),
    false,
    '/?action=pipeline',
    'POST'
  );
  console.log(`Status: ${res.status}`);
}

runBatch();
