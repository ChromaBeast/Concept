'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <nav className={cn('flex items-center justify-center gap-1 font-mono text-xs select-none', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 px-2.5"
      >
        <ChevronLeft className="w-3.5 h-3.5 mr-1" />
        <span>Prev</span>
      </Button>

      {pages.map((p, idx) => {
        if (p === 'ellipsis') {
          return (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-paper-muted">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer font-semibold',
              isCurrent
                ? 'bg-ochre text-white shadow-sm font-bold'
                : 'bg-paper-card border border-paper-border text-paper-text hover:bg-paper-surface'
            )}
          >
            {p}
          </button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 px-2.5"
      >
        <span>Next</span>
        <ChevronRight className="w-3.5 h-3.5 ml-1" />
      </Button>
    </nav>
  );
}
