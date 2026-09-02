import { Category, Difficulty } from './types';

export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; bgSoft: string; borderSoft: string }
> = {
  dsa: {
    label: 'Data Structures & Algorithms',
    color: '#58A6FF',
    bgSoft: 'rgba(88, 166, 255, 0.12)',
    borderSoft: 'rgba(88, 166, 255, 0.3)',
  },
  system_design: {
    label: 'System Design',
    color: '#BC8CFF',
    bgSoft: 'rgba(188, 140, 255, 0.12)',
    borderSoft: 'rgba(188, 140, 255, 0.3)',
  },
  databases: {
    label: 'Databases',
    color: '#39C5CF',
    bgSoft: 'rgba(57, 197, 207, 0.12)',
    borderSoft: 'rgba(57, 197, 207, 0.3)',
  },
  operating_systems: {
    label: 'Operating Systems',
    color: '#FF9B4E',
    bgSoft: 'rgba(255, 155, 78, 0.12)',
    borderSoft: 'rgba(255, 155, 78, 0.3)',
  },
  networking: {
    label: 'Networking',
    color: '#3FB950',
    bgSoft: 'rgba(63, 185, 80, 0.12)',
    borderSoft: 'rgba(63, 185, 80, 0.3)',
  },
  oop_design_patterns: {
    label: 'OOP & Design Patterns',
    color: '#F778BA',
    bgSoft: 'rgba(247, 120, 186, 0.12)',
    borderSoft: 'rgba(247, 120, 186, 0.3)',
  },
  frontend: {
    label: 'Frontend Development',
    color: '#E3B341',
    bgSoft: 'rgba(227, 179, 65, 0.12)',
    borderSoft: 'rgba(227, 179, 65, 0.3)',
  },
  backend: {
    label: 'Backend Development',
    color: '#79C0FF',
    bgSoft: 'rgba(121, 192, 255, 0.12)',
    borderSoft: 'rgba(121, 192, 255, 0.3)',
  },
  devops_infra: {
    label: 'DevOps & Infrastructure',
    color: '#56D364',
    bgSoft: 'rgba(86, 211, 100, 0.12)',
    borderSoft: 'rgba(86, 211, 100, 0.3)',
  },
  security: {
    label: 'Security',
    color: '#FF7B72',
    bgSoft: 'rgba(255, 123, 114, 0.12)',
    borderSoft: 'rgba(255, 123, 114, 0.3)',
  },
  testing_qa: {
    label: 'Testing & QA',
    color: '#7EE787',
    bgSoft: 'rgba(126, 231, 135, 0.12)',
    borderSoft: 'rgba(126, 231, 135, 0.3)',
  },
  version_control: {
    label: 'Version Control & Git',
    color: '#D2A8FF',
    bgSoft: 'rgba(210, 168, 255, 0.12)',
    borderSoft: 'rgba(210, 168, 255, 0.3)',
  },
  cloud: {
    label: 'Cloud Computing',
    color: '#79B8FF',
    bgSoft: 'rgba(121, 184, 255, 0.12)',
    borderSoft: 'rgba(121, 184, 255, 0.3)',
  },
  ml_basics: {
    label: 'Machine Learning Basics',
    color: '#E279FE',
    bgSoft: 'rgba(226, 121, 254, 0.12)',
    borderSoft: 'rgba(226, 121, 254, 0.3)',
  },
  behavioral_interview: {
    label: 'Behavioral Interview',
    color: '#FFA657',
    bgSoft: 'rgba(255, 166, 87, 0.12)',
    borderSoft: 'rgba(255, 166, 87, 0.3)',
  },
  language_specific: {
    label: 'Language Specific',
    color: '#2DD4BF',
    bgSoft: 'rgba(45, 212, 191, 0.12)',
    borderSoft: 'rgba(45, 212, 191, 0.3)',
  },
};

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; color: string; badgeClass: string }
> = {
  beginner: {
    label: 'Beginner',
    color: '#2EA043',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  intermediate: {
    label: 'Intermediate',
    color: '#D29922',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  advanced: {
    label: 'Advanced',
    color: '#F85149',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
};

export const WORD_LIMITS = {
  definition: 40,
  whyItMatters: 60,
  example: 60,
  commonPitfall: 40,
  interviewAngle: 30,
  totalBudget: 230,
  absoluteMax: 260,
};

export const STORAGE_KEYS = {
  bookmarks: 'concept_app_bookmarks',
  learned: 'concept_app_learned',
  streak: 'concept_app_streak',
  recentSearches: 'concept_app_recent_searches',
  theme: 'concept_app_theme',
  customImages: 'concept_app_custom_images',
  reviewedConcepts: 'concept_app_reviewed_concepts',
};
