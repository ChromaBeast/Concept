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
    'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium tracking-wide border select-none';

  const variants = {
    default: 'bg-dark-surface text-dark-muted border-dark-border',
    outline: 'bg-transparent text-dark-muted border-dark-border',
    accent: 'bg-electric/10 text-electric border-electric/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const dynamicStyle = colorHex
    ? {
        backgroundColor: `${colorHex}1A`,
        borderColor: `${colorHex}4D`,
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
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold border select-none',
        className
      )}
      style={{
        backgroundColor: `${meta?.color}15`,
        borderColor: `${meta?.color}40`,
        color: meta?.color,
      }}
    >
      {meta?.label || difficulty}
    </span>
  );
}
