'use client';

import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { seedCourses } from '@/lib/seed';
import { CourseCard } from '@/components/course/CourseCard';

export default function CoursesPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/30">
            <BookOpen className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark-text">
            Curated Learning Paths
          </h1>
        </div>
        <p className="text-sm text-dark-muted max-w-2xl leading-relaxed">
          Structured, ordered playlists of existing concepts. Progress is automatically synced across all concepts in your global learning log.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-dark-border bg-dark-card/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-semibold text-dark-text flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
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
