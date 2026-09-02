'use client';

import React, { useState } from 'react';
import { XCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

export function ArchitectureFormula() {
  const [activeConcept, setActiveConcept] = useState<'lru' | 'raft' | 'idempotency'>('lru');

  const concepts = {
    lru: {
      title: 'LRU Cache Invariant',
      videoBloat: '38 minutes of drawing whiteboard pointer diagrams and generic queue slides.',
      conceptAxiom: 'Doubly-Linked List provides O(1) node relocation. Hash Map provides O(1) key lookup. Tail eviction drops oldest item on capacity overflow.',
      codeSnippet: 'this.map.set(key, this.list.moveToHead(node));',
    },
    raft: {
      title: 'Raft Consensus Algorithm',
      videoBloat: '45-minute YouTube lecture on Byzantine generals theory and academic proof proofs.',
      conceptAxiom: 'Leader election uses randomized heartbeats. Log replication is committed once written to a strict quorum majority (N/2 + 1) of nodes.',
      codeSnippet: 'if (replCount > Math.floor(nodes.length / 2)) commit();',
    },
    idempotency: {
      title: 'API Idempotency Key',
      videoBloat: '25-minute system design podcast on why double-billing happens in distributed webhooks.',
      conceptAxiom: 'Client sends unique UUID in Idempotency-Key header. Server acquires atomic Redis lock, returning cached response on exact hash matches.',
      codeSnippet: 'await redis.set(key, res, "NX", "EX", 86400);',
    },
  };

  const curr = concepts[activeConcept];

  return (
    <section className="section-fluid border-t border-paper-border bg-paper-surface/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-ochre">
              [ THE RETENTION FORMULA ]
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper-text font-sans">
              45-Min Video Fluff vs. <br />
              <span className="text-ochre">90-Second Invariant Logic</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-paper-muted font-mono max-w-sm">
            Compare standard bloated video tutorials with Concept&apos;s structured cognitive axioms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Bloat Side (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Standard 45-Minute Video Bloat</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-2xl font-bold text-paper-text font-mono">
                <Clock className="w-6 h-6 text-rose-500" />
                <span>~35-45 Minutes</span>
              </div>
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed font-sans">
                {curr.videoBloat}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-700 dark:text-rose-300">
              Low active recall. 90% forgotten within 48 hours without structured invariant reinforcement.
            </div>
          </div>

          {/* Concept Formula Side (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card space-y-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-2">
              <div className="flex items-center gap-2 text-teal font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Concept Structured Reference</span>
              </div>
              <span className="text-ochre font-bold bg-ochre/10 px-2.5 py-0.5 rounded-md border border-ochre/25">
                &le;90s Read Invariant
              </span>
            </div>

            {/* Concept Selector */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {(['lru', 'raft', 'idempotency'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActiveConcept(k)}
                  className={`p-2.5 rounded-xl border text-center transition-colors ${
                    activeConcept === k
                      ? 'bg-ochre/15 text-ochre border-ochre/30 font-bold'
                      : 'bg-paper-surface border-paper-border text-paper-muted hover:text-paper-text'
                  }`}
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-paper-text font-sans">{curr.title}</h3>
              <p className="text-xs sm:text-sm text-paper-muted leading-relaxed font-sans">
                {curr.conceptAxiom}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-paper-surface border border-paper-border text-xs font-mono space-y-1 text-paper-text">
              <div className="text-ochre">// Production core line</div>
              <div>{curr.codeSnippet}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
