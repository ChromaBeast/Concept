'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookOpen, Search, Bookmark, User, ShieldCheck, Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { useAuth } from '@/lib/authContext';
import { StreakBadge } from '../ui/StreakBadge';

const NAV_ITEMS = [
  { href: '/browse', label: 'Browse', icon: Compass },
  { href: '/courses', label: 'Paths', icon: BookOpen },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/bookmarks', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/admin', label: 'Admin', icon: ShieldCheck },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
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
    <header className="sticky top-0 z-50 w-full border-b border-obsidian-border bg-obsidian-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-electric flex items-center justify-center font-black text-obsidian-bg text-base shadow-md shadow-electric/20 group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-electric transition-colors uppercase">
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
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors duration-150',
                    isActive
                      ? 'bg-electric/15 text-electric border border-electric/30'
                      : 'text-dark-muted hover:text-dark-text hover:bg-obsidian-card'
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
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-xs text-dark-muted bg-obsidian-card hover:bg-obsidian-variant border border-obsidian-border rounded-lg transition-colors font-mono"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-obsidian-bg border border-obsidian-border rounded">
              ⌘K
            </kbd>
          </button>

          <StreakBadge streakDays={streakDays} />

          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-obsidian-border bg-obsidian-card text-xs font-mono font-bold text-dark-text hover:border-electric/40"
            >
              <div className="w-5 h-5 rounded-full bg-electric text-obsidian-bg flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline-block truncate max-w-[90px]">{user.name}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-obsidian-border bg-obsidian-card text-xs font-mono font-semibold text-dark-text hover:bg-obsidian-variant transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-electric/10"
              >
                Get Started
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-dark-muted hover:text-dark-text hover:bg-obsidian-card"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b border-obsidian-border bg-obsidian-surface p-4 space-y-1 font-mono">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-electric/15 text-electric'
                    : 'text-dark-muted hover:text-dark-text hover:bg-obsidian-card'
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
