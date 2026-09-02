import React from 'react';
import { cn } from '@/lib/utils';
import { Difficulty } from '@/lib/types';
import { DIFFICULTY_META } from '@/lib/constants';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'accent' | 'success' | 'warning' | 'error';
  colorHex?: string;
}

export function Badge({ className, variant = 'default', colorHex, children, style, ...props }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-medium tracking-wide border select-none';

  const variants = {
    default: 'bg-paper-surface text-paper-muted border-paper-border',
    outline: 'bg-transparent text-paper-muted border-paper-border',
    accent: 'bg-ochre/10 text-ochre border-ochre/25',
    success: 'bg-teal/10 text-teal border-teal/25',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
  };

  const dynamicStyle = colorHex
    ? {
        backgroundColor: `${colorHex}15`,
        borderColor: `${colorHex}35`,
        color: colorHex,
        ...style,
      }
    : style;

  return (
    <span
      className={cn(baseStyles, !colorHex && variants[variant], className)}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  const meta = DIFFICULTY_META[difficulty];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium border border-paper-border bg-paper-surface/80 text-paper-muted select-none',
        className
      )}
    >
      {meta?.label || difficulty}
    </span>
  );
}
