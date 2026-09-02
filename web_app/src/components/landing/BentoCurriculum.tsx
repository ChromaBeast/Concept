'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Network, Layers, ShieldCheck } from 'lucide-react';

export function BentoCurriculum() {
  return (
    <section className="section-fluid border-t border-obsidian-border bg-obsidian-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ 02 / DOMAIN TRACKS ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.02em] text-white">
              Curriculum Built for <br />
              <span className="text-electric">Every Layer of Production</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-dark-muted font-mono max-w-sm">
            4 focused domains grouping 16 core disciplines with zero choice fatigue.
          </p>
        </div>

        {/* Asymmetrical 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Distributed Systems (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-6 flex flex-col justify-between hover:border-electric/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#BC8CFF]/15 border border-[#BC8CFF]/30 text-[#BC8CFF] flex items-center justify-center font-bold">
                    <Network className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-dark-muted">SYSTEMS &amp; SCALE</span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-obsidian-surface border border-obsidian-border text-dark-text font-semibold">
                  52 Models
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">Distributed Systems &amp; Storage Engines</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                CAP theorem, consistent hashing rings, write-ahead logging (WAL), B-Trees vs LSM-Trees, raft consensus, and distributed cache invalidation.
              </p>
            </div>

            <div className="pt-4 border-t border-obsidian-border space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-dark-muted">#ConsistentHashing</span>
                <span className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-dark-muted">#WAL</span>
                <span className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-dark-muted">#RaftConsensus</span>
                <span className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-dark-muted">#LSMTrees</span>
              </div>
              <Link href="/browse?domain=systems_cloud" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-electric uppercase tracking-wider hover:underline">
                <span>Explore Distributed Systems Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Core CS (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-6 flex flex-col justify-between hover:border-electric/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#58A6FF]/15 border border-[#58A6FF]/30 text-[#58A6FF] flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-dark-muted">FOUNDATIONS</span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-obsidian-surface border border-obsidian-border text-dark-text font-semibold">
                  64 Models
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">Core Computer Science</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Epoll I/O multiplexing, virtual memory page faults, thread synchronization primitives, and algorithmic graph patterns.
              </p>
            </div>

            <div className="pt-4 border-t border-obsidian-border">
              <Link href="/browse?domain=core_cs" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-electric uppercase tracking-wider hover:underline">
                <span>Explore Core CS Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Software & Web (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-6 flex flex-col justify-between hover:border-electric/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#39C5CF]/15 border border-[#39C5CF]/30 text-[#39C5CF] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-dark-muted">APPLICATION</span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-obsidian-surface border border-obsidian-border text-dark-text font-semibold">
                  48 Models
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">Application Architecture</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Circuit breaker pattern, idempotency keys, dependency injection, and event sourcing pipelines.
              </p>
            </div>

            <div className="pt-4 border-t border-obsidian-border">
              <Link href="/browse?domain=software_web" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-electric uppercase tracking-wider hover:underline">
                <span>Explore Application Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: Reliability & Operations (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-6 flex flex-col justify-between hover:border-electric/40 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#56D364]/15 border border-[#56D364]/30 text-[#56D364] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-dark-muted">OPERATIONS</span>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-obsidian-surface border border-obsidian-border text-dark-text font-semibold">
                  33 Models
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">Production Reliability &amp; Staff+ Strategy</h3>
              <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
                Zero-downtime blue/green rollouts, database migration locks, SQL vs NoSQL evaluation, and defending architecture trade-offs.
              </p>
            </div>

            <div className="pt-4 border-t border-obsidian-border space-y-4">
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-dark-muted">#BlueGreen</span>
                <span className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-dark-muted">#MigrationLocks</span>
                <span className="px-2.5 py-1 rounded-lg bg-obsidian-surface border border-obsidian-border text-dark-muted">#TradeoffDefense</span>
              </div>
              <Link href="/browse?domain=practices_career" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-electric uppercase tracking-wider hover:underline">
                <span>Explore Reliability Track</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
