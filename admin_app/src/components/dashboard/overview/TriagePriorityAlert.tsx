'use client';

import React from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TriagePriorityAlert({ count = 0, onReview }: { count?: number; countStr?: string; onReview: () => void }) {
  if (count === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-ochre/25 bg-ochre/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-ochre/15 text-ochre flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="font-bold text-paper-text text-sm flex items-center gap-2">
            <span>Editorial Review Queue</span>
            <Badge variant="accent" className="font-mono text-[10px]">
              {count} Flagged Drafts
            </Badge>
          </div>
          <p className="text-paper-muted text-xs leading-relaxed font-sans">
            AI-synthesized concepts pending manual inspection for word count limits and accuracy verification.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant="primary"
        onClick={onReview}
        className="shrink-0 font-mono text-xs w-full sm:w-auto"
      >
        <span>Open Review Drawer</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
      </Button>
    </div>
  );
}
