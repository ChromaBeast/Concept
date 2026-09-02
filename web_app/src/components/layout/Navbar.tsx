'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, Search, Bookmark, Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { useAuth } from '@/lib/authContext';
import { StreakBadge } from '../ui/StreakBadge';
import { ThemeToggle } from '../theme/ThemeToggle';
import { UserNavDropdown } from './UserNavDropdown';
import { Logo } from '../ui/Logo';

const NAV_ITEMS = [
  { href: '/browse', label: 'Browse', icon: Compass },
  { href: '/courses', label: 'Paths', icon: BookOpen },
  { href: '/bookmarks', label: 'Saved', icon: Bookmark },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(4);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

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
    <header className="sticky top-0 z-50 w-full border-b border-paper-border bg-paper-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Vector Optimized Logo */}
        <Logo size="md" />

        {/* Center: Animated Sliding Pill Navigation */}
        <nav
          className="hidden md:flex items-center p-1 rounded-full border border-paper-border bg-paper-surface/60 shadow-inner"
          onMouseLeave={() => setHoveredTab(null)}
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const isHovered = hoveredTab === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredTab(item.href)}
                className={cn(
                  'relative px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-colors duration-150 flex items-center gap-1.5 select-none',
                  isActive ? 'text-ochre font-bold' : 'text-paper-muted hover:text-paper-text'
                )}
              >
                {(isHovered || (!hoveredTab && isActive)) && (
                  <div
                    className="absolute inset-0 rounded-full bg-paper-card border border-paper-border shadow-sm -z-10 animate-fadeIn"
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Consolidated Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open Command Search"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-paper-muted bg-paper-surface hover:bg-paper-border/60 border border-paper-border rounded-full transition-colors font-mono shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-paper-card border border-paper-border rounded-md">
              ⌘K
            </kbd>
          </button>

          <StreakBadge streakDays={streakDays} />

          <ThemeToggle />

          {user ? (
            <UserNavDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-paper-muted hover:text-paper-text transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-full bg-ochre hover:bg-ochre-dim text-white text-xs font-bold font-mono tracking-wider transition-all shadow-sm"
              >
                Join
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-paper-muted hover:text-paper-text hover:bg-paper-surface"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-paper-border bg-paper-card p-4 space-y-1 font-mono animate-fadeIn">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-ochre/15 text-ochre font-bold'
                    : 'text-paper-muted hover:text-paper-text hover:bg-paper-surface'
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
