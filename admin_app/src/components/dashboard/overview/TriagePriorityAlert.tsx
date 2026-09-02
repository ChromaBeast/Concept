'use client';

import React from 'react';
import { AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TriagePriorityAlert({ count = 0, onReview }: { count?: number; onReview: () => void }) {
  if (count === 0) return null;

  return (
    <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-paper-text font-sans text-sm flex items-center gap-2">
            <span>Editorial Action Required</span>
            <Badge variant="warning">{count} Drafts Flagged</Badge>
          </div>
          <p className="text-paper-muted text-xs font-mono">
            {count} AI-synthesized concepts exceeded word count limits or triggered self-check flags.
          </p>
        </div>
      </div>
      <Button size="sm" variant="primary" onClick={onReview} className="shrink-0 font-mono">
        <span>Open Review Triage</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Button>
    </div>
  );
}
