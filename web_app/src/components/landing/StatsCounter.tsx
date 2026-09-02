'use client';

import React from 'react';
import { CountUp, SpotlightCard } from '@/components/animations';

const LIMITS = [
  { field: '01. Axiom Definition', limit: '≤ 40 words', intent: 'One clear, unambiguous architectural invariant' },
  { field: '02. Why It Matters', limit: '≤ 60 words', intent: 'Concrete engineering failure modes on the job' },
  { field: '03. Code / Scenario', limit: '≤ 60 words / ≤ 12 lines', intent: 'Minimalist idiomatic code snippet with trade-offs' },
  { field: '04. Common Pitfall', limit: '≤ 40 words', intent: 'What senior engineers know breaks in production' },
  { field: '05. Interview Angle', limit: '≤ 30 words', intent: 'Staff-level framing to stand out in tech screens' },
];

export function StatsCounter() {
  return (
    <section className="section-fluid border-t border-paper-border bg-paper-surface/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-ochre">
              [ SPECIFICATION SPEC ]
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper-text font-sans">
              Hard Cognitive Limits. <br />
              <span className="text-ochre">Zero Long-Winded Filler.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-paper-muted font-mono max-w-sm">
            Every concept is mathematically capped at &le;230 words to guarantee true under-2-minute retention.
          </p>
        </div>

        {/* Spec Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-paper-border bg-paper-card overflow-hidden text-xs font-mono shadow-sm">
            <div className="px-4 py-2.5 bg-paper-surface border-b border-paper-border text-paper-muted flex justify-between font-semibold">
              <span>Section Constraint Protocol</span>
              <span>Max Word Limit</span>
            </div>
            <div className="divide-y divide-paper-border">
              {LIMITS.map((item, i) => (
                <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-paper-surface/40 transition-colors">
                  <div>
                    <div className="font-bold text-paper-text font-mono">{item.field}</div>
                    <div className="text-[11px] text-paper-muted font-sans mt-0.5">{item.intent}</div>
                  </div>
                  <span className="font-bold text-ochre font-mono shrink-0 px-2 py-0.5 bg-ochre/10 rounded-md border border-ochre/20 text-center">
                    {item.limit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <SpotlightCard
              spotlightColor="rgba(217, 119, 6, 0.15)"
              className="p-6 rounded-2xl border border-paper-border bg-paper-card space-y-3 shadow-sm"
            >
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-ochre">230-Word Total Cap</div>
              <div className="text-3xl font-bold text-paper-text font-sans flex items-baseline gap-1">
                <span>~</span>
                <CountUp to={90} duration={1.5} suffix="s Read" />
              </div>
              <p className="text-xs text-paper-muted leading-relaxed font-sans">
                Dense, high-retention mental models. Eliminates 45-minute YouTube video bloat while delivering verified invariants.
              </p>
            </SpotlightCard>

            <div className="grid grid-cols-2 gap-4">
              <SpotlightCard
                spotlightColor="rgba(13, 148, 136, 0.15)"
                className="p-4 rounded-2xl border border-paper-border bg-paper-card space-y-1 shadow-sm"
              >
                <div className="text-2xl font-bold text-paper-text font-sans">
                  <CountUp to={100} duration={1.5} suffix="%" />
                </div>
                <div className="text-[11px] text-paper-muted font-mono">Factual Self-Checked</div>
              </SpotlightCard>
              <SpotlightCard
                spotlightColor="rgba(217, 119, 6, 0.15)"
                className="p-4 rounded-2xl border border-paper-border bg-paper-card space-y-1 shadow-sm"
              >
                <div className="text-2xl font-bold text-teal font-sans">
                  <CountUp to={0} duration={1} suffix=" min" />
                </div>
                <div className="text-[11px] text-paper-muted font-mono">Video Fluff</div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
