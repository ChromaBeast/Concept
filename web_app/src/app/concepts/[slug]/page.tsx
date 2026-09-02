'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams, notFound, useRouter } from 'next/navigation';
import { Building2, Sparkles } from 'lucide-react';
import { getSeedConceptBySlug, seedCourses, allSeedConcepts } from '@/lib/seed';
import { CATEGORY_META } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ConceptHeader } from '@/components/concept/ConceptHeader';
import { CodeBlock } from '@/components/concept/CodeBlock';
import { PitfallBox } from '@/components/concept/PitfallBox';
import { InterviewBox } from '@/components/concept/InterviewBox';
import { QuickCheckList } from '@/components/concept/QuickCheck';
import { RelatedConcepts } from '@/components/concept/RelatedConcepts';
import { NextInCourseBar } from '@/components/concept/NextInCourseBar';

function ConceptDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showUndo } = useToast();

  const slug = params?.slug as string;
  const courseSlug = searchParams?.get('course');

  const concept = getSeedConceptBySlug(slug);
  const course = courseSlug ? seedCourses.find((c) => c.slug === courseSlug) : null;

  const [bookmarked, setBookmarked] = useState(false);
  const [learned, setLearned] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  useEffect(() => {
    if (!concept) return;
    const updateState = () => {
      setBookmarked(storage.isBookmarked(concept.id));
      setLearned(storage.isLearned(concept.id));
      setCustomImage(storage.getCustomImages()[concept.id] || null);
    };
    updateState();
    window.addEventListener('concept_storage_updated', updateState);
    return () => window.removeEventListener('concept_storage_updated', updateState);
  }, [concept]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    if (!concept) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      const list = course
        ? course.conceptIds.map((id) => allSeedConcepts.find((c) => c.id === id)).filter(Boolean)
        : allSeedConcepts;
      const idx = list.findIndex((c) => c?.id === concept.id);
      if (idx === -1) return;

      if (e.key === 'ArrowRight' && idx < list.length - 1) {
        const next = list[idx + 1];
        if (next) router.push(`/concepts/${next.slug}${course ? `?course=${course.slug}` : ''}`);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        const prev = list[idx - 1];
        if (prev) router.push(`/concepts/${prev.slug}${course ? `?course=${course.slug}` : ''}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [concept, course, router]);

  if (!concept) return notFound();

  const catMeta = CATEGORY_META[concept.category] || CATEGORY_META.dsa;
  const heroImageToDisplay = customImage || concept.heroImageUrl;

  const handleToggleBookmark = () => {
    const was = bookmarked;
    setBookmarked(storage.toggleBookmark(concept.id));
    if (was) {
      showUndo('Bookmark removed', () => {
        storage.toggleBookmark(concept.id);
        setBookmarked(true);
      });
    }
  };

  const handleToggleLearned = () => {
    const was = learned;
    setLearned(storage.toggleLearned(concept.id));
    if (was) {
      showUndo('Marked as unlearned', () => {
        storage.toggleLearned(concept.id);
        setLearned(true);
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Breadcrumbs
          items={
            course
              ? [
                  { label: 'Courses', href: '/courses' },
                  { label: course.title, href: `/courses/${course.slug}` },
                  { label: concept.title },
                ]
              : [
                  { label: 'Browse', href: '/browse' },
                  { label: catMeta.label, href: `/browse?category=${concept.category}` },
                  { label: concept.title },
                ]
          }
        />
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-dark-muted font-mono">
          <span>Flip with</span>
          <kbd className="px-1.5 py-0.5 bg-dark-surface border border-dark-border rounded">?</kbd>
          <kbd className="px-1.5 py-0.5 bg-dark-surface border border-dark-border rounded">?</kbd>
        </div>
      </div>

      <article
        className="rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-8 space-y-7 shadow-sm relative overflow-hidden"
        style={{ borderTopColor: catMeta.color, borderTopWidth: '4px' }}
      >
        <ConceptHeader
          category={concept.category}
          difficulty={concept.difficulty}
          estimatedReadSeconds={concept.estimatedReadSeconds}
          bookmarked={bookmarked}
          learned={learned}
          onToggleBookmark={handleToggleBookmark}
          onToggleLearned={handleToggleLearned}
        />

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark-text">{concept.title}</h1>
          <p className="text-sm sm:text-base text-dark-muted leading-relaxed">{concept.oneLiner}</p>
        </div>

        <section className="space-y-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Definition</h2>
          <p className="text-base sm:text-lg font-medium text-dark-text leading-relaxed">{concept.body.definition}</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Why It Matters On The Job</h2>
          <p className="text-sm sm:text-base text-dark-muted leading-relaxed">{concept.body.whyItMatters}</p>
        </section>

        {concept.visualAid && heroImageToDisplay && (
          <div className="rounded-xl overflow-hidden border border-dark-border bg-dark-surface my-4">
            <div className="relative w-full h-56 sm:h-72">
              <Image src={heroImageToDisplay} alt={concept.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 700px" />
            </div>
            {concept.imagePrompt && (
              <div className="p-2.5 text-[11px] text-dark-muted bg-dark-surface/90 border-t border-dark-border italic flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-400 flex-shrink-0" />
                <span>Visual Brief: {concept.imagePrompt}</span>
              </div>
            )}
          </div>
        )}

        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Code / Concrete Scenario</h2>
          <CodeBlock code={concept.body.example} title={`${concept.title} snippet`} />
        </section>

        <div className="space-y-3 pt-2">
          <PitfallBox pitfall={concept.body.commonPitfall} />
          <InterviewBox interviewAngle={concept.body.interviewAngle} />
        </div>

        <QuickCheckList quickChecks={concept.body.quickChecks} />

        {concept.askedByCompanies && concept.askedByCompanies.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-dark-border/50 text-xs text-dark-muted">
            <Building2 className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-medium text-dark-text">Asked in Interviews at:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {concept.askedByCompanies.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded bg-dark-surface border border-dark-border text-[11px]">{c}</span>
              ))}
            </div>
          </div>
        )}

        <RelatedConcepts relatedConceptIds={concept.relatedConceptIds} />
      </article>

      {course && <NextInCourseBar course={course} currentConceptId={concept.id} />}
    </div>
  );
}

export default function ConceptDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dark-muted">Loading concept...</div>}>
      <ConceptDetailContent />
    </Suspense>
  );
}
