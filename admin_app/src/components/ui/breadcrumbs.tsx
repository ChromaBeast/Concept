import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav className={cn('flex items-center space-x-1.5 font-mono text-xs text-paper-muted', className)}>
      <div className="flex items-center gap-1 hover:text-paper-text transition-colors cursor-pointer" onClick={items[0]?.onClick}>
        <Home className="w-3.5 h-3.5 text-ochre" />
        <span className="hidden sm:inline">Admin</span>
      </div>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-paper-muted/60 shrink-0" />
          <span
            onClick={item.onClick}
            className={cn(
              'truncate max-w-[150px] sm:max-w-xs transition-colors',
              item.active ? 'font-bold text-paper-text' : 'hover:text-paper-text cursor-pointer'
            )}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}
