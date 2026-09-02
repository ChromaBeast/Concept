import React from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  colorHex?: string;
  size?: 'sm' | 'md';
}

export function Chip({
  className,
  active = false,
  colorHex,
  size = 'md',
  children,
  ...props
}: ChipProps) {
  const sizeStyles = {
    sm: 'text-xs py-1 px-2.5 gap-1.5',
    md: 'text-sm py-1.5 px-3.5 gap-2',
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-150 border select-none whitespace-nowrap cursor-pointer',
        sizeStyles[size],
        active
          ? 'bg-brand-500/15 text-brand-400 border-brand-500/50 shadow-sm'
          : 'bg-dark-surface hover:bg-dark-variant text-dark-muted hover:text-dark-text border-dark-border',
        className
      )}
      {...props}
    >
      {colorHex && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: colorHex }}
        />
      )}
      {children}
    </button>
  );
}
