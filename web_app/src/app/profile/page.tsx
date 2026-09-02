'use client';

import React, { useState, useEffect } from 'react';
import { Flame, BookOpen, Clock, Bookmark, CheckCircle2 } from 'lucide-react';
import { allSeedConcepts } from '@/lib/seed';
import { storage } from '@/lib/storage';
import { CATEGORY_META } from '@/lib/constants';
import { Category } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function ProfilePage() {
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

  const categories: Category[] = [
    'dsa',
    'system_design',
    'databases',
    'operating_systems',
    'networking',
    'oop_design_patterns',
    'backend',
    'devops_infra',
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark-text">
          Learning Profile & Progress
        </h1>
        <p className="text-sm text-dark-muted">
          Your daily streak, category mastery, and reading velocity metrics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-dark-border bg-dark-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <Flame className="w-4 h-4 fill-current" /> Streak
          </div>
          <div className="text-2xl font-bold text-dark-text">{streak.streakDays} Days</div>
          <div className="text-[11px] text-dark-muted">Continuous learning</div>
        </div>

        <div className="p-4 rounded-xl border border-dark-border bg-dark-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <BookOpen className="w-4 h-4" /> Learned
          </div>
          <div className="text-2xl font-bold text-dark-text">{learnedIds.length}</div>
          <div className="text-[11px] text-dark-muted">Of {allSeedConcepts.length} concepts</div>
        </div>

        <div className="p-4 rounded-xl border border-dark-border bg-dark-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold">
            <Clock className="w-4 h-4" /> Time Spent
          </div>
          <div className="text-2xl font-bold text-dark-text">{totalMinutes}m</div>
          <div className="text-[11px] text-dark-muted">Dense reading time</div>
        </div>

        <div className="p-4 rounded-xl border border-dark-border bg-dark-card space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
            <Bookmark className="w-4 h-4" /> Saved
          </div>
          <div className="text-2xl font-bold text-dark-text">{bookmarksCount}</div>
          <div className="text-[11px] text-dark-muted">Bookmarked cards</div>
        </div>
      </div>

      {/* Weekly Activity Tracker */}
      <div className="p-6 rounded-2xl border border-dark-border bg-dark-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-dark-text flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> Weekly Activity
          </h2>
          <span className="text-xs text-dark-muted font-mono">{streak.streakDays} day current streak</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((d, i) => {
            const active = i >= 3; // Simulated activity
            return (
              <div
                key={d}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  active
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-dark-surface border-dark-border text-dark-muted'
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

      {/* Category Mastery Breakdown */}
      <div className="p-6 rounded-2xl border border-dark-border bg-dark-card space-y-4">
        <h2 className="text-sm font-semibold text-dark-text">Discipline Mastery Breakdown</h2>

        <div className="space-y-3.5">
          {categories.map((cat) => {
            const catConcepts = allSeedConcepts.filter((c) => c.category === cat);
            if (catConcepts.length === 0) return null;
            const learnedCatCount = catConcepts.filter((c) => learnedIds.includes(c.id)).length;
            const percentage = Math.round((learnedCatCount / catConcepts.length) * 100);
            const meta = CATEGORY_META[cat];

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                    <span className="font-medium text-dark-text">{meta.label}</span>
                  </div>
                  <span className="text-dark-muted font-mono">
                    {learnedCatCount}/{catConcepts.length} ({percentage}%)
                  </span>
                </div>
                <ProgressBar value={percentage} colorHex={meta.color} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
