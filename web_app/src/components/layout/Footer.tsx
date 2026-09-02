import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-obsidian-border bg-obsidian-bg/80 py-8 mt-16 text-dark-muted text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-dark-text font-bold text-sm">
            Concept &mdash; Software Engineering Mental Models in &lt;2 minutes.
          </p>
          <p className="text-dark-muted text-xs">
            Dense reference & daily learning loops for working software engineers.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/browse" className="hover:text-electric transition-colors">
            Browse All
          </Link>
          <Link href="/courses" className="hover:text-electric transition-colors">
            Curated Tracks
          </Link>
          <Link href="/login" className="hover:text-electric transition-colors">
            Sign In
          </Link>
          <Link href="/admin" className="hover:text-electric transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
