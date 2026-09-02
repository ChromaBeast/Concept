import React from 'react';
import { Target } from 'lucide-react';

export interface InterviewBoxProps {
  interviewAngle?: string;
}

export function InterviewBox({ interviewAngle }: InterviewBoxProps) {
  if (!interviewAngle) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border-l-[3px] border-amber-500/70 bg-amber-500/5 space-y-1.5 font-sans border-t border-r border-b border-amber-500/10 shadow-sm">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
        <Target className="w-4 h-4 flex-shrink-0" />
        <span>Staff+ Interview Angle &amp; Framing</span>
      </div>
      <p className="text-sm text-paper-text leading-relaxed pl-6 italic">
        &ldquo;{interviewAngle}&rdquo;
      </p>
    </div>
  );
}
