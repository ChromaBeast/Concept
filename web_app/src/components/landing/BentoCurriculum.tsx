'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Network, Layers, ShieldCheck } from 'lucide-react';
import { SpotlightCard } from '@/components/animations';

export function BentoCurriculum() {
  return (
    <section className="section-fluid border-t border-paper-border bg-paper-bg font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-ochre">
              [ DOMAIN TRACKS ]
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper-text font-sans">
              Curriculum Built for <br />
              <span className="text-ochre">Every Layer of Production</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-paper-muted font-mono max-w-sm">
            4 focused domains grouping 16 core disciplines without the scroll-forever problem.
          </p>
        </div>

        {/* Asymmetrical 12-Column Grid with SpotlightCards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Distributed Systems (7 cols) */}
          <SpotlightCard
            spotlightColor="rgba(147, 51, 234, 0.14)"
            className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card space-y-6 flex flex-col justify-between hover:border-ochre/40 transition-colors shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Network className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">SYSTEMS &amp; SCALE</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-paper-surface border border-paper-border text-paper-text font-semibold">
                  Architecture
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-paper-text font-sans">Distributed Systems &amp; Storage</h3>
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
                CAP theorem, consistent hashing rings, write-ahead logging (WAL), B-Trees vs LSM-Trees, raft consensus, and distributed cache invalidation.
              </p>
            </div>

            <div className="pt-4 border-t border-paper-border space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-paper-muted">#ConsistentHashing</span>
                <span className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-paper-muted">#WAL</span>
                <span className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-paper-muted">#RaftConsensus</span>
                <span className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-paper-muted">#LSMTrees</span>
              </div>
              <Link href="/browse?domain=systems_cloud" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ochre uppercase tracking-wider hover:underline">
                <span>Explore Distributed Systems Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 2: Core CS (5 cols) */}
          <SpotlightCard
            spotlightColor="rgba(37, 99, 235, 0.14)"
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card space-y-6 flex flex-col justify-between hover:border-ochre/40 transition-colors shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">FOUNDATIONS</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-paper-surface border border-paper-border text-paper-text font-semibold">
                  CS Primitives
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-paper-text font-sans">Core Computer Science</h3>
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
                Epoll I/O multiplexing, virtual memory page faults, thread synchronization primitives, and algorithmic graph patterns.
              </p>
            </div>

            <div className="pt-4 border-t border-paper-border">
              <Link href="/browse?domain=core_cs" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ochre uppercase tracking-wider hover:underline">
                <span>Explore Core CS Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 3: Software & Web (5 cols) */}
          <SpotlightCard
            spotlightColor="rgba(13, 148, 136, 0.14)"
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card space-y-6 flex flex-col justify-between hover:border-ochre/40 transition-colors shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-teal/15 border border-teal/25 text-teal flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">APPLICATION</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-paper-surface border border-paper-border text-paper-text font-semibold">
                  Software Patterns
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-paper-text font-sans">Application Architecture</h3>
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
                Circuit breaker pattern, idempotency keys, dependency injection, and event sourcing pipelines.
              </p>
            </div>

            <div className="pt-4 border-t border-paper-border">
              <Link href="/browse?domain=software_web" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ochre uppercase tracking-wider hover:underline">
                <span>Explore Application Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 4: Reliability & Operations (7 cols) */}
          <SpotlightCard
            spotlightColor="rgba(22, 163, 74, 0.14)"
            className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card space-y-6 flex flex-col justify-between hover:border-ochre/40 transition-colors shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-paper-muted">OPERATIONS</span>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-paper-surface border border-paper-border text-paper-text font-semibold">
                  Resilience &amp; SRE
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-paper-text font-sans">Production Reliability &amp; Staff+ Strategy</h3>
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed">
                Zero-downtime blue/green rollouts, database migration locks, SQL vs NoSQL evaluation, and defending architecture trade-offs.
              </p>
            </div>

            <div className="pt-4 border-t border-paper-border space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-paper-muted">#BlueGreen</span>
                <span className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-paper-muted">#MigrationLocks</span>
                <span className="px-2.5 py-1 rounded-lg bg-paper-surface border border-paper-border text-paper-muted">#TradeoffDefense</span>
              </div>
              <Link href="/browse?domain=practices_career" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ochre uppercase tracking-wider hover:underline">
                <span>Explore Reliability Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
