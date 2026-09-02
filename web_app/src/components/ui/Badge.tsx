import React from 'react';
import { cn } from '@/lib/utils';

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
    accent: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
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
