import { Concept } from '../types';
import { seedTags } from './seedTags';
import { seedCourses } from './seedCourses';
import { seedConceptsDsa } from './seedConceptsDsa';
import { seedConceptsSysDesign } from './seedConceptsSysDesign';
import { seedConceptsOsNet } from './seedConceptsOsNet';
import { seedConceptsPatterns } from './seedConceptsPatterns';

export const allSeedConcepts: Concept[] = [
  ...seedConceptsDsa,
  ...seedConceptsSysDesign,
  ...seedConceptsOsNet,
  ...seedConceptsPatterns,
];

export {
  seedTags,
  seedCourses,
  seedConceptsDsa,
  seedConceptsSysDesign,
  seedConceptsOsNet,
  seedConceptsPatterns,
};

export function getSeedConceptBySlug(slug: string): Concept | undefined {
  return allSeedConcepts.find((c) => c.slug === slug);
}

export function getSeedConceptById(id: string): Concept | undefined {
  return allSeedConcepts.find((c) => c.id === id);
}

export function getSeedCourseBySlug(slug: string) {
  return seedCourses.find((c) => c.slug === slug);
}
