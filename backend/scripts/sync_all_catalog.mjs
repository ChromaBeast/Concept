import fs from 'fs';
import path from 'path';
import { Client, Databases, Query, ID } from 'node-appwrite';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const databaseId = '6a97fc7c0037107a5f9a';
const masterKey = 'YOUR_APPWRITE_API_KEY';

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(masterKey);
const databases = new Databases(client);

const DATA_FILES = [
  'backend/data/concepts_dsa.json',
  'backend/data/concepts_system_design.json',
  'backend/data/concepts_databases.json',
  'backend/data/concepts_os_networking.json',
  'backend/data/concepts_devops_patterns.json',
  'backend/data/concepts_frontend_security.json',
];

async function syncAllCatalog() {
  console.log('🚀 Loading and Synchronizing All Curated Concepts into Appwrite Cloud...');

  const allConcepts = [];
  for (const file of DATA_FILES) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      allConcepts.push(...items);
    }
  }

  console.log(`📋 Found ${allConcepts.length} high-density concepts across all domains.`);

  // 1. Fetch existing concept slugs from Appwrite
  const existingRes = await databases.listDocuments(databaseId, 'concepts', [Query.limit(100)]);
  const existingSlugs = new Set(existingRes.documents.map((d) => d.slug));
  console.log(`🔍 Existing concepts in Appwrite Cloud DB: ${existingSlugs.size}`);

  let insertedCount = 0;
  for (const c of allConcepts) {
    if (existingSlugs.has(c.slug)) {
      continue;
    }

    try {
      await databases.createDocument(databaseId, 'concepts', ID.unique(), {
        slug: c.slug,
        title: c.title,
        oneLiner: c.oneLiner,
        category: c.category,
        difficulty: c.difficulty,
        body: JSON.stringify(c.body),
        estimatedReadSeconds: c.estimatedReadSeconds || 85,
        status: 'published',
        source: 'human_authored',
        aiModel: 'gemini-3.7-flash',
        promptVersion: 'v1.0',
        tagIds: c.tagIds || [],
        visualAid: Boolean(c.visualAid),
        imagePrompt: c.imagePrompt || '',
        needsReviewReasons: [],
        viewCount: 0,
        bookmarkCount: 0,
      });

      console.log(`   + Published to DB: "${c.title}" (${c.category})`);
      insertedCount++;
    } catch (err) {
      console.warn(`   ⚠️ Insert error for ${c.title}:`, err.message);
    }
  }

  // 2. Mark matching roadmap topics as done
  console.log('\n🔄 Updating matching roadmap topics in database...');
  for (const c of allConcepts) {
    try {
      const res = await databases.listDocuments(databaseId, 'roadmapTopics', [
        Query.equal('topic', [c.title]),
        Query.limit(1),
      ]);
      if (res.documents.length > 0) {
        const topicDoc = res.documents[0];
        if (topicDoc.status !== 'done') {
          await databases.updateDocument(databaseId, 'roadmapTopics', topicDoc.$id, {
            status: 'done',
          });
          console.log(`   • Roadmap topic marked DONE: "${c.title}"`);
        }
      }
    } catch {}
  }

  console.log(`\n✨ Successfully Synchronized! Added ${insertedCount} new concepts to Appwrite Cloud DB.`);
}

syncAllCatalog();
