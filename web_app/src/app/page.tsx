'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Flame, Compass } from 'lucide-react';
import { allSeedConcepts, seedCourses } from '@/lib/seed';
import { CATEGORY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { Category } from '@/lib/types';
import { ConceptCard } from '@/components/concept/ConceptCard';
import { CourseCard } from '@/components/course/CourseCard';
import { ReadTimeBadge } from '@/components/ui/ReadTimeBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const [learnedCount, setLearnedCount] = useState(0);
  const [streak, setStreak] = useState({ streakDays: 4, lastActiveDate: '' });

  // Pick daily concept based on day of year
  const dailyConcept = allSeedConcepts[0];
  const trendingConcepts = allSeedConcepts.slice(0, 6);
  const featuredCourse = seedCourses[0];

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

  useEffect(() => {
    const updateStats = () => {
      setLearnedCount(storage.getLearned().length);
      setStreak(storage.getStreak());
    };
    updateStats();
    window.addEventListener('concept_storage_updated', updateStats);
    return () => window.removeEventListener('concept_storage_updated', updateStats);
  }, []);

  return (
    <div className="space-y-10 pb-8">
      {/* Daily Concept Hero Banner */}
      <section className="relative rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-dark-card to-dark-card p-6 sm:p-8 overflow-hidden shadow-lg shadow-brand-500/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/40">
                <Sparkles className="w-3.5 h-3.5" /> Concept of the Day
              </span>
              <Badge colorHex={CATEGORY_META[dailyConcept.category].color}>
                {CATEGORY_META[dailyConcept.category].label}
              </Badge>
              <ReadTimeBadge seconds={dailyConcept.estimatedReadSeconds} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark-text">
              {dailyConcept.title}
            </h1>

            <p className="text-sm sm:text-base text-dark-muted leading-relaxed">
              {dailyConcept.oneLiner}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link href={`/concepts/${dailyConcept.slug}`}>
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                Read in 90s <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-dark-border bg-dark-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-dark-text">{streak.streakDays} Days</div>
            <div className="text-xs text-dark-muted">Active Streak</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-dark-border bg-dark-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-dark-text">{learnedCount}</div>
            <div className="text-xs text-dark-muted">Concepts Learned</div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-xl border border-dark-border bg-dark-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-dark-text">{allSeedConcepts.length}</div>
            <div className="text-xs text-dark-muted">Reference Library</div>
          </div>
        </div>
      </section>

      {/* Category Chips Row */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-text">Explore Categories</h2>
          <Link href="/browse" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
            View All &rarr;
          </Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <Link key={cat} href={`/browse?category=${cat}`}>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dark-border bg-dark-card hover:border-brand-500/40 text-xs font-medium text-dark-muted hover:text-dark-text whitespace-nowrap transition-colors">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span>{meta.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Continue Learning Course */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-text">Featured Learning Path</h2>
          <Link href="/courses" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
            Browse Paths &rarr;
          </Link>
        </div>
        <div className="max-w-2xl">
          <CourseCard course={featuredCourse} />
        </div>
      </section>

      {/* Trending Concepts Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-dark-text">Trending & High-Yield Concepts</h2>
            <p className="text-xs text-dark-muted">Frequently asked in senior tech interviews</p>
          </div>
          <Link href="/browse" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
            See all ({allSeedConcepts.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>
    </div>
  );
}
