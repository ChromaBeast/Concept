'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Flame, Compass, Sparkles } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { CATEGORY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { Concept, Course, Category } from '@/lib/types';
import { ConceptCard } from '@/components/concept/ConceptCard';
import { CourseCard } from '@/components/course/CourseCard';
import { ReadTimeBadge } from '@/components/ui/ReadTimeBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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

export function LearningDashboard() {
  const [dailyConcept, setDailyConcept] = useState<Concept | null>(null);
  const [trending, setTrending] = useState<Concept[]>([]);
  const [featuredCourse, setFeaturedCourse] = useState<Course | null>(null);
  const [learnedCount, setLearnedCount] = useState(0);
  const [streak, setStreak] = useState({ streakDays: 4, lastActiveDate: '' });

  useEffect(() => {
    const load = async () => {
      const daily = await dataService.getDailyConcept();
      const list = await dataService.getConcepts({ limit: 6 });
      const courses = await dataService.getCourses({ limit: 1 });
      setDailyConcept(daily);
      setTrending(list);
      if (courses.length > 0) setFeaturedCourse(courses[0]);
      setLearnedCount(storage.getLearned().length);
      setStreak(storage.getStreak());
    };
    load();
  }, []);

  if (!dailyConcept) {
    return <div className="p-12 text-center text-dark-muted font-mono">Loading dynamic curriculum...</div>;
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Daily Concept Hero Banner */}
      <section className="relative rounded-3xl border border-electric/30 bg-gradient-to-br from-electric/10 via-obsidian-card to-obsidian-card p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-electric text-obsidian-bg uppercase">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Concept of the Day
              </span>
              <Badge colorHex={CATEGORY_META[dailyConcept.category]?.color}>
                {CATEGORY_META[dailyConcept.category]?.label}
              </Badge>
              <ReadTimeBadge seconds={dailyConcept.estimatedReadSeconds} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {dailyConcept.title}
            </h2>

            <p className="text-sm sm:text-base text-dark-muted leading-relaxed">
              {dailyConcept.oneLiner}
            </p>
          </div>

          <Link href={`/concepts/${dailyConcept.slug}`}>
            <Button size="lg" className="w-full sm:w-auto font-bold bg-electric hover:bg-electric-400 text-obsidian-bg">
              Read in 90s <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-dark-text">{streak.streakDays} Days</div>
            <div className="text-xs text-dark-muted font-mono">Active Streak</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-dark-text">{learnedCount}</div>
            <div className="text-xs text-dark-muted font-mono">Mastered</div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl border border-obsidian-border bg-obsidian-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-electric/10 border border-electric/30 flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-electric" />
          </div>
          <div>
            <div className="text-lg font-bold text-dark-text">197+</div>
            <div className="text-xs text-dark-muted font-mono">Reference Library</div>
          </div>
        </div>
      </section>

      {/* Category Chips Row */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-dark-text uppercase tracking-wider">Explore Disciplines</h3>
          <Link href="/browse" className="text-xs text-electric hover:underline font-mono">
            View All &rarr;
          </Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <Link key={cat} href={`/browse?category=${cat}`}>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-obsidian-border bg-obsidian-card hover:border-electric/40 text-xs font-medium text-dark-muted hover:text-dark-text whitespace-nowrap transition-colors">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta?.color }} />
                  <span>{meta?.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Learning Path */}
      {featuredCourse && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-dark-text uppercase tracking-wider">Featured Track</h3>
            <Link href="/courses" className="text-xs text-electric hover:underline font-mono">
              Browse Tracks &rarr;
            </Link>
          </div>
          <div className="max-w-2xl">
            <CourseCard course={featuredCourse} />
          </div>
        </section>
      )}

      {/* Trending Concepts Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-dark-text uppercase tracking-wider">Trending Concepts</h3>
            <p className="text-xs text-dark-muted font-mono">Frequently asked in senior tech interview rounds</p>
          </div>
          <Link href="/browse" className="text-xs text-electric hover:underline font-mono">
            See all catalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>
    </div>
  );
}
