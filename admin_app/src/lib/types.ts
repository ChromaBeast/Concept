export type Category =
  | 'dsa'
  | 'system_design'
  | 'databases'
  | 'operating_systems'
  | 'networking'
  | 'oop_design_patterns'
  | 'frontend'
  | 'backend'
  | 'devops_infra'
  | 'security'
  | 'testing_qa'
  | 'version_control'
  | 'cloud'
  | 'ml_basics'
  | 'behavioral_interview'
  | 'language_specific';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ContentStatus = 'draft' | 'needs_review' | 'published' | 'flagged';

export interface QuickCheck {
  question: string;
  answer: string;
}

export interface ConceptBody {
  definition: string;
  whyItMatters: string;
  example: string;
  commonPitfall: string;
  interviewAngle: string;
  quickChecks: QuickCheck[];
}

export interface Concept {
  $id: string;
  slug: string;
  title: string;
  oneLiner: string;
  category: Category;
  difficulty: Difficulty;
  body: ConceptBody | string;
  estimatedReadSeconds: number;
  status: ContentStatus;
  source: string;
  aiModel?: string;
  promptVersion?: string;
  tagIds?: string[];
  relatedConceptIds?: string[];
  askedByCompanies?: string[];
  viewCount?: number;
  bookmarkCount?: number;
  visualAid?: boolean;
  heroImageUrl?: string;
  imagePrompt?: string;
  needsReviewReasons?: string[];
  $createdAt?: string;
  $updatedAt?: string;
}

export interface RoadmapTopic {
  $id: string;
  topic: string;
  category: string;
  difficulty: string;
  priority: number;
  status: 'pending' | 'claimed' | 'done' | 'failed';
  source?: string;
  attempts?: number;
  lastError?: string;
  $createdAt?: string;
}

export interface Course {
  $id: string;
  slug: string;
  title: string;
  description: string;
  primaryCategory: Category;
  difficulty: Difficulty;
  conceptIds: string[];
  totalReadSeconds: number;
  coverImageUrl?: string;
  status: string;
  startedCount?: number;
  completedCount?: number;
}
