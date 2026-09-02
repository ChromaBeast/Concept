'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export function LandingHero() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="relative pt-6 sm:pt-12 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Tag */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-electric/30 bg-electric/10 text-electric text-xs font-mono tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
            <span>&lt;2 Minute Engineering Reference</span>
          </div>
        </div>

        {/* Big Impact Headline */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
            SMARTER ARCHITECTURE. <br />
            <span className="text-electric">ON EVERY PULL REQUEST.</span>
          </h1>

          <p className="text-base sm:text-lg text-dark-muted max-w-2xl mx-auto leading-relaxed">
            Stop losing hours to 45-minute meandering tutorials. Concept distills distributed systems, database internals, and algorithmic patterns into dense, 90-second mental models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/browse"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-electric/10 flex items-center justify-center gap-2"
            >
              <span>Explore 197+ Concepts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-obsidian-border bg-obsidian-card hover:bg-obsidian-variant text-dark-text font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Browse Learning Paths</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Concept Terminal Mockup */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-obsidian-border bg-obsidian-card shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-obsidian-border bg-obsidian-surface text-xs font-mono text-dark-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-dark-text font-bold">CAP_THEOREM.md</span>
            </div>
            <div className="flex items-center gap-2 text-electric font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>~90s read</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-dark-muted">[ 01 / DEFINITION ]</span>
              <p className="text-sm sm:text-base font-semibold text-dark-text leading-relaxed">
                In any distributed data store, you can guarantee at most two of three properties simultaneously: Consistency, Availability, and Partition Tolerance.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-obsidian-border bg-obsidian-surface/60 font-mono text-xs space-y-1">
              <div className="text-electric">// Network partition occurs: Network split between Node A & B</div>
              <div className="text-dark-muted">Choose CP: Reject write to preserve absolute consistency across nodes.</div>
              <div className="text-dark-muted">Choose AP: Accept write locally to maintain 100% availability.</div>
            </div>

            {/* Interactive Quick-Check Drill */}
            <div
              onClick={() => setRevealed(!revealed)}
              className="p-4 rounded-xl border border-dashed border-electric/40 bg-electric/5 hover:bg-electric/10 cursor-pointer transition-all space-y-2 select-none"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-electric uppercase tracking-wider">
                  ✦ Quick Drill: Is DNS typically a CP or AP system?
                </span>
                <span className="text-[10px] font-mono text-dark-muted">
                  {revealed ? 'Click to hide' : 'Tap to reveal'}
                </span>
              </div>

              {revealed && (
                <div className="text-xs text-dark-text pt-2 border-t border-electric/20 animate-fadeIn">
                  <span className="font-bold text-emerald-400">AP (Availability & Partition Tolerance).</span> DNS prioritizes returning cached records quickly over instant global consistency during network propagation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
