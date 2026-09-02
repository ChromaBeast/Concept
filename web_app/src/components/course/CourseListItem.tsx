'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import { Concept } from '@/lib/types';
import { DIFFICULTY_META } from '@/lib/constants';

export interface CourseListItemProps {
  concept: Concept;
  index: number;
  isLearned: boolean;
  courseSlug: string;
  onToggleLearned: (conceptId: string) => void;
}

export function CourseListItem({
  concept,
  index,
  isLearned,
  courseSlug,
  onToggleLearned,
}: CourseListItemProps) {
  const diffMeta = DIFFICULTY_META[concept.difficulty] || DIFFICULTY_META.beginner;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-paper-border bg-paper-card hover:border-ochre/40 transition-all duration-150 gap-4 group shadow-sm font-sans">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={() => onToggleLearned(concept.id)}
          className="text-paper-muted hover:text-teal transition-colors flex-shrink-0"
          title={isLearned ? 'Mark unlearned' : 'Mark learned'}
        >
          {isLearned ? (
            <CheckCircle2 className="w-5 h-5 text-teal fill-teal/20" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <span className="text-xs font-mono text-paper-muted w-5 text-right flex-shrink-0">
          {index + 1}.
        </span>

        <div className="min-w-0">
          <Link
            href={`/concepts/${concept.slug}?course=${courseSlug}`}
            className="text-sm font-semibold text-paper-text group-hover:text-ochre transition-colors block truncate"
          >
            {concept.title}
          </Link>
          <p className="text-xs text-paper-muted truncate mt-0.5">{concept.oneLiner}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
        <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded border border-paper-border bg-paper-surface text-paper-muted">
          {diffMeta.label}
        </span>
        <span className="text-paper-muted text-[11px] hidden sm:inline flex items-center gap-1">
          <Clock className="w-3 h-3 text-ochre" /> ~{concept.estimatedReadSeconds}s
        </span>
        <Link
          href={`/concepts/${concept.slug}?course=${courseSlug}`}
          className="p-1 rounded-lg text-paper-muted group-hover:text-ochre transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
