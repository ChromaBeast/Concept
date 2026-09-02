import { Concept, Course } from './types';

export function mapDocToConcept(d: any): Concept {
  const parsedBody = typeof d.body === 'string' ? JSON.parse(d.body) : d.body || {};
  return {
    id: d.$id,
    slug: d.slug,
    title: d.title,
    oneLiner: d.oneLiner,
    category: d.category,
    tagIds: d.tagIds || [],
    difficulty: d.difficulty,
    body: parsedBody,
    estimatedReadSeconds: d.estimatedReadSeconds || 90,
    status: d.status,
    source: d.source || 'ai_generated',
    aiModel: d.aiModel,
    visualAid: d.visualAid || false,
    heroImageUrl: d.heroImageUrl,
    imagePrompt: d.imagePrompt,
    needsDeepDive: d.needsDeepDive ?? parsedBody.needsDeepDive ?? (parsedBody.deepDive ? true : false),
    deepDive: d.deepDive ?? parsedBody.deepDive ?? null,
    relatedConceptIds: d.relatedConceptIds || [],
    askedByCompanies: d.askedByCompanies || [],
    createdAt: d.$createdAt,
    updatedAt: d.$updatedAt,
    viewCount: d.viewCount || 0,
    bookmarkCount: d.bookmarkCount || 0,
  };
}

export function mapDocToCourse(d: any): Course {
  return {
    id: d.$id,
    slug: d.slug,
    title: d.title,
    description: d.description,
    primaryCategory: d.primaryCategory,
    difficulty: d.difficulty,
    conceptIds: d.conceptIds || [],
    totalReadSeconds: d.totalReadSeconds || 450,
    status: d.status,
    source: d.source || 'ai_curated',
    startedCount: d.startedCount || 0,
    completedCount: d.completedCount || 0,
    createdAt: d.$createdAt || new Date().toISOString(),
    updatedAt: d.$updatedAt || new Date().toISOString(),
  };
}
