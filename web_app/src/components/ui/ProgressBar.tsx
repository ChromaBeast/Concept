import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  colorHex?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  className,
  value,
  colorHex,
  showLabel = false,
  ...props
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full flex items-center gap-3', className)} {...props}>
      <div className="flex-1 bg-dark-variant border border-dark-border/50 rounded-full h-2 overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundColor: colorHex || '#6366F1',
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-medium text-dark-muted min-w-[2.5rem] text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
