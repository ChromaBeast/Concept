import React from 'react';
import { Target } from 'lucide-react';

export interface InterviewBoxProps {
  interviewAngle?: string;
}

export function InterviewBox({ interviewAngle }: InterviewBoxProps) {
  if (!interviewAngle) return null;

  return (
    <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 text-dark-text relative overflow-hidden">
      <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1.5">
        <Target className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>Interview Angle & Framing</span>
      </div>
      <p className="text-sm text-dark-text leading-relaxed pl-6 italic">
        &ldquo;{interviewAngle}&rdquo;
      </p>
    </div>
  );
}
