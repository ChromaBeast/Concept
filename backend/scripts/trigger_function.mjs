import { Client, Functions } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const key = 'YOUR_APPWRITE_API_KEY';
const functionId = 'conceptEngine';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);
const functions = new Functions(client);

async function trigger() {
  console.log('⚡ Executing Cloud Function "conceptEngine" Actions...\n');

  // 1. Trigger Status
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

  // 2. Trigger Seed
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

  // 3. Trigger Expand
  try {
    console.log('3. Expand Category Roadmap (system_design):');
    const res = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'expand', category: 'system_design' }),
      false,
      '/?action=expand&category=system_design',
      'POST'
    );
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${res.responseBody}\n`);
  } catch (err) {
    console.error(`   ⚠️ Expand Error: ${err.message}\n`);
  }

  // 4. Trigger Pipeline
  try {
    console.log('4. Run Content Pipeline (batch=3):');
    const res = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'pipeline', batch: 3 }),
      false,
      '/?action=pipeline&batch=3',
      'POST'
    );
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${res.responseBody}\n`);
  } catch (err) {
    console.error(`   ⚠️ Pipeline Error: ${err.message}\n`);
  }
}

trigger();
