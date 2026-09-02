'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function countWords(text?: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface MeterProps {
  label: string;
  text?: string;
  limit: number;
}

export function ConceptWordCountMeter({ label, text, limit }: MeterProps) {
  const words = countWords(text);
  const pct = Math.min(100, Math.round((words / limit) * 100));
  const isOver = words > limit;

  return (
    <div className="space-y-1 font-mono text-xs">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-paper-text">{label}</span>
        <span className={cn('font-bold', isOver ? 'text-rose-500' : 'text-paper-muted')}>
          {words}/{limit} words {isOver && '(Exceeded!)'}
        </span>
      </div>
      <Progress
        value={pct}
        indicatorClassName={isOver ? 'bg-rose-500' : pct > 85 ? 'bg-amber-500' : 'bg-teal'}
      />
    </div>
  );
}
