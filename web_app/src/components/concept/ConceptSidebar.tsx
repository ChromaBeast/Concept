'use client';

import React from 'react';
import { ConceptTableOfContents } from './ConceptTableOfContents';
import { Bookmark, CheckCircle2, Building2, BookOpen } from 'lucide-react';
import { Course } from '@/lib/types';
import Link from 'next/link';

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
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onToggleLearned}
          className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
            learned
              ? 'bg-teal/15 border-teal/40 text-teal'
              : 'bg-paper-card border-paper-border hover:bg-paper-surface text-paper-text shadow-sm'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{learned ? 'Learned' : 'Mark Learned'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleBookmark}
          className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
            bookmarked
              ? 'bg-ochre/15 border-ochre/40 text-ochre'
              : 'bg-paper-card border-paper-border hover:bg-paper-surface text-paper-text shadow-sm'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
        </button>
      </div>

      {/* Table of Contents Container */}
      <div className="p-5 rounded-2xl border border-paper-border bg-paper-card shadow-sm">
        <ConceptTableOfContents />
      </div>

      {/* Company Interview Targets */}
      {companies && companies.length > 0 && (
        <div className="p-5 rounded-2xl border border-paper-border bg-paper-card space-y-3 font-mono shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-paper-text">
            <Building2 className="w-4 h-4 text-ochre" />
            <span>Asked in Interviews at</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {companies.map((c) => (
              <span
                key={c}
                className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-[11px] text-paper-muted"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course Context Card */}
      {course && (
        <div className="p-5 rounded-2xl border border-ochre/30 bg-ochre/5 space-y-3 font-mono shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ochre">
            <BookOpen className="w-4 h-4" />
            <span>Learning Track</span>
          </div>
          <div className="text-sm font-bold text-paper-text">{course.title}</div>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-block text-xs text-ochre hover:underline font-bold"
          >
            Track Playlist &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
