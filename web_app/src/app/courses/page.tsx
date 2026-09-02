'use client';

import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { seedCourses } from '@/lib/seed';
import { CourseCard } from '@/components/course/CourseCard';

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-electric/10 text-electric border border-electric/30">
            <BookOpen className="w-4 h-4" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
            Curated Learning Paths
          </h1>
        </div>
        <p className="text-sm text-dark-muted font-mono max-w-2xl leading-relaxed">
          Structured, ordered playlists of existing concepts. Progress is automatically synced across all concepts in your global learning log.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-obsidian-border bg-obsidian-card flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-semibold text-white flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-electric" />
            Automated Course Generation
          </h3>
          <p className="text-xs text-dark-muted">
            New courses are automatically assembled from published concept pools by our curation pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
