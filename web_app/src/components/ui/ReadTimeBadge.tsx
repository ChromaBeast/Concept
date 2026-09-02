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
        'inline-flex items-center gap-1.5 text-xs font-mono font-medium text-paper-muted select-none',
        className
      )}
      {...props}
    >
      <Clock className="w-3.5 h-3.5 text-ochre" />
      <span>{formatReadTime(seconds)}</span>
    </span>
  );
}
