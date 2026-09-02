import React from 'react';
import { AlertOctagon } from 'lucide-react';

export interface PitfallBoxProps {
  pitfall?: string;
}

export function PitfallBox({ pitfall }: PitfallBoxProps) {
  if (!pitfall) return null;

  return (
    <div className="p-4 sm:p-5 rounded-r-xl border-l-2 border-rose-500 bg-rose-500/5 space-y-1.5 font-sans">
      <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
        <AlertOctagon className="w-4 h-4 flex-shrink-0" />
        <span>Common Production Pitfall</span>
      </div>
      <p className="text-sm text-dark-text leading-relaxed pl-6">
        {pitfall}
      </p>
    </div>
  );
}
