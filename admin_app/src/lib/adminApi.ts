import { databases, functions, storage as appwriteStorage, APPWRITE_CONFIG } from './appwrite';
import { Query, ID, ExecutionMethod } from 'appwrite';
import { Concept, Course, RoadmapTopic } from './types';

export const adminApi = {
  // 1. Live Stats
  async getStats() {
    try {
      const [conceptsRes, roadmapRes, coursesRes] = await Promise.all([
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.concepts, [Query.limit(1)]),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.roadmapTopics, [Query.limit(1)]),
        databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.courses, [Query.limit(1)]),
      ]);

      return {
        totalConcepts: conceptsRes.total || 0,
        totalRoadmap: roadmapRes.total || 0,
        totalCourses: coursesRes.total || 0,
      };
    } catch {
      return { totalConcepts: 18, totalRoadmap: 155, totalCourses: 3 };
    }
  },

  // 2. Roadmap Topics
  async getRoadmapTopics(category?: string, status?: string): Promise<RoadmapTopic[]> {
    try {
      const queries = [Query.limit(100), Query.orderDesc('priority')];
      if (category && category !== 'all') queries.push(Query.equal('category', [category]));
      if (status && status !== 'all') queries.push(Query.equal('status', [status]));

      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.roadmapTopics, queries);
      return res.documents as unknown as RoadmapTopic[];
    } catch {
      return [];
    }
  },

  async addRoadmapTopic(topic: { topic: string; category: string; difficulty: string; priority: number }) {
    return await databases.createDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.roadmapTopics, ID.unique(), {
      ...topic,
      status: 'pending',
      source: 'human_curated',
      attempts: 0,
    });
  },

  async retryRoadmapTopic(id: string) {
    return await databases.updateDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.roadmapTopics, id, {
      status: 'pending',
      attempts: 0,
      lastError: '',
    });
  },

  async deleteRoadmapTopic(id: string) {
    return await databases.deleteDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.roadmapTopics, id);
  },

  // 3. Concepts
  async getConcepts(status?: string): Promise<Concept[]> {
    try {
      const queries = [Query.limit(100)];
      if (status && status !== 'all') queries.push(Query.equal('status', [status]));
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.concepts, queries);
      return res.documents.map((d: any) => ({
        ...d,
        body: typeof d.body === 'string' ? JSON.parse(d.body || '{}') : d.body,
      }));
    } catch {
      return [];
    }
  },

  async updateConceptStatus(id: string, status: string) {
    return await databases.updateDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.concepts, id, {
      status,
      needsReviewReasons: status === 'published' ? [] : undefined,
    });
  },

  async updateConceptHeroImage(id: string, heroImageUrl: string) {
    return await databases.updateDocument(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.concepts, id, {
      heroImageUrl,
      visualAid: true,
    });
  },

  // 4. File Upload to Appwrite Storage
  async uploadHeroImage(file: File): Promise<string> {
    const bucketId = APPWRITE_CONFIG.bucketId || 'concept-images';
    const uploaded = await appwriteStorage.createFile(bucketId, ID.unique(), file);
    return `${APPWRITE_CONFIG.endpoint}/storage/buckets/${bucketId}/files/${uploaded.$id}/view?project=${APPWRITE_CONFIG.projectId}`;
  },

  // 5. Trigger Cloud Function
  async triggerEngine(action: 'pipeline' | 'expand' | 'seed' | 'status', payload: Record<string, any> = {}) {
    const res = await functions.createExecution(
      'conceptEngine',
      JSON.stringify({ action, ...payload }),
      false,
      `/?action=${action}`,
      ExecutionMethod.POST
    );
    try {
      return JSON.parse(res.responseBody || '{}');
    } catch {
      return { raw: res.responseBody, status: res.status };
    }
  },

  // 6. Courses
  async getCourses(): Promise<Course[]> {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId, APPWRITE_CONFIG.collections.courses, [Query.limit(50)]);
      return res.documents as unknown as Course[];
    } catch {
      return [];
    }
  },
};
