import { Client, Functions } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const key = 'YOUR_APPWRITE_API_KEY';
const functionId = 'conceptEngine';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);
const functions = new Functions(client);

async function trigger() {
  console.log('⚡ Executing Cloud Function "conceptEngine" with Master Admin Key...\n');

  // 1. Status Check
  try {
    console.log('1. Status Check:');
    const res = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'status' }),
      false,
      '/?action=status',
      'GET'
    );
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${res.responseBody}\n`);
  } catch (err) {
    console.error(`   ⚠️ Status Error: ${err.message}\n`);
  }

  // 2. Seed Roadmap Topics
  try {
    console.log('2. Seed Roadmap Topics:');
    const res = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'seed' }),
      false,
      '/?action=seed',
      'POST'
    );
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${res.responseBody}\n`);
  } catch (err) {
    console.error(`   ⚠️ Seed Error: ${err.message}\n`);
  }

  // 3. Expand Category Roadmap (databases)
  try {
    console.log('3. Expand Category Roadmap (databases):');
    const res = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'expand', category: 'databases' }),
      false,
      '/?action=expand&category=databases',
      'POST'
    );
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${res.responseBody}\n`);
  } catch (err) {
    console.error(`   ⚠️ Expand Error: ${err.message}\n`);
  }
}

trigger();
