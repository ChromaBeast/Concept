'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, ShieldCheck, LogOut, Bookmark, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export function UserNavDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-paper-border bg-paper-card hover:border-ochre/40 transition-colors shadow-sm"
      >
        <div className="w-6 h-6 rounded-full bg-ochre text-white flex items-center justify-center text-xs font-bold font-mono">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-mono font-medium text-paper-text hidden sm:inline-block max-w-[80px] truncate">
          {user.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-paper-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-2xl border border-paper-border bg-paper-card shadow-xl p-1.5 z-50 font-mono text-xs animate-fadeIn"
        >
          <div className="px-3 py-2 border-b border-paper-border/70 mb-1">
            <div className="font-bold text-paper-text truncate">{user.name}</div>
            <div className="text-[11px] text-paper-muted truncate">{user.email}</div>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-paper-text hover:bg-paper-surface transition-colors"
            >
              <User className="w-3.5 h-3.5 text-ochre" />
              <span>My Profile &amp; Habit</span>
            </Link>

            <Link
              href="/bookmarks"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-paper-text hover:bg-paper-surface transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-ochre" />
              <span>Saved Bookmarks</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-paper-text hover:bg-paper-surface transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-ochre" />
              <span>Admin Console</span>
            </Link>
          </div>

          <div className="pt-1 mt-1 border-t border-paper-border/70">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
