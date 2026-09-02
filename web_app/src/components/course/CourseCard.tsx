'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Layers, ArrowRight } from 'lucide-react';
import { Course } from '@/lib/types';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { calculateCourseProgress, formatMinutesTotal } from '@/lib/utils';
import { ProgressBar } from '../ui/ProgressBar';
import { SpotlightCard } from '@/components/animations';

export interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const catMeta = CATEGORY_META[course.primaryCategory] || CATEGORY_META.system_design;
  const diffMeta = DIFFICULTY_META[course.difficulty] || DIFFICULTY_META.intermediate;

  const [learnedIds, setLearnedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const update = () => {
      setLearnedIds(storage.getLearned());
    };
    update();
    window.addEventListener('concept_storage_updated', update);
    return () => window.removeEventListener('concept_storage_updated', update);
  }, []);

  const progress = calculateCourseProgress(course.conceptIds, learnedIds);

  return (
    <Link href={`/courses/${course.slug}`} className="block group h-full">
      <SpotlightCard
        spotlightColor={`${catMeta.color}22`}
        radius={260}
        className={`h-full flex flex-col justify-between p-6 rounded-2xl border border-paper-border bg-paper-card hover:border-ochre/40 transition-all duration-150 shadow-sm ${className || ''}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span
              className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${catMeta.color}15`,
                color: catMeta.color,
                border: `1px solid ${catMeta.color}35`,
              }}
            >
              {catMeta.label}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-paper-border bg-paper-surface text-paper-muted">
              {diffMeta.label}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-paper-text group-hover:text-ochre transition-colors mb-1.5 font-sans">
              {course.title}
            </h3>
            <p className="text-xs text-paper-muted leading-relaxed line-clamp-2 font-sans">
              {course.description}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-paper-border space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-paper-muted font-mono">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-ochre" />
                {progress.completed}/{progress.total} concepts
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-ochre" />
                {formatMinutesTotal(course.totalReadSeconds)}
              </span>
            </div>
            <ProgressBar value={progress.percentage} colorHex={catMeta.color} />
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-ochre font-bold group-hover:translate-x-0.5 transition-transform">
            <span>{progress.completed === 0 ? 'Start Track' : 'Continue Track'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
