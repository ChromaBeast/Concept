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
    md: 'text-sm py-1.5 px-3.5 gap-2',
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-150 border select-none whitespace-nowrap cursor-pointer',
        sizeStyles[size],
        active
          ? 'bg-electric text-obsidian-bg font-bold border-electric shadow-sm'
          : 'bg-obsidian-surface hover:bg-obsidian-variant text-dark-muted hover:text-dark-text border-obsidian-border',
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

export function CategoryChip({ category, className }: { category: Category; className?: string }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border select-none',
        className
      )}
      style={{
        backgroundColor: `${meta?.color}15`,
        borderColor: `${meta?.color}40`,
        color: meta?.color,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta?.color }} />
      <span>{meta?.label || category}</span>
    </span>
  );
}
