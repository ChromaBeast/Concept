'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

interface ConceptCompaniesListProps {
  companies?: string[];
}

export function ConceptCompaniesList({ companies }: ConceptCompaniesListProps) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="flex items-center gap-2 pt-4 border-t border-obsidian-border text-xs text-dark-muted font-mono">
      <Building2 className="w-3.5 h-3.5 text-electric" />
      <span className="font-semibold text-dark-text">Asked at:</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {companies.map((c) => (
          <span
            key={c}
            className="px-2 py-0.5 rounded-lg bg-obsidian-surface border border-obsidian-border text-[11px] text-dark-muted"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
