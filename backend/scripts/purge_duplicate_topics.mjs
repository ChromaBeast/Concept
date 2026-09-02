import { Client, Databases, Query } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const databaseId = process.env.APPWRITE_DATABASE_ID || '6a97fc7c0037107a5f9a';
const masterKey = process.env.APPWRITE_API_KEY || '';

const client = new Client().setEndpoint(endpoint).setProject(projectId);
if (masterKey) client.setKey(masterKey);
const databases = new Databases(client);

function normalizeTitle(title = '') {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function dedupeRoadmap() {
  console.log('🧹 Purging redundant roadmap topics from Appwrite DB...');

  const allTopics = [];
  let offset = 0;
  while (true) {
    const res = await databases.listDocuments(databaseId, 'roadmapTopics', [
      Query.limit(100),
      Query.offset(offset),
    ]);
    allTopics.push(...res.documents);
    offset += res.documents.length;
    if (offset >= res.total || res.documents.length === 0) break;
  }

  console.log(`📊 Initial Topics count: ${allTopics.length}`);

  const seen = new Set();
  let deletedCount = 0;
  let preservedCount = 0;

  for (const doc of allTopics) {
    const key = `${doc.category}_${normalizeTitle(doc.topic)}`;
    if (seen.has(key)) {
      try {
        await databases.deleteDocument(databaseId, 'roadmapTopics', doc.$id);
        deletedCount++;
        if (deletedCount % 25 === 0) {
          console.log(`   - Deleted ${deletedCount} duplicates so far...`);
        }
      } catch (err) {
        console.warn(`   ⚠️ Failed to delete ${doc.$id}:`, err.message);
      }
    } else {
      seen.add(key);
      preservedCount++;
    }
  }

  console.log(`\n✨ Deduplication Complete!`);
  console.log(`   • Removed Duplicates: ${deletedCount}`);
  console.log(`   • Pristine Unique Topics Remaining: ${preservedCount}`);
}

dedupeRoadmap();
