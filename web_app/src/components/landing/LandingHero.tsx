'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';

export function LandingHero() {
  const [activeTab, setActiveTab] = useState<'invariant' | 'failure_mode'>('invariant');
  const [drillAnswered, setDrillAnswered] = useState(false);

  return (
    <section className="relative pt-6 sm:pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: High-Conviction Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-electric/30 bg-electric/10 text-electric text-xs font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-electric" />
              <span>90-Second Reference Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-[-0.03em] text-white leading-[0.95]">
              Smarter Systems. <br />
              <span className="text-electric">Zero Video Bloat.</span>
            </h1>

            <p className="text-base sm:text-lg text-dark-muted max-w-xl leading-relaxed">
              Master the distributed invariants, database internals, and concurrency trade-offs senior engineers use daily. No 45-minute meandering tutorials—just high-signal mental models.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/browse"
                className="px-7 py-3.5 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-electric/10"
              >
                <span>Browse 197 Reference Models</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/courses"
                className="px-6 py-3.5 rounded-xl border border-obsidian-border bg-obsidian-card hover:bg-obsidian-variant text-dark-text font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>Drill Track Playlists</span>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-obsidian-border/70 text-xs font-mono text-dark-muted">
              <div><span className="text-white font-bold">197+</span> Invariants</div>
              <div><span className="text-white font-bold">16</span> Disciplines</div>
              <div><span className="text-electric font-bold">&le;90s</span> Read Cap</div>
            </div>
          </div>

          {/* Right Column: Interactive Dual-State Concept Inspector (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-obsidian-border bg-obsidian-card shadow-2xl overflow-hidden">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-obsidian-border bg-obsidian-surface text-xs font-mono">
                <div className="flex items-center gap-2 text-dark-text font-bold">
                  <span className="text-electric">#</span>
                  <span>CONSISTENT_HASHING</span>
                </div>
                <div className="flex items-center gap-1.5 text-dark-muted text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-electric" />
                  <span>90s read</span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-obsidian-border text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('invariant')}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'invariant'
                      ? 'bg-electric/10 text-electric font-bold border-b-2 border-electric'
                      : 'text-dark-muted hover:text-dark-text bg-obsidian-card'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Axiom & Ring</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('failure_mode')}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'failure_mode'
                      ? 'bg-rose-500/10 text-rose-400 font-bold border-b-2 border-rose-500'
                      : 'text-dark-muted hover:text-dark-text bg-obsidian-card'
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
                    <p className="text-dark-text font-sans font-medium leading-relaxed">
                      Maps keys and nodes onto a circular 2<sup>32</sup> hash ring. When a node joins or leaves, only <strong>k/N</strong> keys are remapped rather than re-shuffling the entire database.
                    </p>
                    <div className="p-3 rounded-xl bg-obsidian-surface border border-obsidian-border text-dark-muted space-y-1">
                      <div className="text-electric">// Virtual node distribution formula</div>
                      <div>ring[hash(nodeId + &quot;_v&quot; + vIndex)] = nodeId;</div>
                      <div className="text-emerald-400">// Remap cost: O(k/N) instead of O(N)</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4" /> Non-Uniform Hotspots
                    </div>
                    <p className="text-dark-text font-sans leading-relaxed">
                      Without virtual nodes, stochastic hash clustering causes a single server to handle 4x average load, triggering cascading database collapse.
                    </p>
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300">
                      Rule of thumb: Deploy &ge;150–200 virtual node replicas per physical node to flatten variance under 5%.
                    </div>
                  </div>
                )}

                {/* Instant Retention Check */}
                <div
                  onClick={() => setDrillAnswered(!drillAnswered)}
                  className="p-3 rounded-xl border border-dashed border-electric/40 bg-electric/5 hover:bg-electric/10 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-electric">Drill: Standard modulo hashing failure?</span>
                    <span className="text-dark-muted">{drillAnswered ? 'Hide' : 'Reveal'}</span>
                  </div>
                  {drillAnswered && (
                    <div className="text-[11px] text-dark-text font-sans pt-1 border-t border-electric/20">
                      Adding 1 server invalidates nearly 100% of cached keys, triggering an instant cache stampede against your primary SQL database.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
