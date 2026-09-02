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
    .replace(/\b(algorithm|pattern|technique|principles?|architecture|fundamentals?)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function analyzeAndDedupe() {
  console.log('🔍 Fetching all roadmap topics from Appwrite DB...');

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

  console.log(`📊 Total Roadmap Topics in DB: ${allTopics.length}`);

  // Find duplicates / redundancies
  const seenNorm = new Map();
  const duplicates = [];
  const uniqueTopics = [];

  for (const doc of allTopics) {
    const norm = normalizeTitle(doc.topic);
    if (seenNorm.has(norm)) {
      duplicates.push({ doc, original: seenNorm.get(norm) });
    } else {
      seenNorm.set(norm, doc);
      uniqueTopics.push(doc);
    }
  }

  console.log(`🗑️ Redundant / Duplicate Topics identified: ${duplicates.length}`);
  console.log(`✨ Unique Curated Topics: ${uniqueTopics.length}`);

  console.log('\nSample redundancies identified:');
  duplicates.slice(0, 15).forEach(({ doc, original }, i) => {
    console.log(`   ${i + 1}. Duplicate: "${doc.topic}" (${doc.category}) -> Matches Original: "${original.topic}" (${original.category})`);
  });

  return { duplicates, uniqueTopics };
}

analyzeAndDedupe();
