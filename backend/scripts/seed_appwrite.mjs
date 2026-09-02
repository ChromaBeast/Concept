import { Client, Databases, ID } from 'node-appwrite';
import { allSeedConcepts, seedCourses, seedTags } from '../../web_app/src/lib/seed/index.js';

const endpoint = 'https://sgp.cloud.appwrite.io/v1';
const projectId = '6a97fc420033ed1fefd0';
const databaseId = '6a97fc7c0037107a5f9a';
const key = 'YOUR_APPWRITE_API_KEY';

console.log('🌱 Starting Appwrite Database Seeder with Master Admin Key...\n');

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(key);
const databases = new Databases(client);

async function seed() {
  // 1. Seed Tags
  console.log(`📌 Seeding ${seedTags.length} Tags...`);
  for (const tag of seedTags) {
    try {
      await databases.createDocument(databaseId, 'tags', tag.id, {
        name: tag.name,
        slug: tag.slug,
        category: tag.category,
        usageCount: tag.usageCount || 0,
      });
      console.log(`   + Tag: ${tag.name}`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`   • Tag "${tag.name}" already exists.`);
      } else {
        console.log(`   ⚠️ Tag "${tag.name}" error: ${err.message}`);
      }
    }
  }

  // 2. Seed Courses
  console.log(`\n📚 Seeding ${seedCourses.length} Courses...`);
  for (const crs of seedCourses) {
    try {
      await databases.createDocument(databaseId, 'courses', crs.id, {
        slug: crs.slug,
        title: crs.title,
        description: crs.description,
        primaryCategory: crs.primaryCategory,
        difficulty: crs.difficulty,
        conceptIds: crs.conceptIds,
        totalReadSeconds: crs.totalReadSeconds,
        coverImageUrl: crs.coverImageUrl || '',
        status: crs.status,
        source: crs.source,
        startedCount: crs.startedCount || 0,
        completedCount: crs.completedCount || 0,
      });
      console.log(`   + Course: ${crs.title}`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`   • Course "${crs.title}" already exists.`);
      } else {
        console.log(`   ⚠️ Course "${crs.title}" error: ${err.message}`);
      }
    }
  }

  // 3. Seed Concepts
  console.log(`\n💡 Seeding ${allSeedConcepts.length} Concepts...`);
  for (const c of allSeedConcepts) {
    try {
      await databases.createDocument(databaseId, 'concepts', c.id, {
        slug: c.slug,
        title: c.title,
        oneLiner: c.oneLiner,
        category: c.category,
        difficulty: c.difficulty,
        body: JSON.stringify(c.body),
        estimatedReadSeconds: c.estimatedReadSeconds,
        status: c.status,
        source: c.source,
        aiModel: c.aiModel || 'gemini-2.5-flash',
        promptVersion: c.promptVersion || 'v1.0',
        tagIds: c.tagIds || [],
        relatedConceptIds: c.relatedConceptIds || [],
        askedByCompanies: c.askedByCompanies || [],
        viewCount: c.viewCount || 0,
        bookmarkCount: c.bookmarkCount || 0,
        visualAid: c.visualAid || false,
        heroImageUrl: c.heroImageUrl || '',
        imagePrompt: c.imagePrompt || '',
        needsReviewReasons: c.needsReviewReasons || [],
      });
      console.log(`   + Concept: ${c.title}`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`   • Concept "${c.title}" already exists.`);
      } else {
        console.log(`   ⚠️ Concept "${c.title}" error: ${err.message}`);
      }
    }
  }

  console.log('\n✨ Database Seeding Complete!');
}

seed();
