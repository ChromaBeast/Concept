import { Client, Functions } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const key = 'YOUR_APPWRITE_API_KEY';
const functionId = 'conceptEngine';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);
const functions = new Functions(client);

async function runBatch() {
  console.log('⚡ Executing Cloud Pipeline Batch (batch=3) with Gemini 3.7 / 3.6 Flash...\n');

  try {
    const res = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'pipeline', batch: 3 }),
      false,
      '/?action=pipeline',
      'POST'
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${res.responseBody}`);
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

runBatch();
