'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, AlertOctagon, Clock } from 'lucide-react';
import { DotGrid, BlurText, ShinyText, SpotlightCard, ClickSpark } from '@/components/animations';
import { dataService } from '@/lib/dataService';

export function LandingHero() {
  const [activeTab, setActiveTab] = useState<'invariant' | 'failure_mode'>('invariant');
  const [drillAnswered, setDrillAnswered] = useState(false);
  const [conceptCount, setConceptCount] = useState<number>(21);

  useEffect(() => {
    dataService.getAllConcepts().then((list) => {
      if (list && list.length > 0) setConceptCount(list.length);
    });
  }, []);

  return (
    <section className="relative pt-6 sm:pt-10 pb-16 overflow-hidden">
      {/* Background Interactive Dot Grid */}
      <DotGrid
        spacing={30}
        baseRadius={1.2}
        maxRadius={3.5}
        baseColor="rgba(150, 150, 150, 0.12)"
        activeColor="rgba(217, 119, 6, 0.55)"
        influenceRadius={140}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: High-Conviction Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-ochre/30 bg-ochre/10 text-ochre text-xs font-mono tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-ochre" />
              <span>90-Second Reference Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-paper-text leading-[1.05] font-sans">
              <BlurText text="Engineering mental models," as="span" /> <br />
              <ShinyText shineColor="rgba(255, 255, 255, 0.95)">
                <span className="text-ochre">without the scroll.</span>
              </ShinyText>
            </h1>

            <p className="text-base sm:text-lg text-paper-muted max-w-xl leading-relaxed">
              Distributed systems, database internals, and concurrency trade-offs &mdash; explained the way you&apos;d explain them to a colleague, not a lecture hall. A study companion for the stuff you&apos;re expected to already know.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/browse"
                className="px-6 py-3.5 rounded-xl bg-ochre hover:bg-ochre-dim text-white font-bold font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Browse {conceptCount} Reference Models</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/courses"
                className="px-6 py-3.5 rounded-xl border border-paper-border bg-paper-card hover:bg-paper-surface text-paper-text font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Curated Study Playlists</span>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-paper-border text-xs font-mono text-paper-muted">
              <div><span className="text-paper-text font-bold">{conceptCount}</span> Concepts</div>
              <div><span className="text-paper-text font-bold">16</span> Disciplines</div>
              <div><span className="text-ochre font-bold">&le;90s</span> Read Cap</div>
            </div>
          </div>

          {/* Right Column: Interactive Concept Inspector (5 cols) */}
          <div className="lg:col-span-5">
            <SpotlightCard
              spotlightColor="rgba(217, 119, 6, 0.18)"
              radius={260}
              className="rounded-2xl border border-paper-border bg-paper-card shadow-md overflow-hidden"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-paper-border bg-paper-surface text-xs font-mono">
                <div className="flex items-center gap-2 text-paper-text font-semibold">
                  <span className="text-ochre">#</span>
                  <span>CONSISTENT_HASHING</span>
                </div>
                <div className="flex items-center gap-1.5 text-paper-muted text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-ochre" />
                  <span>90s read</span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-paper-border text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('invariant')}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'invariant'
                      ? 'bg-ochre/10 text-ochre font-bold border-b-2 border-ochre'
                      : 'text-paper-muted hover:text-paper-text bg-paper-card'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Axiom &amp; Ring</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('failure_mode')}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'failure_mode'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border-b-2 border-rose-500'
                      : 'text-paper-muted hover:text-paper-text bg-paper-card'
                  }`}
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Production Pitfall</span>
                </button>
              </div>

              {/* Inspector Content */}
              <div className="p-5 space-y-4 text-xs font-mono">
                {activeTab === 'invariant' ? (
                  <div className="space-y-3">
                    <p className="text-paper-text font-sans font-medium leading-relaxed">
                      Maps keys and nodes onto a circular 2<sup>32</sup> hash ring. When a node joins or leaves, only <strong>k/N</strong> keys are remapped rather than re-shuffling the entire database.
                    </p>
                    <div className="p-3 rounded-xl bg-paper-surface border border-paper-border text-paper-muted space-y-1">
                      <div className="text-ochre">// Virtual node distribution formula</div>
                      <div className="text-paper-text">ring[hash(nodeId + &quot;_v&quot; + vIndex)] = nodeId;</div>
                      <div className="text-teal">// Remap cost: O(k/N) instead of O(N)</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4" /> Non-Uniform Hotspots
                    </div>
                    <p className="text-paper-text font-sans leading-relaxed">
                      Without virtual nodes, stochastic hash clustering causes a single server to handle 4x average load, triggering cascading database collapse.
                    </p>
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-700 dark:text-rose-300">
                      Rule of thumb: Deploy &ge;150–200 virtual node replicas per physical node to flatten variance under 5%.
                    </div>
                  </div>
                )}

                {/* Instant Retention Check with ClickSpark */}
                <ClickSpark sparkCount={10} sparkColors={['#d97706', '#f59e0b', '#10b981']}>
                  <div
                    onClick={() => setDrillAnswered(!drillAnswered)}
                    className="p-3 rounded-xl border border-dashed border-ochre/40 bg-ochre/5 hover:bg-ochre/10 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-ochre">Drill: Why does standard modulo hashing fail here?</span>
                      <span className="text-paper-muted">{drillAnswered ? 'Hide' : 'Reveal'}</span>
                    </div>
                    {drillAnswered && (
                      <div className="text-[11px] text-paper-text font-sans pt-1 border-t border-ochre/20">
                        Adding 1 server invalidates nearly 100% of cached keys, triggering an instant cache stampede against your primary database.
                      </div>
                    )}
                  </div>
                </ClickSpark>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
