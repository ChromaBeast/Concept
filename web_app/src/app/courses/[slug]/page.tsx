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
import { Button } from '@/components/ui/Button';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-16">
      <Breadcrumbs
        items={[
          { label: 'Courses', href: '/courses' },
          { label: course.title },
        ]}
      />

      <div className="p-6 sm:p-8 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-6">
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <Badge colorHex={catMeta.color}>{catMeta.label}</Badge>
          <span className={`px-2 py-0.5 rounded border ${diffMeta.badgeClass}`}>
            {diffMeta.label}
          </span>
          <span className="flex items-center gap-1 text-dark-muted">
            <Clock className="w-3.5 h-3.5 text-electric" />
            {formatMinutesTotal(course.totalReadSeconds)} total read time
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            {course.title}
          </h1>
          <p className="text-sm sm:text-base text-dark-muted leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-surface border border-obsidian-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-electric" />
              Track Progress
            </span>
            <span className="text-dark-muted">
              {progress.completed} of {progress.total} completed ({progress.percentage}%)
            </span>
          </div>
          <ProgressBar value={progress.percentage} colorHex={catMeta.color} />
        </div>

        {firstUnlearned && (
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="text-xs text-dark-muted truncate font-mono">
              {progress.isCompleted ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> You have completed this entire playlist!
                </span>
              ) : (
                <span>
                  Next up: <strong className="text-white">{firstUnlearned.title}</strong>
                </span>
              )}
            </div>

            <Link href={`/concepts/${firstUnlearned.slug}?course=${course.slug}`}>
              <Button size="md" className="flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-current mr-1" />
                {progress.completed === 0 ? 'Start Course' : 'Continue Learning'}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
          <span>Curated Concept Sequence</span>
          <span className="text-xs text-dark-muted font-normal">
            ({concepts.length} items)
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
