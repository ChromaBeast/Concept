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

export type ContentSource =
  | 'ai_generated'
  | 'ai_generated_reviewed'
  | 'human_authored'
  | 'ai_curated'
  | 'human_curated';

export interface QuickCheck {
  question: string;
  answer: string;
}

export interface DeepDiveSection {
  heading: string;
  content: string;
  codeSnippet?: string;
}

export interface DeepDiveContent {
  title?: string;
  estimatedReadSeconds?: number;
  sections: DeepDiveSection[];
}

export interface ConceptBody {
  definition: string;
  whyItMatters: string;
  example: string;
  commonPitfall?: string;
  interviewAngle?: string;
  quickChecks: QuickCheck[];
  needsDeepDive?: boolean;
  deepDive?: DeepDiveContent;
}

export interface Concept {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  category: Category;
  tagIds: string[];
  difficulty: Difficulty;
  body: ConceptBody;
  estimatedReadSeconds: number;
  status: ContentStatus;
  source: ContentSource;
  aiModel?: string;
  promptVersion?: string;
  relatedConceptIds: string[];
  askedByCompanies?: string[];
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  bookmarkCount?: number;
  visualAid?: boolean;
  heroImageUrl?: string | null;
  imagePrompt?: string;
  needsDeepDive?: boolean;
  deepDive?: DeepDiveContent;
  needsReviewReasons?: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  primaryCategory: Category;
  difficulty: Difficulty;
  conceptIds: string[];
  totalReadSeconds: number;
  coverImageUrl?: string | null;
  status: ContentStatus;
  source: ContentSource;
  startedCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
  category: Category;
}

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  streakDays: number;
  lastActiveDate: string;
  learnedConceptIds: string[];
  bookmarkedConceptIds: string[];
  activeCourseIds: string[];
}

export interface CourseProgress {
  courseId: string;
  totalConcepts: number;
  completedConcepts: number;
  percentage: number;
  isCompleted: boolean;
}
