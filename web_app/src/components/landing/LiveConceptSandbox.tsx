'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ScenarioOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

const DRILL_SCENARIO = {
  title: 'Database Sharding & Hotspot Defense',
  question:
    'You are sharding a multi-tenant database by user_id with modulo hashing (user_id % N). A major enterprise customer signs up generating 40% of all traffic. What immediate architecture failure occurs?',
  options: [
    {
      id: '1',
      label: 'Range queries across shards silently return incomplete results.',
      isCorrect: false,
      explanation: 'Cross-shard scatter-gather queries require explicit coordinator aggregation, but skew directly exhausts single-shard capacity first.',
    },
    {
      id: '2',
      label: 'Hot shard bottleneck: one physical database hits CPU/IOPS saturation while the others sit idle.',
      isCorrect: true,
      explanation: 'Modulo hashing ignores uneven tenant data volumes, causing catastrophic single-shard exhaustion.',
    },
    {
      id: '3',
      label: 'Read queries fail due to inconsistent secondary index synchronization.',
      isCorrect: false,
      explanation: 'Secondary indexes can suffer lag, but this is an un-mitigated volume skew issue.',
    },
    {
      id: '4',
      label: 'Write-ahead log locks prevent new connection pools from initializing.',
      isCorrect: false,
      explanation: 'Connection pools are managed by the gateway proxy rather than table-level locks.',
    },
  ],
};

export function LiveConceptSandbox() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const selected = DRILL_SCENARIO.options.find((o) => o.id === selectedOption);

  return (
    <section className="section-fluid border-t border-paper-border bg-paper-bg font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-base sm:text-lg font-mono font-semibold text-paper-text">
            Try one before you scroll further.
          </p>
          <span className="text-xs text-paper-muted font-mono">
            Active recall drill &bull; Instant trade-off feedback
          </span>
        </div>

        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl border border-paper-border bg-paper-card space-y-6 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-ochre uppercase px-2.5 py-0.5 rounded-md bg-ochre/10 border border-ochre/25">
              {DRILL_SCENARIO.title}
            </span>
            <span className="text-paper-muted text-[11px]">Active Recall Drill</span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-paper-text leading-relaxed font-sans">
            {DRILL_SCENARIO.question}
          </p>

          <div className="space-y-2.5 font-sans">
            {DRILL_SCENARIO.options.map((option, idx) => {
              const isChosen = selectedOption === option.id;
              let style = 'border-paper-border bg-paper-surface hover:bg-paper-border/30 text-paper-text';

              if (isChosen) {
                if (option.isCorrect) {
                  style = 'border-teal bg-teal/10 text-teal font-medium';
                } else {
                  style = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium';
                }
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl border text-xs sm:text-sm transition-colors flex items-center justify-between gap-4 shadow-sm ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-paper-card border border-paper-border flex items-center justify-center text-[10px] font-bold font-mono text-paper-muted flex-shrink-0">
                      [{idx + 1}]
                    </span>
                    <span>{option.label}</span>
                  </div>
                  {isChosen && (
                    <div className="flex-shrink-0">
                      {option.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-teal" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className={`p-4 rounded-xl border text-xs font-mono space-y-1 animate-fadeIn ${
              selected.isCorrect ? 'bg-teal/10 border-teal/30 text-teal' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}>
              <div className="font-bold uppercase tracking-wider">
                {selected.isCorrect ? '✓ Correct Architectural Insight' : '✗ Incorrect Trade-Off'}
              </div>
              <p className="font-sans leading-relaxed text-paper-text">{selected.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-paper-border font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedOption(null)}
              className="px-3 py-1.5 rounded-lg border border-paper-border bg-paper-surface hover:bg-paper-card text-paper-muted hover:text-paper-text flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <Link
              href="/browse"
              className="text-ochre font-bold hover:underline flex items-center gap-1"
            >
              <span>Explore All Concepts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
