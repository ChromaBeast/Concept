'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { allSeedConcepts } from '@/lib/seed';
import { CATEGORY_META } from '@/lib/constants';

export interface RelatedConceptsProps {
  relatedConceptIds?: string[];
}

export function RelatedConcepts({ relatedConceptIds }: RelatedConceptsProps) {
  if (!relatedConceptIds || relatedConceptIds.length === 0) return null;

  const relatedConcepts = relatedConceptIds
    .map((id) => allSeedConcepts.find((c) => c.id === id))
    .filter((c) => Boolean(c));

  if (relatedConcepts.length === 0) return null;

  return (
    <div className="space-y-3 pt-6 border-t border-paper-border font-sans">
      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-ochre" />
        <span>Related Mental Models</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedConcepts.map((concept) => {
          if (!concept) return null;
          const catMeta = CATEGORY_META[concept.category] || CATEGORY_META.dsa;

          return (
            <Link
              key={concept.id}
              href={`/concepts/${concept.slug}`}
              className="p-3.5 rounded-xl border border-paper-border bg-paper-card hover:border-ochre/40 transition-all duration-150 flex items-center justify-between group shadow-sm"
            >
              <div className="min-w-0 pr-3">
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: catMeta.color }}
                >
                  {catMeta.label}
                </span>
                <div className="text-xs font-bold text-paper-text group-hover:text-ochre transition-colors truncate">
                  {concept.title}
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-paper-muted group-hover:text-ochre group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
