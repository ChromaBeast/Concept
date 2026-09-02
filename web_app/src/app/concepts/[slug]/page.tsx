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
    return <div className="p-20 text-center text-paper-muted font-mono">Loading reference...</div>;
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
    <article className="min-h-screen bg-paper-bg">
      <ConceptHeaderEditorial
        title={concept.title}
        oneLiner={concept.oneLiner}
        category={concept.category}
        difficulty={concept.difficulty}
        estimatedReadSeconds={concept.estimatedReadSeconds}
      />

      {/* Divided 2-Column Grid Container */}
      <div className="flex divide-x divide-paper-border relative max-w-7xl mx-auto border-x border-paper-border">
        {/* Main Content Column */}
        <main className="w-full p-6 lg:p-10 space-y-10 min-w-0">
          {/* 01. Definition */}
          <section id="definition" className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">
              [ 01 / AXIOM DEFINITION ]
            </h2>
            <p className="text-xl sm:text-2xl font-semibold text-paper-text leading-relaxed text-balance">
              {concept.body.definition}
            </p>
          </section>

          {/* 02. Why It Matters */}
          <section id="why-it-matters" className="space-y-3 pt-8 border-t border-paper-border">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">
              [ 02 / WHY IT MATTERS ON THE JOB ]
            </h2>
            <p className="text-base sm:text-lg text-paper-muted leading-relaxed">
              {concept.body.whyItMatters}
            </p>
          </section>

          {/* Visual Aid */}
          {concept.visualAid && (
            <div className="pt-6 border-t border-paper-border">
              <ConceptHeroVisual title={concept.title} imageUrl={concept.heroImageUrl} imagePrompt={concept.imagePrompt} />
            </div>
          )}

          {/* 03. Code & Scenario */}
          <section id="code-example" className="space-y-3 pt-8 border-t border-paper-border">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">
              [ 03 / CODE &amp; CONCRETE SCENARIO ]
            </h2>
            <CodeBlock code={concept.body.example} title={`${concept.title} implementation`} />
          </section>

          {/* 04. Pitfalls & 05. Interview Angle */}
          <section id="pitfall" className="space-y-5 pt-8 border-t border-paper-border">
            <PitfallBox pitfall={concept.body.commonPitfall} />
            <InterviewBox interviewAngle={concept.body.interviewAngle} />
          </section>

          {/* 06. Quick Check Drill */}
          <section id="quick-checks" className="space-y-4 pt-8 border-t border-paper-border">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">
              [ 06 / ACTIVE RECALL DRILL ]
            </h2>
            <QuickCheckList quickChecks={concept.body.quickChecks} />
          </section>

          {/* 07. Related Concepts */}
          <section id="related" className="pt-8 border-t border-paper-border">
            <RelatedConcepts relatedConceptIds={concept.relatedConceptIds} />
          </section>
        </main>

        {/* Right Sticky Sidebar */}
        <aside className="hidden lg:block w-[340px] flex-shrink-0 p-6 lg:p-10 bg-paper-surface/40">
          <div className="sticky top-20">
            <ConceptSidebar
              bookmarked={bookmarked}
              learned={learned}
              companies={concept.askedByCompanies}
              course={course}
              onToggleBookmark={handleToggleBookmark}
              onToggleLearned={handleToggleLearned}
            />
          </div>
        </aside>
      </div>

      {course && <NextInCourseBar course={course} currentConceptId={concept.id} />}
    </article>
  );
}

export default function ConceptDetailPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-paper-muted font-mono">Loading concept...</div>}>
      <ConceptDetailContent />
    </Suspense>
  );
}
