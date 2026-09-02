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
    <div className="space-y-8">
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onToggleLearned}
          className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            learned
              ? 'bg-teal/15 border-teal/40 text-teal'
              : 'bg-paper-card border-paper-border hover:bg-paper-surface text-paper-text'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{learned ? 'Learned' : 'Mark Learned'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleBookmark}
          className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            bookmarked
              ? 'bg-ochre/15 border-ochre/40 text-ochre'
              : 'bg-paper-card border-paper-border hover:bg-paper-surface text-paper-text'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
        </button>
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

      {/* Course Context Card */}
      {course && (
        <div className="p-4 rounded-xl border border-ochre/30 bg-ochre/5 space-y-2 font-mono shadow-sm">
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
        </div>
      )}
    </div>
  );
}
