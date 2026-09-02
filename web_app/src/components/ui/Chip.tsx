import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import { CATEGORY_META } from '@/lib/constants';

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
    md: 'text-xs py-1.5 px-3.5 gap-2',
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center rounded-lg font-mono font-medium transition-all duration-150 border select-none whitespace-nowrap cursor-pointer shadow-sm',
        sizeStyles[size],
        active
          ? 'bg-ochre text-white font-bold border-ochre'
          : 'bg-paper-card hover:bg-paper-surface text-paper-muted hover:text-paper-text border-paper-border',
        className
      )}
      {...props}
    >
      {colorHex && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: colorHex }}
        />
      )}
      {children}
    </button>
  );
}

export function CategoryChip({ category, className }: { category: Category; className?: string }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border select-none',
        className
      )}
      style={{
        backgroundColor: `${meta?.color}15`,
        borderColor: `${meta?.color}35`,
        color: meta?.color,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta?.color }} />
      <span>{meta?.label || category}</span>
    </span>
  );
}
