'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { Concept } from '@/lib/types';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { Card } from '../ui/Card';
import { ReadTimeBadge } from '../ui/ReadTimeBadge';
import { Badge } from '../ui/Badge';

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
    <Link href={`/concepts/${concept.slug}`} className="block group">
      <Card
        accentColor={catMeta.color}
        hoverable
        className={`h-full flex flex-col justify-between ${className || ''}`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge colorHex={catMeta.color}>{catMeta.label}</Badge>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${diffMeta.badgeClass}`}>
                {diffMeta.label}
              </span>
              {learned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" /> Learned
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-lg border transition-colors ${
                bookmarked
                  ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                  : 'text-dark-muted hover:text-dark-text border-transparent hover:border-dark-border hover:bg-dark-surface'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark concept'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <h3 className="text-base font-semibold text-dark-text group-hover:text-brand-400 transition-colors mb-1.5 line-clamp-1">
            {concept.title}
          </h3>

          <p className="text-xs text-dark-muted leading-relaxed line-clamp-2 mb-4">
            {concept.oneLiner}
          </p>
        </div>

        <div className="pt-3 border-t border-dark-border/50 flex items-center justify-between text-xs text-dark-muted">
          <ReadTimeBadge seconds={concept.estimatedReadSeconds} />

          {concept.askedByCompanies && concept.askedByCompanies.length > 0 && (
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="text-[10px] text-dark-sub">Asked at:</span>
              <span className="text-[11px] text-dark-muted font-medium truncate max-w-[120px]">
                {concept.askedByCompanies.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
