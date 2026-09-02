'use client';

import React, { useState } from 'react';
import { HelpCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { QuickCheck as QuickCheckType } from '@/lib/types';

export interface QuickCheckProps {
  quickChecks: QuickCheckType[];
}

export function QuickCheckList({ quickChecks }: QuickCheckProps) {
  if (!quickChecks || quickChecks.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-dark-text mb-2">
        <HelpCircle className="w-4 h-4 text-brand-400" />
        <span>Quick Recall Checks</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quickChecks.map((qc, index) => (
          <QuickCheckItem key={index} item={qc} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

function QuickCheckItem({ item, index }: { item: QuickCheckType; index: number }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      onClick={() => setRevealed(!revealed)}
      className="p-4 rounded-xl border border-dark-border bg-dark-card hover:border-brand-500/40 cursor-pointer transition-all duration-200 select-none group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-medium text-brand-400">
            Q{index}
          </span>
          <span className="text-[11px] text-dark-muted flex items-center gap-1 group-hover:text-dark-text transition-colors">
            {revealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-brand-400" /> Hide Answer
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-dark-muted" /> Tap to Reveal
              </>
            )}
          </span>
        </div>

        <p className="text-sm font-medium text-dark-text leading-snug">
          {item.question}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-dark-border/40">
        {revealed ? (
          <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg animate-fadeIn">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <span className="leading-relaxed font-normal">{item.answer}</span>
          </div>
        ) : (
          <div className="text-xs text-dark-muted italic py-1">
            Tap card to test your recall...
          </div>
        )}
      </div>
    </div>
  );
}
