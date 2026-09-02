import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReadTime(seconds: number): string {
  if (seconds < 60) {
    return `~${seconds}s read`;
  }
  const mins = Math.round(seconds / 60);
  if (mins === 1 && seconds < 100) {
    return `~${seconds}s read`;
  }
  return `~${mins} min read`;
}

export function formatMinutesTotal(seconds: number): string {
  const mins = Math.ceil(seconds / 60);
  return `${mins} min`;
}

export function calculateCourseProgress(
  conceptIds: string[],
  learnedIds: string[]
): { completed: number; total: number; percentage: number; isCompleted: boolean } {
  const total = conceptIds.length;
  if (total === 0) return { completed: 0, total: 0, percentage: 0, isCompleted: false };
  const completed = conceptIds.filter((id) => learnedIds.includes(id)).length;
  const percentage = Math.round((completed / total) * 100);
  return {
    completed,
    total,
    percentage,
    isCompleted: completed === total,
  };
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
