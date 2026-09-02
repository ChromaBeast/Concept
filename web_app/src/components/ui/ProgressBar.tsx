import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  colorHex?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  colorHex = '#B5720A',
  showLabel = false,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div className="flex-1 bg-paper-surface border border-paper-border/60 rounded-full h-2 overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: colorHex,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-medium text-paper-muted shrink-0">
          {percentage}%
        </span>
      )}
    </div>
  );
}
