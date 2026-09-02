'use client';

import React from 'react';

const TESTIMONIALS = [
  {
    quote:
      'Concept is the only learning tool that respects a senior engineer’s time. In 90 seconds, I reviewed Raft consensus and crushed my L6 systems interview.',
    author: 'Elena Rostova',
    role: 'Staff Infrastructure Engineer',
    company: 'Ex-Stripe',
    avatar: 'ER',
    color: '#E2FB3C',
  },
  {
    quote:
      'The failure mode callouts alone saved our team from a catastrophic distributed lock bug in production. The signal-to-noise ratio is unbeatable.',
    author: 'David Kim',
    role: 'Principal Backend Architect',
    company: 'Fintech Unicorn',
    avatar: 'DK',
    color: '#58A6FF',
  },
  {
    quote:
      'No 45-minute slide deck nonsense. Just crisp definitions, actual memory tradeoffs, and staff-level interview angles. Absolute gold.',
    author: 'Marcus Vance',
    role: 'Senior Systems Engineer',
    company: 'Cloud Scale Corp',
    avatar: 'MV',
    color: '#39C5CF',
  },
];

export function DeveloperQuotes() {
  return (
    <section className="py-20 border-t border-obsidian-border bg-obsidian-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ 05 / PRAISE ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              STORIES BEGIN WITH <br />
              <span className="text-electric">DEEP UNDERSTANDING</span>
            </h2>
          </div>

          <p className="text-sm text-dark-muted max-w-md">
            Trusted by engineers at top technology companies preparing for architecture reviews and senior rounds.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-6 flex flex-col justify-between hover:border-electric/30 transition-colors"
            >
              <p className="text-sm text-dark-text leading-relaxed font-medium">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-obsidian-border/60">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs text-obsidian-bg"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-dark-text">{t.author}</div>
                  <div className="text-xs text-dark-muted font-mono">{t.role} • {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
