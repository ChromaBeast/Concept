'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem } from '../ui/breadcrumbs';
import { ThemeToggle } from './ThemeToggle';
import { APPWRITE_CONFIG } from '@/lib/appwrite';

interface DashboardHeaderProps {
  currentTab: string;
  onOpenCommand: () => void;
  onSelectTab: (tab: string) => void;
}

export function DashboardHeader({ currentTab, onOpenCommand, onSelectTab }: DashboardHeaderProps) {
  const tabTitles: Record<string, string> = {
    overview: 'Overview',
    pipeline: 'AI Synthesis Console',
    roadmap: 'Roadmap Topics Queue',
    concepts: 'Review & Triage',
    media: 'Image Studio',
    courses: 'Study Tracks',
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: tabTitles[currentTab] || 'Dashboard', active: true },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-paper-border bg-paper-bg/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 select-none">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Right: Quick Command Bar & Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-paper-border bg-paper-card hover:bg-paper-surface text-xs text-paper-muted hover:text-paper-text shadow-sm transition-all cursor-pointer font-sans"
        >
          <Search className="w-3.5 h-3.5 text-ochre" />
          <span className="hidden sm:inline">Search anything...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-paper-surface border border-paper-border font-mono">
            ⌘K
          </kbd>
        </button>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal/25 bg-teal/10 text-teal text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span>Appwrite:</span>
          <span className="font-bold">{APPWRITE_CONFIG.projectId.slice(0, 8)}...</span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
