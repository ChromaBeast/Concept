'use client';

import React from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { Category, Difficulty } from '@/lib/types';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';
import { ReadTimeBadge } from '../ui/ReadTimeBadge';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ConceptHeaderProps {
  category: Category;
  difficulty: Difficulty;
  estimatedReadSeconds: number;
  bookmarked: boolean;
  learned: boolean;
  onToggleBookmark: () => void;
  onToggleLearned: () => void;
}

export function ConceptHeader({
  category,
  difficulty,
  estimatedReadSeconds,
  bookmarked,
  learned,
  onToggleBookmark,
  onToggleLearned,
}: ConceptHeaderProps) {
  const catMeta = CATEGORY_META[category] || CATEGORY_META.dsa;
  const diffMeta = DIFFICULTY_META[difficulty] || DIFFICULTY_META.beginner;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-border/50">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge colorHex={catMeta.color}>{catMeta.label}</Badge>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${diffMeta.badgeClass}`}>
          {diffMeta.label}
        </span>
        <ReadTimeBadge seconds={estimatedReadSeconds} />
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`p-2 rounded-lg border transition-colors ${
            bookmarked
              ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
              : 'bg-dark-surface text-dark-muted hover:text-dark-text border-dark-border'
          }`}
          title={bookmarked ? 'Saved to bookmarks' : 'Bookmark concept'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>

        <Button
          variant={learned ? 'secondary' : 'primary'}
          size="sm"
          onClick={onToggleLearned}
          className={learned ? 'border-emerald-500/40 text-emerald-400' : ''}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 mr-1 ${learned ? 'text-emerald-400' : ''}`} />
          {learned ? 'Learned' : 'Mark as Learned'}
        </Button>
      </div>
    </div>
  );
}
