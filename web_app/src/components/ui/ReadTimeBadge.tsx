import React from 'react';
import { Clock } from 'lucide-react';
import { cn, formatReadTime } from '@/lib/utils';

export interface ReadTimeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  seconds: number;
}

export function ReadTimeBadge({ seconds, className, ...props }: ReadTimeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-dark-surface border border-dark-border text-dark-muted select-none',
        className
      )}
      {...props}
    >
      <Clock className="w-3 h-3 text-brand-400" />
      <span>{formatReadTime(seconds)}</span>
    </span>
  );
}
