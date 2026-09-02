'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { FlickeringGrid } from '@/components/magicui/FlickeringGrid';
import { Category, Difficulty } from '@/lib/types';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';

interface ConceptHeaderEditorialProps {
  title: string;
  oneLiner: string;
  category: Category;
  difficulty: Difficulty;
  estimatedReadSeconds: number;
}

export function ConceptHeaderEditorial({
  title,
  oneLiner,
  category,
  difficulty,
  estimatedReadSeconds,
}: ConceptHeaderEditorialProps) {
  const catMeta = CATEGORY_META[category];
  const diffMeta = DIFFICULTY_META[difficulty];

  return (
    <header className="relative border-b border-paper-border bg-paper-bg">
      {/* Canvas Grid Overlay */}
      <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_20%,black_95%)] pointer-events-none opacity-20">
        <FlickeringGrid squareSize={4} gridGap={6} color="#8C8474" maxOpacity={0.15} flickerChance={0.03} />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 p-4 sm:p-8 lg:p-10 relative z-10">
        {/* Navigation & Metadata Tag Row */}
        <div className="flex items-center justify-between gap-3 text-xs font-mono text-paper-muted flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/browse"
              className="h-7 w-7 rounded-lg border border-paper-border bg-paper-card flex items-center justify-center hover:bg-paper-surface text-paper-muted hover:text-paper-text transition-colors shadow-sm"
              title="Back to all concepts"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>

            <span
              className="h-6 px-2 text-[11px] font-semibold rounded-md border flex items-center justify-center uppercase tracking-wider font-mono select-none"
              style={{
                backgroundColor: `${catMeta?.color}12`,
                color: catMeta?.color,
                borderColor: `${catMeta?.color}30`,
              }}
            >
              {catMeta?.label || category}
            </span>

            <span className="h-6 px-2 text-[11px] font-mono rounded-md border border-paper-border bg-paper-surface/60 text-paper-muted flex items-center justify-center select-none">
              {diffMeta?.label || difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-ochre font-medium select-none">
            <Clock className="w-3.5 h-3.5" />
            <span>~{estimatedReadSeconds}s read</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper-text leading-tight text-balance font-sans">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-paper-muted text-sm sm:text-base lg:text-lg font-normal max-w-4xl text-balance leading-relaxed">
          {oneLiner}
        </p>
      </div>
    </header>
  );
}
