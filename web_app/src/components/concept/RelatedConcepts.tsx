import React from 'react';
import Link from 'next/link';
import { Network, ArrowRight } from 'lucide-react';
import { Concept } from '@/lib/types';
import { allSeedConcepts } from '@/lib/seed';
import { CATEGORY_META } from '@/lib/constants';

export interface RelatedConceptsProps {
  relatedConceptIds: string[];
}

export function RelatedConcepts({ relatedConceptIds }: RelatedConceptsProps) {
  if (!relatedConceptIds || relatedConceptIds.length === 0) return null;

  const relatedList = relatedConceptIds
    .map((id) => allSeedConcepts.find((c) => c.id === id))
    .filter((c): c is Concept => Boolean(c));

  if (relatedList.length === 0) return null;

  return (
    <div className="space-y-3 pt-6 border-t border-dark-border">
      <div className="flex items-center gap-2 text-sm font-semibold text-dark-text">
        <Network className="w-4 h-4 text-brand-400" />
        <span>Related Concepts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedList.map((concept) => {
          const meta = CATEGORY_META[concept.category] || CATEGORY_META.dsa;
          return (
            <Link
              key={concept.id}
              href={`/concepts/${concept.slug}`}
              className="p-3.5 rounded-xl border border-dark-border bg-dark-card hover:border-brand-500/40 transition-all duration-150 flex items-center justify-between group"
            >
              <div>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider block mb-0.5"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
                <h4 className="text-sm font-semibold text-dark-text group-hover:text-brand-400 transition-colors">
                  {concept.title}
                </h4>
              </div>
              <ArrowRight className="w-4 h-4 text-dark-muted group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
