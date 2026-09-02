'use client';

import React from 'react';
import { Database, ShieldCheck, Activity } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '../ui/badge';
import { APPWRITE_CONFIG } from '@/lib/appwrite';

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-border bg-paper-bg/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Admin Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-ochre flex items-center justify-center font-bold text-white text-base shadow-sm font-mono">
            C
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-paper-text font-sans">
              Concept Admin
            </span>
            <Badge variant="accent" className="hidden sm:inline-flex">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Console v1.0
            </Badge>
          </div>
        </div>

        {/* Right: Connection Badge & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal/25 bg-teal/10 text-teal text-xs font-mono select-none">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="hidden sm:inline">Appwrite Cloud:</span>
            <span className="font-bold">{APPWRITE_CONFIG.projectId.slice(0, 8)}...</span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
