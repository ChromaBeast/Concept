'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { Concept } from '@/lib/types';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { ReadTimeBadge } from '../ui/ReadTimeBadge';

export interface ConceptCardProps {
  concept: Concept;
  className?: string;
}

export function ConceptCard({ concept, className }: ConceptCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [learned, setLearned] = useState(false);

  const catMeta = CATEGORY_META[concept.category] || CATEGORY_META.dsa;
  const diffMeta = DIFFICULTY_META[concept.difficulty] || DIFFICULTY_META.beginner;

  useEffect(() => {
    const checkState = () => {
      setBookmarked(storage.isBookmarked(concept.id));
      setLearned(storage.isLearned(concept.id));
    };
    checkState();
    window.addEventListener('concept_storage_updated', checkState);
    return () => window.removeEventListener('concept_storage_updated', checkState);
  }, [concept.id]);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = storage.toggleBookmark(concept.id);
    setBookmarked(next);
  };

  return (
    <Link href={`/concepts/${concept.slug}`} className="block group h-full">
      <div
        className={`h-full flex flex-col justify-between p-5 rounded-2xl border border-paper-border bg-paper-card hover:border-ochre/50 transition-all duration-150 shadow-sm ${className || ''}`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${catMeta.color}15`,
                  color: catMeta.color,
                  border: `1px solid ${catMeta.color}35`,
                }}
              >
                {catMeta.label}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-paper-border bg-paper-surface text-paper-muted">
                {diffMeta.label}
              </span>
              {learned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal bg-teal/10 border border-teal/30 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" /> Learned
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-lg border transition-colors ${
                bookmarked
                  ? 'bg-ochre/15 text-ochre border-ochre/40'
                  : 'text-paper-muted hover:text-paper-text border-transparent hover:border-paper-border hover:bg-paper-surface'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark concept'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <h3 className="text-base font-bold text-paper-text group-hover:text-ochre transition-colors mb-1.5 line-clamp-1 font-sans">
            {concept.title}
          </h3>

          <p className="text-xs text-paper-muted leading-relaxed line-clamp-2 mb-4 font-sans">
            {concept.oneLiner}
          </p>
        </div>

        <div className="pt-3 border-t border-paper-border flex items-center justify-between text-xs text-paper-muted font-mono">
          <ReadTimeBadge seconds={concept.estimatedReadSeconds} />

          {concept.askedByCompanies && concept.askedByCompanies.length > 0 && (
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="text-[10px] text-paper-sub">Interviews:</span>
              <span className="text-[11px] text-paper-muted font-medium truncate max-w-[120px]">
                {concept.askedByCompanies.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
