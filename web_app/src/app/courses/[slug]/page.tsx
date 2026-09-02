'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Play, CheckCircle2, Layers, Clock } from 'lucide-react';
import { getSeedCourseBySlug, allSeedConcepts } from '@/lib/seed';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { calculateCourseProgress, formatMinutesTotal } from '@/lib/utils';
import { CourseListItem } from '@/components/course/CourseListItem';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const course = getSeedCourseBySlug(slug);

  const [learnedIds, setLearnedIds] = useState<string[]>([]);

  useEffect(() => {
    const updateLearned = () => {
      setLearnedIds(storage.getLearned());
    };
    updateLearned();
    window.addEventListener('concept_storage_updated', updateLearned);
    return () => window.removeEventListener('concept_storage_updated', updateLearned);
  }, []);

  if (!course) {
    return notFound();
  }

  const catMeta = CATEGORY_META[course.primaryCategory] || CATEGORY_META.system_design;
  const diffMeta = DIFFICULTY_META[course.difficulty] || DIFFICULTY_META.intermediate;
  const progress = calculateCourseProgress(course.conceptIds, learnedIds);

  const concepts = course.conceptIds
    .map((id) => allSeedConcepts.find((c) => c.id === id))
    .filter((c) => Boolean(c));

  const firstUnlearned = concepts.find((c) => c && !learnedIds.includes(c.id)) || concepts[0];

  const handleToggleLearned = (conceptId: string) => {
    storage.toggleLearned(conceptId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-16 font-sans">
      <Breadcrumbs
        items={[
          { label: 'Tracks', href: '/courses' },
          { label: course.title },
        ]}
      />

      <div className="p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card space-y-6 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <Badge colorHex={catMeta.color}>{catMeta.label}</Badge>
          <span className="px-2 py-0.5 rounded border border-paper-border bg-paper-surface text-paper-muted">
            {diffMeta.label}
          </span>
          <span className="flex items-center gap-1 text-paper-muted ml-auto">
            <Clock className="w-3.5 h-3.5 text-ochre" />
            {formatMinutesTotal(course.totalReadSeconds)} read time
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-paper-text font-sans">
            {course.title}
          </h1>
          <p className="text-sm sm:text-base text-paper-muted leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-paper-surface border border-paper-border space-y-3 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-paper-text flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-ochre" />
              Track Progress
            </span>
            <span className="text-paper-muted">
              {progress.completed} of {progress.total} completed ({progress.percentage}%)
            </span>
          </div>
          <ProgressBar value={progress.percentage} colorHex={catMeta.color} />
        </div>

        {firstUnlearned && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-paper-border">
            <div className="text-xs text-paper-muted truncate font-mono">
              {progress.isCompleted ? (
                <span className="text-teal font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Playlist 100% completed!
                </span>
              ) : (
                <span>
                  Next up: <strong className="text-paper-text font-semibold">{firstUnlearned.title}</strong>
                </span>
              )}
            </div>

            <Link href={`/concepts/${firstUnlearned.slug}?course=${course.slug}`} className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ochre hover:bg-ochre-dim text-white text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{progress.completed === 0 ? 'Start Track' : 'Continue Learning'}</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-paper-text flex items-center gap-2 font-mono uppercase tracking-wider">
          <span>Concept Sequence</span>
          <span className="text-xs text-paper-muted font-normal">
            ({concepts.length} concepts)
          </span>
        </h2>

        <div className="space-y-2.5">
          {concepts.map((concept, index) => {
            if (!concept) return null;
            return (
              <CourseListItem
                key={concept.id}
                concept={concept}
                index={index}
                isLearned={learnedIds.includes(concept.id)}
                courseSlug={course.slug}
                onToggleLearned={handleToggleLearned}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
