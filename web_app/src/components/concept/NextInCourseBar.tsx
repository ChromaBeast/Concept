import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Course, Concept } from '@/lib/types';
import { allSeedConcepts } from '@/lib/seed';

export interface NextInCourseBarProps {
  course: Course;
  currentConceptId: string;
}

export function NextInCourseBar({ course, currentConceptId }: NextInCourseBarProps) {
  const currentIndex = course.conceptIds.indexOf(currentConceptId);
  if (currentIndex === -1 || currentIndex >= course.conceptIds.length - 1) {
    return null;
  }

  const nextConceptId = course.conceptIds[currentIndex + 1];
  const nextConcept = allSeedConcepts.find((c) => c.id === nextConceptId);
  if (!nextConcept) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-dark-surface/90 backdrop-blur-md border-t border-dark-border p-3 shadow-xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <BookOpen className="w-4 h-4 text-brand-400 flex-shrink-0" />
          <div className="truncate">
            <span className="text-[11px] text-dark-muted font-mono uppercase tracking-wider block">
              Course Playlist: {course.title} ({currentIndex + 1}/{course.conceptIds.length})
            </span>
            <span className="text-xs text-dark-text font-medium truncate block">
              Up Next: <strong className="text-brand-400">{nextConcept.title}</strong>
            </span>
          </div>
        </div>

        <Link
          href={`/concepts/${nextConcept.slug}?course=${course.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs shadow-md transition-all flex-shrink-0"
        >
          <span>Next Concept</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
