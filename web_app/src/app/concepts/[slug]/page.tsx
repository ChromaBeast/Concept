'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, notFound, useRouter } from 'next/navigation';
import { dataService } from '@/lib/dataService';
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
import { ConceptHeroVisual } from '@/components/concept/ConceptHeroVisual';
import { ConceptCompaniesList } from '@/components/concept/ConceptCompaniesList';
import { Concept, Course } from '@/lib/types';

function ConceptDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showUndo } = useToast();

  const slug = params?.slug as string;
  const courseSlug = searchParams?.get('course');

  const [concept, setConcept] = useState<Concept | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [learned, setLearned] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const c = await dataService.getConceptBySlug(slug);
      setConcept(c);
      if (courseSlug) {
        const courses = await dataService.getCourses();
        const foundCourse = courses.find((crs) => crs.slug === courseSlug);
        setCourse(foundCourse || null);
      }
      setLoading(false);
    }
    loadData();
  }, [slug, courseSlug]);

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

  if (loading) {
    return <div className="p-16 text-center text-dark-muted font-mono">Loading reference...</div>;
  }

  if (!concept) {
    return notFound();
  }

  const heroImageToDisplay = customImage || concept.heroImageUrl;

  const handleToggleBookmark = () => {
    const next = storage.toggleBookmark(concept.id);
    setBookmarked(next);
  };

  const handleToggleLearned = () => {
    const next = storage.toggleLearned(concept.id);
    setLearned(next);
    if (next) {
      showUndo(`Marked "${concept.title}" as learned!`, () => {
        storage.toggleLearned(concept.id);
        setLearned(false);
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <Breadcrumbs
        items={[
          { label: 'Browse', href: '/browse' },
          { label: CATEGORY_META[concept.category]?.label || concept.category, href: `/browse?category=${concept.category}` },
          { label: concept.title },
        ]}
      />

      <article className="p-6 sm:p-8 rounded-3xl border border-obsidian-border bg-obsidian-card shadow-2xl space-y-6">
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{concept.title}</h1>
          <p className="text-sm sm:text-base text-dark-muted leading-relaxed">{concept.oneLiner}</p>
        </div>

        <section className="space-y-1.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric">[ 01 / DEFINITION ]</h2>
          <p className="text-base sm:text-lg font-medium text-dark-text leading-relaxed">{concept.body.definition}</p>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric">[ 02 / WHY IT MATTERS ]</h2>
          <p className="text-sm sm:text-base text-dark-muted leading-relaxed">{concept.body.whyItMatters}</p>
        </section>

        <ConceptHeroVisual
          title={concept.title}
          imageUrl={concept.visualAid ? heroImageToDisplay : null}
          imagePrompt={concept.imagePrompt}
        />

        <section className="space-y-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric">[ 03 / CODE & STRUCTURE ]</h2>
          <CodeBlock code={concept.body.example} title={`${concept.title} snippet`} />
        </section>

        <div className="space-y-3 pt-2">
          <PitfallBox pitfall={concept.body.commonPitfall} />
          <InterviewBox interviewAngle={concept.body.interviewAngle} />
        </div>

        <QuickCheckList quickChecks={concept.body.quickChecks} />
        <ConceptCompaniesList companies={concept.askedByCompanies} />
        <RelatedConcepts relatedConceptIds={concept.relatedConceptIds} />
      </article>

      {course && <NextInCourseBar course={course} currentConceptId={concept.id} />}
    </div>
  );
}

export default function ConceptDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dark-muted font-mono">Loading concept...</div>}>
      <ConceptDetailContent />
    </Suspense>
  );
}
