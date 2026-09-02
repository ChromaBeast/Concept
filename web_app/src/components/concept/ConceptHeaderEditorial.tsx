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
    <div className="relative border-b border-obsidian-border bg-obsidian-surface/30 -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8 overflow-hidden">
      {/* MagicUI Flickering Grid Background with Gradient Mask */}
      <div className="absolute top-0 left-0 z-0 w-full h-full [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] pointer-events-none opacity-40">
        <FlickeringGrid squareSize={4} gridGap={6} color="#E2FB3C" maxOpacity={0.25} flickerChance={0.05} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/browse"
            className="w-8 h-8 rounded-xl border border-obsidian-border bg-obsidian-card hover:bg-obsidian-variant flex items-center justify-center text-dark-muted hover:text-dark-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <span
            className="text-xs font-mono font-bold px-3 py-1 rounded-lg uppercase tracking-wider"
            style={{ backgroundColor: `${catMeta?.color}20`, color: catMeta?.color, border: `1px solid ${catMeta?.color}40` }}
          >
            {catMeta?.label || category}
          </span>

          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-obsidian-card border border-obsidian-border text-dark-muted">
            {diffMeta?.label || difficulty}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-mono text-electric font-bold ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>~{estimatedReadSeconds}s read</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-dark-muted max-w-4xl leading-relaxed">
          {oneLiner}
        </p>
      </div>
    </div>
  );
}
