'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  asLink?: boolean;
}

export function ConceptLogoIcon({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-xl bg-paper-card border border-paper-border shadow-sm group-hover:border-ochre/50 transition-all duration-200 overflow-hidden flex-shrink-0',
        sizeMap[size],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-ochre/20 via-transparent to-teal/10 opacity-70 group-hover:opacity-100 transition-opacity" />

      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[70%] h-[70%] relative z-10 text-paper-text group-hover:text-ochre transition-colors"
      >
        <path
          d="M24 8.5C22.2 6.5 19.4 5.2 16.2 5.2C10.2 5.2 5.5 10 5.5 16C5.5 22 10.2 26.8 16.2 26.8C19.4 26.8 22.2 25.5 24 23.5"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16.2" cy="16" r="3.2" className="fill-ochre" />
        <circle cx="23.5" cy="8.5" r="1.5" className="fill-ochre" />
        <circle cx="23.5" cy="23.5" r="1.5" className="fill-teal" />
      </svg>
    </div>
  );
}

export function AdminLogo({
  className,
  size = 'md',
  showText = true,
  asLink = true,
}: LogoProps) {
  const textSizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 group select-none', className)}>
      <ConceptLogoIcon size={size} />
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-bold tracking-tight text-paper-text group-hover:text-ochre transition-colors font-sans leading-none',
              textSizeMap[size]
            )}
          >
            Concept Admin
          </span>
          <span className="text-[10px] font-mono text-paper-muted tracking-wider uppercase mt-0.5">
            Mission Control
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-block" aria-label="Concept Admin Home">
        {content}
      </Link>
    );
  }

  return content;
}
