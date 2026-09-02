'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ArrowRight, Clock } from 'lucide-react';
import { Concept } from '@/lib/types';
import { formatReadTime } from '@/lib/utils';
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
  const diffMeta = DIFFICULTY_META[concept.difficulty] || DIFFICULTY_META.intermediate;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-dark-border bg-dark-card hover:border-dark-muted/40 transition-all duration-150 gap-4 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={() => onToggleLearned(concept.id)}
          className="text-dark-muted hover:text-emerald-400 transition-colors flex-shrink-0"
          title={isLearned ? 'Mark as unlearned' : 'Mark as learned'}
        >
          {isLearned ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
          ) : (
            <Circle className="w-5 h-5 text-dark-muted" />
          )}
        </button>

        <span className="text-xs font-mono font-medium text-dark-sub w-5 text-right select-none flex-shrink-0">
          {index + 1}.
        </span>

        <div className="min-w-0">
          <Link
            href={`/concepts/${concept.slug}?course=${courseSlug}`}
            className="text-sm font-semibold text-dark-text group-hover:text-brand-400 transition-colors block truncate"
          >
            {concept.title}
          </Link>
          <p className="text-xs text-dark-muted truncate">{concept.oneLiner}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`hidden sm:inline text-[10px] font-medium px-2 py-0.5 rounded border ${diffMeta.badgeClass}`}>
          {diffMeta.label}
        </span>
        <span className="flex items-center gap-1 text-xs text-dark-muted font-mono">
          <Clock className="w-3 h-3 text-dark-sub" />
          {formatReadTime(concept.estimatedReadSeconds)}
        </span>
        <Link
          href={`/concepts/${concept.slug}?course=${courseSlug}`}
          className="p-1.5 rounded-lg bg-dark-surface hover:bg-dark-variant text-dark-muted group-hover:text-brand-400 transition-colors"
          title="Read concept"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
