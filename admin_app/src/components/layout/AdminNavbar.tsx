'use client';

import React from 'react';
import { Database, ShieldCheck, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { APPWRITE_CONFIG } from '@/lib/appwrite';
import { useAuth } from '@/lib/authContext';

export function AdminNavbar() {
  const { user, logout } = useAuth();

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

        {/* Right: Auth Profile, Connection Badge & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal/25 bg-teal/10 text-teal text-xs font-mono select-none">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span>Appwrite:</span>
            <span className="font-bold">{APPWRITE_CONFIG.projectId.slice(0, 8)}...</span>
          </div>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-paper-border">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-paper-text font-sans">{user.name}</span>
                <span className="text-[10px] text-paper-muted font-mono">{user.email}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Sign out of Admin Console"
                className="w-8 h-8 rounded-xl border border-paper-border bg-paper-card hover:bg-rose-500/10 text-paper-muted hover:text-rose-500 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
