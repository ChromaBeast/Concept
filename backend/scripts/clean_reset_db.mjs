import { Client, Databases, Query } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const databaseId = process.env.APPWRITE_DATABASE_ID || '6a97fc7c0037107a5f9a';
const masterKey = process.env.APPWRITE_API_KEY || '';

const client = new Client().setEndpoint(endpoint).setProject(projectId);
if (masterKey) client.setKey(masterKey);
const databases = new Databases(client);

async function resetDatabase() {
  console.log('🧹 [1/2] Purging existing concepts in Appwrite Database...');

  let totalDeleted = 0;
  while (true) {
    const res = await databases.listDocuments(databaseId, 'concepts', [Query.limit(50)]);
    if (res.documents.length === 0) break;

    for (const doc of res.documents) {
      try {
        await databases.deleteDocument(databaseId, 'concepts', doc.$id);
        totalDeleted++;
        console.log(`   - Deleted concept: "${doc.title}" (${doc.$id})`);
      } catch (err) {
        console.warn(`   ⚠️ Delete failed for ${doc.$id}:`, err.message);
      }
    }
  }
  console.log(`✅ Concepts purged: ${totalDeleted} concepts removed.`);

  console.log('\n🔄 [2/2] Resetting all roadmap topics back to "pending"...');
  let totalReset = 0;
  let offset = 0;
  while (true) {
    const res = await databases.listDocuments(databaseId, 'roadmapTopics', [
      Query.limit(50),
      Query.offset(offset),
    ]);
    if (res.documents.length === 0) break;

    for (const doc of res.documents) {
      if (doc.status !== 'pending' || doc.attempts > 0 || doc.lastError) {
        try {
          await databases.updateDocument(databaseId, 'roadmapTopics', doc.$id, {
            status: 'pending',
            attempts: 0,
            lastError: '',
          });
          totalReset++;
        } catch {}
      }
    }
    offset += res.documents.length;
    if (offset >= res.total) break;
  }

  console.log(`✅ Roadmap topics reset: ${totalReset} topics restored to 'pending'.`);
  console.log('✨ Database clean & ready for 1-minute automated generation pipeline!');
}

resetDatabase();
