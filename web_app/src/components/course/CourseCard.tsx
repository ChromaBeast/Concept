'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Layers } from 'lucide-react';
import { Course } from '@/lib/types';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { calculateCourseProgress, formatMinutesTotal } from '@/lib/utils';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [progress, setProgress] = useState({ completed: 0, total: course.conceptIds.length, percentage: 0, isCompleted: false });

  const catMeta = CATEGORY_META[course.primaryCategory] || CATEGORY_META.system_design;
  const diffMeta = DIFFICULTY_META[course.difficulty] || DIFFICULTY_META.intermediate;

  useEffect(() => {
    const updateProgress = () => {
      const learned = storage.getLearned();
      setProgress(calculateCourseProgress(course.conceptIds, learned));
    };
    updateProgress();
    window.addEventListener('concept_storage_updated', updateProgress);
    return () => window.removeEventListener('concept_storage_updated', updateProgress);
  }, [course.conceptIds]);

  return (
    <Link href={`/courses/${course.slug}`} className="block group">
      <Card
        accentColor={catMeta.color}
        hoverable
        className="h-full flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge colorHex={catMeta.color}>{catMeta.label}</Badge>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${diffMeta.badgeClass}`}>
              {diffMeta.label}
            </span>
          </div>

          <h3 className="text-base font-semibold text-dark-text group-hover:text-brand-400 transition-colors mb-2">
            {course.title}
          </h3>

          <p className="text-xs text-dark-muted leading-relaxed line-clamp-2 mb-4">
            {course.description}
          </p>
        </div>

        <div className="pt-4 border-t border-dark-border/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-dark-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              {course.conceptIds.length} concepts
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-dark-muted" />
              {formatMinutesTotal(course.totalReadSeconds)} total
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-dark-muted">
              <span>{progress.completed} of {progress.total} learned</span>
              {progress.isCompleted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Completed
                </span>
              ) : (
                <span className="font-mono">{progress.percentage}%</span>
              )}
            </div>
            <ProgressBar value={progress.percentage} colorHex={catMeta.color} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
