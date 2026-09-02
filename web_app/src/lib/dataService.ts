import { databases, APPWRITE_CONFIG } from './appwrite';
import { Query } from 'appwrite';
import { Concept, Course, Category, Difficulty } from './types';
import { allSeedConcepts, seedCourses, seedTags } from './seed';
import { mapDocToConcept, mapDocToCourse } from './dataMapper';

const cache = {
  concepts: [] as Concept[],
  lastFetch: 0,
};

const CACHE_TTL_MS = 60 * 1000;

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
    const totalPages = Math.ceil(total / limit);
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

        if (res.documents && res.documents.length > 0) {
          const remoteConcepts: Concept[] = res.documents.map(mapDocToConcept);
          const existingSlugs = new Set(remoteConcepts.map((c) => c.slug));
          const merged = [...remoteConcepts, ...allSeedConcepts.filter((s) => !existingSlugs.has(s.slug))];
          cache.concepts = merged;
          cache.lastFetch = now;
          return merged;
        }
      }
    } catch {}

    cache.concepts = allSeedConcepts;
    return allSeedConcepts;
  },

  async getConceptBySlug(slug: string): Promise<Concept | null> {
    const all = await this.getAllConcepts();
    const found = all.find((c) => c.slug === slug);
    if (found) return found;

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

    return null;
  },

  async getCourses(options?: { category?: Category | 'all'; limit?: number }): Promise<Course[]> {
    let list = seedCourses;
    try {
      if (typeof window !== 'undefined' && APPWRITE_CONFIG.databaseId) {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.courses,
          [Query.limit(50), Query.equal('status', ['published'])]
        );
        if (res.documents && res.documents.length > 0) {
          const remote: Course[] = res.documents.map(mapDocToCourse);
          const existing = new Set(remote.map((c) => c.slug));
          list = [...remote, ...seedCourses.filter((s) => !existing.has(s.slug))];
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

  async getDailyConcept(): Promise<Concept> {
    const all = await this.getAllConcepts();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return all[dayOfYear % all.length] || all[0];
  },

  async getStats() {
    const concepts = await this.getAllConcepts();
    const courses = await this.getCourses();
    return {
      totalConcepts: concepts.length,
      totalCourses: courses.length,
      totalTags: seedTags.length,
    };
  },
};
