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
      {/* Subtle Flickering Grid Canvas Overlay */}
      <div className="absolute top-0 left-0 z-0 w-full h-[220px] [mask-image:linear-gradient(to_top,transparent_20%,black_95%)] pointer-events-none opacity-25">
        <FlickeringGrid squareSize={4} gridGap={6} color="#8C8474" maxOpacity={0.2} flickerChance={0.04} />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-5 p-6 sm:p-10 relative z-10">
        {/* Navigation & Metadata Tag Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-paper-muted">
          <Link
            href="/browse"
            className="h-7 w-7 rounded-lg border border-paper-border bg-paper-card flex items-center justify-center hover:bg-paper-surface text-paper-muted hover:text-paper-text transition-colors shadow-sm"
            title="Back to all concepts"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>

          <span
            className="h-7 px-3 text-xs font-semibold rounded-md border flex items-center justify-center uppercase tracking-wider font-mono"
            style={{
              backgroundColor: `${catMeta?.color}15`,
              color: catMeta?.color,
              borderColor: `${catMeta?.color}35`,
            }}
          >
            {catMeta?.label || category}
          </span>

          <span className="h-7 px-3 text-xs font-mono rounded-md border border-paper-border bg-paper-card text-paper-muted flex items-center justify-center">
            {diffMeta?.label || difficulty}
          </span>

          <span className="h-7 px-3 text-xs font-mono text-ochre bg-ochre/10 rounded-md border border-ochre/30 flex items-center justify-center gap-1.5 ml-auto font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>~{estimatedReadSeconds}s read</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-paper-text leading-tight text-balance font-sans">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-paper-muted text-base sm:text-lg font-normal max-w-4xl text-balance leading-relaxed">
          {oneLiner}
        </p>
      </div>
    </header>
  );
}
