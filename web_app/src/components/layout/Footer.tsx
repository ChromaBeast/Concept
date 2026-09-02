'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="border-t border-paper-border bg-paper-bg/90 py-8 mt-16 text-paper-muted text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-0.5">
          <p className="text-paper-text font-bold text-sm font-sans">
            Concept &mdash; Architectural reference in &lt;2 minutes.
          </p>
          <p className="text-paper-muted text-xs">
            &copy; 2026 Concept.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/browse" className="hover:text-ochre transition-colors">
            Browse All
          </Link>
          <Link href="/courses" className="hover:text-ochre transition-colors">
            Study Tracks
          </Link>
          <Link href="/login" className="hover:text-ochre transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}
