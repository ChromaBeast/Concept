import { databases, APPWRITE_CONFIG } from './appwrite';
import { Query } from 'appwrite';
import { Concept, Course, Category, Difficulty } from './types';
import { mapDocToConcept, mapDocToCourse } from './dataMapper';

const cache = {
  concepts: [] as Concept[],
  lastFetch: 0,
};

const CACHE_TTL_MS = 15 * 1000; // 15s cache TTL for live updates

export const dataService = {
  async getPaginatedConcepts(options?: {
    category?: Category | 'all';
    difficulty?: Difficulty | 'all';
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Concept[]; total: number; totalPages: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 12;

    let list = await this.getAllConcepts();

    if (options?.category && options.category !== 'all') {
      list = list.filter((c) => c.category === options.category);
    }
    if (options?.difficulty && options.difficulty !== 'all') {
      list = list.filter((c) => c.difficulty === options.difficulty);
    }
    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.oneLiner.toLowerCase().includes(q) ||
          c.tagIds?.some((t) => t.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const items = list.slice(offset, offset + limit);

    return { items, total, totalPages };
  },

  async getConcepts(options?: {
    category?: Category | 'all';
    difficulty?: Difficulty | 'all';
    search?: string;
    limit?: number;
  }): Promise<Concept[]> {
    const res = await this.getPaginatedConcepts({ ...options, page: 1, limit: options?.limit || 100 });
    return res.items;
  },

  async getAllConcepts(): Promise<Concept[]> {
    const now = Date.now();
    if (cache.concepts.length > 0 && now - cache.lastFetch < CACHE_TTL_MS) {
      return cache.concepts;
    }

    try {
      if (typeof window !== 'undefined' && APPWRITE_CONFIG.databaseId) {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.concepts,
          [Query.limit(100), Query.equal('status', ['published'])]
        );

        if (res.documents) {
          const remoteConcepts: Concept[] = res.documents.map(mapDocToConcept);
          cache.concepts = remoteConcepts;
          cache.lastFetch = now;
          return remoteConcepts;
        }
      }
    } catch (err) {
      console.warn('Failed to load published concepts from Appwrite:', err);
    }

    cache.concepts = [];
    return [];
  },

  async getConceptBySlug(slug: string): Promise<Concept | null> {
    try {
      if (typeof window !== 'undefined' && APPWRITE_CONFIG.databaseId) {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.concepts,
          [Query.equal('slug', [slug]), Query.limit(1)]
        );
        if (res.documents && res.documents.length > 0) {
          return mapDocToConcept(res.documents[0]);
        }
      }
    } catch {}

    const all = await this.getAllConcepts();
    return all.find((c) => c.slug === slug) || null;
  },

  async getCourses(options?: { category?: Category | 'all'; limit?: number }): Promise<Course[]> {
    let list: Course[] = [];
    try {
      if (typeof window !== 'undefined' && APPWRITE_CONFIG.databaseId) {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.courses,
          [Query.limit(50), Query.equal('status', ['published'])]
        );
        if (res.documents && res.documents.length > 0) {
          list = res.documents.map(mapDocToCourse);
        }
      }
    } catch {}

    if (options?.category && options.category !== 'all') {
      list = list.filter((c) => c.primaryCategory === options.category);
    }
    if (options?.limit && options.limit > 0) {
      list = list.slice(0, options.limit);
    }
    return list;
  },

  async getDailyConcept(): Promise<Concept | null> {
    const all = await this.getAllConcepts();
    if (all.length === 0) return null;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return all[dayOfYear % all.length] || all[0];
  },

  async getStats() {
    const concepts = await this.getAllConcepts();
    const courses = await this.getCourses();
    return {
      totalConcepts: concepts.length,
      totalCourses: courses.length,
      totalTags: 25,
    };
  },
};
