import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'accent' | 'success' | 'warning' | 'error';
  colorHex?: string;
}

export function Badge({ className, variant = 'default', colorHex, style, children, ...props }: BadgeProps) {
  const base =
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-mono font-medium transition-colors select-none';

  const variants = {
    default: 'bg-paper-surface border-paper-border text-paper-text',
    outline: 'border-paper-border text-paper-muted bg-transparent',
    accent: 'bg-ochre/15 border-ochre/30 text-ochre font-semibold',
    success: 'bg-teal/15 border-teal/30 text-teal font-semibold',
    warning: 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold',
    error: 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold',
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
    <div className={cn(base, !colorHex && variants[variant], className)} style={dynamicStyle} {...props}>
      {children}
    </div>
  );
}
