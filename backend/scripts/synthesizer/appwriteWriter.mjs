import { Client, Databases, Functions, Query, ID } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '6a97fc420033ed1fefd0';
const databaseId = process.env.APPWRITE_DATABASE_ID || '6a97fc7c0037107a5f9a';
const masterKey = process.env.APPWRITE_API_KEY || '';

const client = new Client().setEndpoint(endpoint).setProject(projectId);
if (masterKey) {
  client.setKey(masterKey);
}

const databases = new Databases(client);
const functions = new Functions(client);

export const appwriteWriter = {
  async fetchPendingTopics(limit = 50) {
    try {
      const res = await databases.listDocuments(databaseId, 'roadmapTopics', [
        Query.equal('status', ['pending']),
        Query.orderDesc('priority'),
        Query.limit(limit),
      ]);
      return res.documents;
    } catch (err) {
      console.error('Error fetching pending topics:', err.message);
      return [];
    }
  },

  async claimTopic(id) {
    try {
      await databases.updateDocument(databaseId, 'roadmapTopics', id, {
        status: 'claimed',
        lastAttemptAt: new Date().toISOString(),
      });
    } catch {}
  },

  async saveConcept(doc) {
    return await databases.createDocument(databaseId, 'concepts', ID.unique(), {
      slug: doc.slug,
      title: doc.title,
      oneLiner: doc.oneLiner,
      category: doc.category,
      difficulty: doc.difficulty,
      body: JSON.stringify(doc.body),
      estimatedReadSeconds: doc.estimatedReadSeconds || 90,
      status: doc.status || 'published',
      source: 'ai_generated',
      aiModel: doc.aiModel || 'gemini-3.7-flash',
      promptVersion: 'v1.0',
      tagIds: doc.tagIds || [],
      visualAid: doc.visualAid || false,
      imagePrompt: doc.imagePrompt || '',
      needsReviewReasons: doc.needsReviewReasons || [],
      viewCount: 0,
      bookmarkCount: 0,
    });
  },

  async completeTopic(id) {
    try {
      await databases.updateDocument(databaseId, 'roadmapTopics', id, {
        status: 'done',
      });
    } catch {}
  },

  async failTopic(id, error) {
    try {
      await databases.updateDocument(databaseId, 'roadmapTopics', id, {
        status: 'failed',
        lastError: String(error).slice(0, 1000),
      });
    } catch {}
  },

  async triggerCloudBatch(batchSize = 5) {
    const res = await functions.createExecution(
      'conceptEngine',
      JSON.stringify({ action: 'pipeline', batch: batchSize }),
      false,
      `/?action=pipeline`,
      'POST'
    );
    try {
      return JSON.parse(res.responseBody || '{}');
    } catch {
      return { raw: res.responseBody };
    }
  },
};
