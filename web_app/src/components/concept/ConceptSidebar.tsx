'use client';

import React from 'react';
import { ConceptTableOfContents } from './ConceptTableOfContents';
import { Bookmark, CheckCircle2, Building2, BookOpen } from 'lucide-react';
import { Course } from '@/lib/types';
import Link from 'next/link';
import { ClickSpark, SpotlightCard } from '@/components/animations';

interface ConceptSidebarProps {
  bookmarked: boolean;
  learned: boolean;
  companies?: string[];
  course?: Course | null;
  onToggleBookmark: () => void;
  onToggleLearned: () => void;
}

export function ConceptSidebar({
  bookmarked,
  learned,
  companies,
  course,
  onToggleBookmark,
  onToggleLearned,
}: ConceptSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Unified Segmented Study Utility Bar with ClickSpark */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-paper-surface border border-paper-border font-mono shadow-inner">
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
            <span>{learned ? 'Mastered' : 'Mark Learned'}</span>
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

      {/* Sleek Unboxed Table of Contents */}
      <div className="pt-2">
        <ConceptTableOfContents />
      </div>

      {/* Company Interview Targets */}
      {companies && companies.length > 0 && (
        <div className="pt-6 border-t border-paper-border space-y-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-paper-muted">
            <Building2 className="w-3.5 h-3.5 text-ochre" />
            <span>Interview Targets</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {companies.map((c) => (
              <span
                key={c}
                className="px-2.5 py-1 rounded-md bg-paper-card border border-paper-border text-[11px] text-paper-muted shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course Context Card with Spotlight */}
      {course && (
        <SpotlightCard
          spotlightColor="rgba(217, 119, 6, 0.12)"
          className="p-4 rounded-xl border border-ochre/30 bg-ochre/5 space-y-2 font-mono shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ochre">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Current Track</span>
          </div>
          <div className="text-xs font-bold text-paper-text">{course.title}</div>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-block text-[11px] text-ochre hover:underline font-bold"
          >
            Track Playlist &rarr;
          </Link>
        </SpotlightCard>
      )}
    </div>
  );
}
