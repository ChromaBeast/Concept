'use client';

import React from 'react';

const STATS = [
  { value: '197+', label: 'Curated Concepts', sub: 'Across 16 disciplines' },
  { value: '96%', label: 'Retention Rate', sub: 'Structured 5-part format' },
  { value: '<90s', label: 'Average Read Time', sub: 'Zero video bloat' },
  { value: '4', label: 'Domain Clusters', sub: 'From Core CS to Cloud' },
];

export function StatsCounter() {
  return (
    <section className="py-16 border-t border-obsidian-border bg-obsidian-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Tag */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ 01 / PHILOSOPHY ]
            </span>
            <p className="text-xl sm:text-2xl font-bold text-dark-text leading-snug">
              Concept is software engineering distilled. Intelligent micro-references and daily review loops designed for how developers actually read and retain architecture.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-card max-w-xs text-xs text-dark-muted leading-relaxed font-mono">
            <span className="text-electric font-bold">// NO FLUFF GUARANTEE</span>
            <p className="mt-1">
              Every concept obeys hard limits: Definition (&le;40w), Why It Matters (&le;60w), Code (&le;12 lines), Pitfall (&le;40w), Interview Angle (&le;30w).
            </p>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-obsidian-border bg-obsidian-card space-y-2 hover:border-electric/30 transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-dark-text">{stat.label}</div>
              <div className="text-xs text-dark-muted font-mono">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
