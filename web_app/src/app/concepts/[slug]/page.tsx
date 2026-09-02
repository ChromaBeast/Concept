'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { dataService } from '@/lib/dataService';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { ConceptHeaderEditorial } from '@/components/concept/ConceptHeaderEditorial';
import { ConceptSidebar } from '@/components/concept/ConceptSidebar';
import { CodeBlock } from '@/components/concept/CodeBlock';
import { PitfallBox } from '@/components/concept/PitfallBox';
import { InterviewBox } from '@/components/concept/InterviewBox';
import { QuickCheckList } from '@/components/concept/QuickCheck';
import { RelatedConcepts } from '@/components/concept/RelatedConcepts';
import { NextInCourseBar } from '@/components/concept/NextInCourseBar';
import { ConceptHeroVisual } from '@/components/concept/ConceptHeroVisual';
import { Concept, Course } from '@/lib/types';

function ConceptDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { showUndo } = useToast();

  const slug = params?.slug as string;
  const courseSlug = searchParams?.get('course');

  const [concept, setConcept] = useState<Concept | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [learned, setLearned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const c = await dataService.getConceptBySlug(slug);
      setConcept(c);
      if (courseSlug) {
        const courses = await dataService.getCourses();
        setCourse(courses.find((crs) => crs.slug === courseSlug) || null);
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
    };
    updateState();
    window.addEventListener('concept_storage_updated', updateState);
    return () => window.removeEventListener('concept_storage_updated', updateState);
  }, [concept]);

  if (loading) {
    return <div className="p-16 text-center text-dark-muted font-mono">Loading reference...</div>;
  }

  if (!concept) return notFound();

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
    <div className="pb-24">
      <ConceptHeaderEditorial
        title={concept.title}
        oneLiner={concept.oneLiner}
        category={concept.category}
        difficulty={concept.difficulty}
        estimatedReadSeconds={concept.estimatedReadSeconds}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Main Editorial Content Column */}
        <main className="flex-1 space-y-8 min-w-0">
          <section id="definition" className="p-6 sm:p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-3 shadow-xl">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric">[ 01 / DEFINITION ]</h2>
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">{concept.body.definition}</p>
          </section>

          <section id="why-it-matters" className="p-6 sm:p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-3 shadow-xl">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric">[ 02 / WHY IT MATTERS ]</h2>
            <p className="text-sm sm:text-base text-dark-muted leading-relaxed">{concept.body.whyItMatters}</p>
          </section>

          {concept.visualAid && (
            <ConceptHeroVisual title={concept.title} imageUrl={concept.heroImageUrl} imagePrompt={concept.imagePrompt} />
          )}

          <section id="code-example" className="p-6 sm:p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-4 shadow-xl">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric">[ 03 / CODE & SCENARIO ]</h2>
            <CodeBlock code={concept.body.example} title={`${concept.title} snippet`} />
          </section>

          <section id="pitfall" className="space-y-4">
            <PitfallBox pitfall={concept.body.commonPitfall} />
          </section>

          <section id="interview-angle" className="space-y-4">
            <InterviewBox interviewAngle={concept.body.interviewAngle} />
          </section>

          <section id="quick-checks" className="p-6 sm:p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-4 shadow-xl">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-electric">[ 06 / QUICK CHECK DRILL ]</h2>
            <QuickCheckList quickChecks={concept.body.quickChecks} />
          </section>

          <section id="related" className="pt-4">
            <RelatedConcepts relatedConceptIds={concept.relatedConceptIds} />
          </section>
        </main>

        {/* Right Sticky Sidebar */}
        <div className="hidden lg:block w-[320px] flex-shrink-0">
          <div className="sticky top-20">
            <ConceptSidebar
              category={concept.category}
              difficulty={concept.difficulty}
              estimatedReadSeconds={concept.estimatedReadSeconds}
              bookmarked={bookmarked}
              learned={learned}
              companies={concept.askedByCompanies}
              course={course}
              onToggleBookmark={handleToggleBookmark}
              onToggleLearned={handleToggleLearned}
            />
          </div>
        </div>
      </div>

      {course && <NextInCourseBar course={course} currentConceptId={concept.id} />}
    </div>
  );
}

export default function ConceptDetailPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-dark-muted font-mono">Loading concept...</div>}>
      <ConceptDetailContent />
    </Suspense>
  );
}
