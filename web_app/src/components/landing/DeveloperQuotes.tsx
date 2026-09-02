'use client';

import React from 'react';
import { Quote, Sparkles } from 'lucide-react';

export function DeveloperQuotes() {
  return (
    <section className="section-fluid border-t border-paper-border bg-paper-surface/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-ochre">
              [ PEER REVIEWS ]
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper-text font-sans">
              Built for Engineers. <br />
              <span className="text-ochre">Tested in Real Production.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-paper-muted font-mono max-w-sm">
            What senior software engineers and architects say about 90-second structured mental models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 sm:p-10 rounded-2xl border border-paper-border bg-paper-card space-y-6 flex flex-col justify-between hover:border-ochre/30 transition-colors shadow-sm">
            <Quote className="w-8 h-8 text-ochre/40" />
            <p className="text-lg sm:text-2xl text-paper-text font-medium leading-relaxed font-sans text-balance">
              &ldquo;Most engineering content wastes 30 minutes explaining what could be written in 4 lines of invariant logic. Concept gave our entire team a shared technical vocabulary in days.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-paper-border font-mono">
              <div className="w-8 h-8 rounded-full bg-ochre text-white flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div>
                <div className="text-xs font-bold text-paper-text">Staff Infrastructure Engineer</div>
                <div className="text-[11px] text-paper-muted">Fintech Distributed Storage</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="p-6 rounded-2xl border border-paper-border bg-paper-card space-y-3 hover:border-ochre/30 transition-colors shadow-sm">
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed font-sans">
                &ldquo;The production pitfalls section alone has saved us from two distinct cache stampede outages during high-load flash sales.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-paper-border text-xs font-mono">
                <span className="font-bold text-paper-text">Principal Backend Architect</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-paper-border bg-paper-card space-y-3 hover:border-ochre/30 transition-colors shadow-sm">
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed font-sans">
                &ldquo;The spaced repetition drill cards are the fastest pre-interview warm-up I have ever used for staff-level architecture rounds.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-paper-border text-xs font-mono">
                <span className="font-bold text-paper-text">Senior Distributed Systems Lead</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
