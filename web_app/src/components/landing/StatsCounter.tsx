'use client';

import React from 'react';
import { ShieldCheck, Flame, BookOpen, Clock } from 'lucide-react';

const CONSTRAINTS = [
  { part: '01. Axiom Definition', limit: '&le; 40 words', intent: 'No hand-wavy analogies' },
  { part: '02. Production Value', limit: '&le; 60 words', intent: 'Throughput & latency costs' },
  { part: '03. Idiomatic Code', limit: '&le; 12 lines', intent: 'Zero filler boilerplate' },
  { part: '04. Production Pitfall', limit: '&le; 40 words', intent: '3 AM outage triggers' },
  { part: '05. Interview Angle', limit: '&le; 30 words', intent: 'Staff+ evaluation criteria' },
];

export function StatsCounter() {
  return (
    <section className="section-fluid border-t border-obsidian-border bg-obsidian-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (7 cols): Hard Limits Contract */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-electric">
                [ 01 / COGNITIVE COMPACT ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-[-0.02em] text-white">
                Engineered for High Retention, <br />
                <span className="text-electric">Guaranteed Under 260 Words</span>
              </h2>
              <p className="text-sm text-dark-muted leading-relaxed">
                Most documentation is written to be exhaustive rather than retentive. Every Concept entry conforms to strict length caps enforced by automated validation pipelines.
              </p>
            </div>

            <div className="rounded-2xl border border-obsidian-border bg-obsidian-card overflow-hidden text-xs font-mono">
              <div className="px-4 py-2.5 bg-obsidian-surface border-b border-obsidian-border text-dark-muted flex justify-between">
                <span>SECTION SPECIFICATION</span>
                <span>HARD CAP</span>
              </div>
              <div className="divide-y divide-obsidian-border">
                {CONSTRAINTS.map((c, idx) => (
                  <div key={idx} className="px-4 py-2.5 flex items-center justify-between text-dark-text">
                    <div>
                      <span className="font-semibold">{c.part}</span>
                      <span className="text-dark-muted ml-2 hidden sm:inline-block">({c.intent})</span>
                    </div>
                    <span className="text-electric font-bold" dangerouslySetInnerHTML={{ __html: c.limit }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Metrics with Context */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-dark-muted">REFERENCE LIBRARY</span>
                <BookOpen className="w-4 h-4 text-electric" />
              </div>
              <div className="text-4xl font-black text-white">197+ Concepts</div>
              <p className="text-xs text-dark-muted font-mono leading-relaxed">
                Covers algorithms, distributed locks, database indexing, Raft consensus, and TCP/QUIC protocols.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
                  <Flame className="w-4 h-4 fill-current" /> DAILY LOOP
                </div>
                <div className="text-2xl font-bold text-white">Spaced Habit</div>
                <p className="text-[11px] text-dark-muted font-mono">Automated daily refresh.</p>
              </div>

              <div className="p-5 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                  <ShieldCheck className="w-4 h-4" /> OFFLINE FIRST
                </div>
                <div className="text-2xl font-bold text-white">0ms Latency</div>
                <p className="text-[11px] text-dark-muted font-mono">Instant local storage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
