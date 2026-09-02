'use client';

import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { seedCourses } from '@/lib/seed';
import { CourseCard } from '@/components/course/CourseCard';

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16 font-sans">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-ochre/10 text-ochre border border-ochre/25">
            <BookOpen className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-paper-text font-sans">
            Curated Study Tracks
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-paper-muted font-mono max-w-2xl leading-relaxed">
          Structured, ordered tracks covering core architecture and systems fundamentals. Progress automatically synchronizes with your personal learning habit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {seedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-paper-border bg-paper-card flex flex-col sm:flex-row items-center justify-between gap-4 font-mono shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xs font-semibold text-paper-text flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-ochre" />
            <span>Automated Track Curation</span>
          </h3>
          <p className="text-[11px] text-paper-muted">
            New study playlists are assembled from verified concepts based on cognitive progression.
          </p>
        </div>
      </div>
    </div>
  );
}
