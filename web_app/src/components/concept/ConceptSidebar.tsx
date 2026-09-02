'use client';

import React from 'react';
import { ConceptTableOfContents } from './ConceptTableOfContents';
import { Bookmark, CheckCircle2, Building2, BookOpen, Clock } from 'lucide-react';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ReadTimeBadge } from '@/components/ui/ReadTimeBadge';
import { CategoryChip } from '@/components/ui/Chip';
import { Category, Difficulty, Course } from '@/lib/types';
import Link from 'next/link';

interface ConceptSidebarProps {
  category: Category;
  difficulty: Difficulty;
  estimatedReadSeconds: number;
  bookmarked: boolean;
  learned: boolean;
  companies?: string[];
  course?: Course | null;
  onToggleBookmark: () => void;
  onToggleLearned: () => void;
}

export function ConceptSidebar({
  category,
  difficulty,
  estimatedReadSeconds,
  bookmarked,
  learned,
  companies,
  course,
  onToggleBookmark,
  onToggleLearned,
}: ConceptSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Quick Actions & Meta Card */}
      <div className="p-5 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-4 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <CategoryChip category={category} />
          <DifficultyBadge difficulty={difficulty} />
        </div>

        <div className="flex items-center justify-between text-xs text-dark-muted font-mono pt-2 border-t border-obsidian-border">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-electric" /> Read Time:
          </span>
          <ReadTimeBadge seconds={estimatedReadSeconds} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onToggleLearned}
            className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              learned
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-obsidian-surface border-obsidian-border hover:bg-obsidian-variant text-dark-text'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{learned ? 'Learned' : 'Mark Learned'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleBookmark}
            className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              bookmarked
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-obsidian-surface border-obsidian-border hover:bg-obsidian-variant text-dark-text'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="p-5 rounded-2xl border border-obsidian-border bg-obsidian-card shadow-lg">
        <ConceptTableOfContents />
      </div>

      {/* Interview Target Badges */}
      {companies && companies.length > 0 && (
        <div className="p-5 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-3 shadow-lg font-mono">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dark-text">
            <Building2 className="w-4 h-4 text-electric" />
            <span>Asked in Interviews at</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {companies.map((c) => (
              <span
                key={c}
                className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-[11px] text-dark-muted"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course Playlist Context Card */}
      {course && (
        <div className="p-5 rounded-2xl border border-electric/30 bg-electric/5 space-y-3 shadow-lg font-mono">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-electric">
            <BookOpen className="w-4 h-4" />
            <span>Current Track</span>
          </div>
          <div className="text-sm font-bold text-dark-text">{course.title}</div>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-block text-xs text-electric hover:underline font-bold"
          >
            View Track Overview &rarr;
          </Link>
        </div>
      )}
    </aside>
  );
}
