import { Client, Databases, Storage, Users, Functions } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const key = 'YOUR_APPWRITE_API_KEY';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);

async function testAll() {
  console.log('Testing Appwrite services...');

  // Users
  try {
    const users = new Users(client);
    const u = await users.list();
    console.log('✅ Users API: Operational (Total:', u.total, ')');
  } catch (e) {
    console.log('❌ Users error:', e.message);
  }

  // Storage
  try {
    const storage = new Storage(client);
    const b = await storage.listBuckets();
    console.log('✅ Storage API: Operational (Total:', b.total, 'Buckets)');
  } catch (e) {
    console.log('❌ Storage error:', e.message);
  }

  // Functions
  try {
    const functions = new Functions(client);
    const f = await functions.list();
    console.log('✅ Functions API: Operational (Total:', f.total, 'Functions)');
  } catch (e) {
    console.log('❌ Functions error:', e.message);
  }

  // Databases
  try {
    const db = new Databases(client);
    const d = await db.list();
    console.log('✅ Databases API: Operational (Total:', d.total, 'Databases:', d.databases.map(x => `${x.name} [ID: ${x.$id}]`), ')');
  } catch (e) {
    console.log('❌ Databases error:', e.message);
  }
}

testAll();
