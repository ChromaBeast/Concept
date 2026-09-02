'use client';

import React, { useState } from 'react';
import { ChevronDown, Check, Zap, AlertTriangle, Briefcase, Code, Sparkles } from 'lucide-react';

const SECTIONS = [
  {
    num: '01',
    title: 'Core Definition & Invariant',
    limit: '&le; 40 words',
    icon: Zap,
    content: 'A strict first-principles axiom defining the mechanism. No hand-wavy analogies or historical trivia.',
  },
  {
    num: '02',
    title: 'Production Trade-offs & Value',
    limit: '&le; 60 words',
    icon: Check,
    content: 'Why senior staff engineers choose this pattern: latency implications, availability guarantees, and throughput impacts.',
  },
  {
    num: '03',
    title: 'Idiomatic Code & Structural Flow',
    limit: '&le; 12 lines',
    icon: Code,
    content: 'Compact, clean implementation or architectural flow demonstrating practical execution without boilerplate.',
  },
  {
    num: '04',
    title: 'Common Failure Modes & Pitfalls',
    limit: '&le; 40 words',
    icon: AlertTriangle,
    content: 'The hidden trapdoors that trigger 3 AM production outages: split-brains, memory leaks, and cascading failures.',
  },
  {
    num: '05',
    title: 'Staff+ Interview Angle & Quick Check',
    limit: '&le; 30 words',
    icon: Briefcase,
    content: 'The exact phrasing and counter-questions asked by principal interviewers at tier-1 tech firms.',
  },
];

export function ArchitectureFormula() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section className="py-20 border-t border-obsidian-border bg-obsidian-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ 03 / THE 2-MINUTE FORMULA ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              EVERY CONCEPT TELLS A STORY <br />
              <span className="text-electric">WRITTEN IN PERFORMANCE</span>
            </h2>
          </div>

          <p className="text-sm text-dark-muted max-w-md">
            Every entry follows a strict cognitive architecture to guarantee maximum retention in under 2 minutes.
          </p>
        </div>

        {/* Stacked Accordion List */}
        <div className="space-y-3 max-w-4xl">
          {SECTIONS.map((sec, idx) => {
            const isOpen = openIdx === idx;
            const Icon = sec.icon;
            return (
              <div
                key={sec.num}
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isOpen
                    ? 'border-electric/50 bg-obsidian-card shadow-lg shadow-electric/5'
                    : 'border-obsidian-border bg-obsidian-card/60 hover:bg-obsidian-card hover:border-obsidian-border'
                }`}
              >
                <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-electric px-2.5 py-1 rounded-md bg-electric/10 border border-electric/20">
                      {sec.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-dark-text flex items-center gap-2">
                      <Icon className="w-4 h-4 text-electric" />
                      <span>{sec.title}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-xs font-mono text-dark-muted">
                      {sec.limit}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-dark-muted transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-electric' : ''
                      }`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-obsidian-border/50 text-sm text-dark-muted leading-relaxed font-mono">
                    <p className="text-dark-text">{sec.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
