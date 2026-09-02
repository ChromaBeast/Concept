import React from 'react';
import { Target } from 'lucide-react';

export interface InterviewBoxProps {
  interviewAngle?: string;
}

export function InterviewBox({ interviewAngle }: InterviewBoxProps) {
  if (!interviewAngle) return null;

  return (
    <div className="p-4 sm:p-5 rounded-r-xl border-l-2 border-amber-500 bg-amber-500/5 space-y-1.5 font-sans">
      <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
        <Target className="w-4 h-4 flex-shrink-0" />
        <span>Staff+ Interview Angle & Framing</span>
      </div>
      <p className="text-sm text-dark-text leading-relaxed pl-6 italic">
        &ldquo;{interviewAngle}&rdquo;
      </p>
    </div>
  );
}
