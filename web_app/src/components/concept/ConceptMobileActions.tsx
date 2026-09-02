'use client';

import React from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { ClickSpark } from '@/components/animations';

interface ConceptMobileActionsProps {
  learned: boolean;
  bookmarked: boolean;
  onToggleLearned: () => void;
  onToggleBookmark: () => void;
}

export function ConceptMobileActions({
  learned,
  bookmarked,
  onToggleLearned,
  onToggleBookmark,
}: ConceptMobileActionsProps) {
  return (
    <div className="lg:hidden flex items-center gap-1.5 p-1 rounded-xl bg-paper-surface border border-paper-border font-mono shadow-sm">
      <ClickSpark sparkCount={14} sparkColors={['#0d9488', '#10b981', '#ffffff']} className="flex-1">
        <button
          type="button"
          onClick={onToggleLearned}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            learned
              ? 'bg-teal text-white shadow-sm'
              : 'text-paper-muted hover:text-paper-text hover:bg-paper-card'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{learned ? 'Mastered' : 'Mark Mastered'}</span>
        </button>
      </ClickSpark>

      <ClickSpark sparkCount={12} sparkColors={['#d97706', '#f59e0b', '#ffffff']} className="flex-1">
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            bookmarked
              ? 'bg-ochre text-white shadow-sm'
              : 'text-paper-muted hover:text-paper-text hover:bg-paper-card'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
        </button>
      </ClickSpark>
    </div>
  );
}
