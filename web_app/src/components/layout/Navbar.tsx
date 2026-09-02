'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Compass, BookOpen, Search, Bookmark, User, ShieldCheck, Menu, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { StreakBadge } from '../ui/StreakBadge';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Sparkles },
  { href: '/browse', label: 'Browse', icon: Compass },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/admin', label: 'Admin', icon: ShieldCheck },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(4);

  useEffect(() => {
    const updateStreak = () => {
      const s = storage.getStreak();
      setStreakDays(s.streakDays);
    };
    updateStreak();
    window.addEventListener('concept_storage_updated', updateStreak);
    return () => window.removeEventListener('concept_storage_updated', updateStreak);
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-dark-text group-hover:text-brand-400 transition-colors">
                Concept
              </span>
              <span className="text-[10px] text-dark-muted -mt-1 font-mono tracking-wider">
                &lt;2 MIN SWE REF
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-surface'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openCommandPalette}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-xs text-dark-muted bg-dark-surface hover:bg-dark-variant border border-dark-border rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Quick search...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-dark-bg border border-dark-border rounded">
              ⌘K
            </kbd>
          </button>
          <StreakBadge streakDays={streakDays} />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-surface"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b border-dark-border bg-dark-surface p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 font-semibold'
                    : 'text-dark-muted hover:text-dark-text hover:bg-dark-variant'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
