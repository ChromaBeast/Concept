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
      className="p-5 rounded-2xl border border-paper-border bg-paper-card hover:border-ochre/40 cursor-pointer transition-colors select-none group flex flex-col justify-between space-y-3 shadow-sm"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
          <span className="text-ochre font-bold">
            QUESTION {index}
          </span>
          <span className="text-[11px] text-paper-muted flex items-center gap-1 group-hover:text-paper-text transition-colors">
            {revealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-ochre" /> Hide Answer
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-paper-muted" /> Tap to Reveal
              </>
            )}
          </span>
        </div>

        <p className="text-sm font-semibold text-paper-text leading-snug font-sans">
          {item.question}
        </p>
      </div>

      <div className="pt-3 border-t border-paper-border/60 font-mono text-xs">
        {revealed ? (
          <div className="flex items-start gap-2 text-teal bg-teal/10 border border-teal/25 p-3 rounded-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal" />
            <span className="leading-relaxed font-sans text-paper-text">{item.answer}</span>
          </div>
        ) : (
          <div className="text-[11px] text-paper-muted italic">
            Click card to reveal architectural answer...
          </div>
        )}
      </div>
    </div>
  );
}
