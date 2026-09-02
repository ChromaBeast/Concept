'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { QuickCheck as QuickCheckType } from '@/lib/types';

export interface QuickCheckProps {
  quickChecks: QuickCheckType[];
}

export function QuickCheckList({ quickChecks }: QuickCheckProps) {
  if (!quickChecks || quickChecks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quickChecks.map((qc, index) => (
        <QuickCheckItem key={index} item={qc} index={index + 1} />
      ))}
    </div>
  );
}

function QuickCheckItem({ item, index }: { item: QuickCheckType; index: number }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      onClick={() => setRevealed(!revealed)}
      className="p-5 rounded-2xl border border-obsidian-border bg-obsidian-card hover:border-obsidian-border/80 cursor-pointer transition-colors select-none group flex flex-col justify-between space-y-3"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
          <span className="text-electric font-bold">
            QUESTION {index}
          </span>
          <span className="text-[11px] text-dark-muted flex items-center gap-1 group-hover:text-dark-text transition-colors">
            {revealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-electric" /> Hide Answer
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-dark-muted" /> Tap to Reveal
              </>
            )}
          </span>
        </div>

        <p className="text-sm font-semibold text-white leading-snug font-sans">
          {item.question}
        </p>
      </div>

      <div className="pt-3 border-t border-obsidian-border/60 font-mono text-xs">
        {revealed ? (
          <div className="flex items-start gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed font-sans">{item.answer}</span>
          </div>
        ) : (
          <div className="text-[11px] text-dark-muted italic">
            Click card to reveal architectural answer...
          </div>
        )}
      </div>
    </div>
  );
}
