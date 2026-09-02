import React from 'react';
import { AlertTriangle } from 'lucide-react';

export interface PitfallBoxProps {
  pitfall?: string;
}

export function PitfallBox({ pitfall }: PitfallBoxProps) {
  if (!pitfall) return null;

  return (
    <div className="p-4 rounded-xl border border-rose-500/25 bg-rose-500/5 text-dark-text relative overflow-hidden">
      <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1.5">
        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        <span>Common Pitfall & Misconception</span>
      </div>
      <p className="text-sm text-dark-text leading-relaxed pl-6">
        {pitfall}
      </p>
    </div>
  );
}
