'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface ConceptHeroVisualProps {
  title: string;
  imageUrl?: string | null;
  imagePrompt?: string | null;
}

export function ConceptHeroVisual({ title, imageUrl, imagePrompt }: ConceptHeroVisualProps) {
  if (!imageUrl) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-obsidian-border bg-obsidian-surface my-4">
      <div className="relative w-full h-56 sm:h-72">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
      {imagePrompt && (
        <div className="p-2.5 text-[11px] text-dark-muted bg-obsidian-surface/90 border-t border-obsidian-border italic flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3 h-3 text-electric flex-shrink-0" />
          <span>Visual Architecture Brief: {imagePrompt}</span>
        </div>
      )}
    </div>
  );
}
