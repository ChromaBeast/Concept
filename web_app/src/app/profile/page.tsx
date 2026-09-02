'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, BookOpen, Clock, Bookmark, CheckCircle2, LogOut, LogIn, User } from 'lucide-react';
import { allSeedConcepts } from '@/lib/seed';
import { storage } from '@/lib/storage';
import { CATEGORY_META } from '@/lib/constants';
import { Category } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/lib/authContext';

const CATEGORIES: Category[] = [
  'dsa',
  'system_design',
  'databases',
  'operating_systems',
  'networking',
  'oop_design_patterns',
  'backend',
  'devops_infra',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState({ streakDays: 4, lastActiveDate: '' });
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  useEffect(() => {
    const update = () => {
      setStreak(storage.getStreak());
      setLearnedIds(storage.getLearned());
      setBookmarksCount(storage.getBookmarks().length);
    };
    update();
    window.addEventListener('concept_storage_updated', update);
    return () => window.removeEventListener('concept_storage_updated', update);
  }, []);

  const totalReadSeconds = allSeedConcepts
    .filter((c) => learnedIds.includes(c.id))
    .reduce((acc, c) => acc + c.estimatedReadSeconds, 0);

  const totalMinutes = Math.ceil(totalReadSeconds / 60);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Account Info Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl border border-obsidian-border bg-obsidian-card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-electric text-obsidian-bg flex items-center justify-center font-black text-lg">
            {user ? user.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {user ? user.name : 'Guest Engineer'}
            </h1>
            <p className="text-xs text-dark-muted font-mono">
              {user ? user.email : 'Local Session — Sign in to sync progress to cloud'}
            </p>
          </div>
        </div>

        {user ? (
          <button
            type="button"
            onClick={() => logout()}
            className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-electric/10"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Sync</span>
          </Link>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold font-mono">
            <Flame className="w-4 h-4 fill-current" /> STREAK
          </div>
          <div className="text-2xl font-bold text-white">{streak.streakDays} Days</div>
          <div className="text-[11px] text-dark-muted font-mono">Active daily habit</div>
        </div>

        <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono">
            <BookOpen className="w-4 h-4" /> LEARNED
          </div>
          <div className="text-2xl font-bold text-white">{learnedIds.length}</div>
          <div className="text-[11px] text-dark-muted font-mono">Of 197+ concepts</div>
        </div>

        <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-electric font-semibold font-mono">
            <Clock className="w-4 h-4" /> TIME SPENT
          </div>
          <div className="text-2xl font-bold text-white">{totalMinutes}m</div>
          <div className="text-[11px] text-dark-muted font-mono">Dense reading time</div>
        </div>

        <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold font-mono">
            <Bookmark className="w-4 h-4" /> SAVED
          </div>
          <div className="text-2xl font-bold text-white">{bookmarksCount}</div>
          <div className="text-[11px] text-dark-muted font-mono">Bookmarked cards</div>
        </div>
      </div>

      {/* Weekly Activity Tracker */}
      <div className="p-6 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> Weekly Activity
          </h2>
          <span className="text-xs text-dark-muted font-mono">{streak.streakDays} day current streak</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((d, i) => {
            const active = i >= 3;
            return (
              <div
                key={d}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  active
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-obsidian-surface border-obsidian-border text-dark-muted'
                }`}
              >
                <span className="text-[11px] font-mono mb-1">{d}</span>
                {active ? (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-500/20" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-dark-sub" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discipline Mastery Breakdown */}
      <div className="p-6 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
          Discipline Mastery Breakdown
        </h2>

        <div className="space-y-3.5">
          {CATEGORIES.map((cat) => {
            const catConcepts = allSeedConcepts.filter((c) => c.category === cat);
            if (catConcepts.length === 0) return null;
            const learnedCatCount = catConcepts.filter((c) => learnedIds.includes(c.id)).length;
            const percentage = Math.round((learnedCatCount / catConcepts.length) * 100);
            const meta = CATEGORY_META[cat];

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta?.color }} />
                    <span className="font-medium text-dark-text">{meta?.label}</span>
                  </div>
                  <span className="text-dark-muted font-mono">
                    {learnedCatCount}/{catConcepts.length} ({percentage}%)
                  </span>
                </div>
                <ProgressBar value={percentage} colorHex={meta?.color} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
