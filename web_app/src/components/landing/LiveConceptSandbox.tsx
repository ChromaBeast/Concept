'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';

const DRILLS = [
  {
    topic: 'Storage Engines',
    question: 'Why do LSM-Trees (Log-Structured Merge-Trees) provide higher write throughput than B-Trees in distributed databases?',
    options: [
      'They perform random in-place updates directly on disk pages',
      'They sequentially append writes to memory (MemTable) and a disk WAL',
      'They disable database crash recovery logging',
      'They compress network packets before disk writes',
    ],
    correctIdx: 1,
    explanation: 'B-Trees require expensive random disk I/O seeks to rewrite pages in-place. LSM-Trees convert all mutations into sequential disk appends, multiplying write throughput by 10x+ on NVMe and distributed clusters.',
  },
  {
    topic: 'Transport Protocols',
    question: 'How does HTTP/3 (QUIC) eliminate TCP Head-of-Line (HoL) blocking on unreliable networks?',
    options: [
      'By multiplexing all data over a single persistent WebSocket stream',
      'By running streams independently over UDP so dropped packets in stream #1 do not stall stream #2',
      'By expanding the TCP window buffer to 512MB',
      'By removing TLS handshakes entirely',
    ],
    correctIdx: 1,
    explanation: 'In TCP, a lost packet stalls all multiplexed streams until retransmitted. QUIC implements independent per-stream offsets over UDP, isolating loss to only the impacted payload.',
  },
];

export function LiveConceptSandbox() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const drill = DRILLS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
  };

  const nextDrill = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setCurrentIdx((currentIdx + 1) % DRILLS.length);
  };

  return (
    <section className="section-fluid border-t border-obsidian-border bg-obsidian-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ 04 / INTERACTIVE DRILL ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.02em] text-white">
              Test Your Architecture <br />
              <span className="text-electric">Intuition in Real Time</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-dark-muted font-mono max-w-sm">
            Quick checks accompany every concept to guarantee active cognitive recall.
          </p>
        </div>

        {/* Tactile Drill Box */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-6 shadow-2xl">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-electric uppercase px-3 py-1 rounded-lg bg-electric/10 border border-electric/30">
              # {drill.topic}
            </span>
            <span className="text-dark-muted">
              Challenge {currentIdx + 1} of {DRILLS.length}
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-white leading-snug">
            {drill.question}
          </p>

          <div className="space-y-2.5 font-mono">
            {drill.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === drill.correctIdx;

              let style = 'border-obsidian-border bg-obsidian-surface hover:bg-obsidian-variant text-dark-text';
              if (isAnswered) {
                if (isCorrect) style = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold';
                else if (isSelected) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-colors flex items-center justify-between gap-4 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-obsidian-card border border-obsidian-border flex items-center justify-center text-[10px] font-bold text-dark-muted flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 rounded-2xl border border-obsidian-border bg-obsidian-surface text-xs font-mono space-y-1.5 animate-fadeIn">
              <span className="text-electric font-bold">// ARCHITECTURAL RATIONALE</span>
              <p className="text-dark-text font-sans leading-relaxed">{drill.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-obsidian-border font-mono">
            <button
              type="button"
              onClick={nextDrill}
              className="px-4 py-2 rounded-xl border border-obsidian-border bg-obsidian-surface hover:bg-obsidian-variant text-xs text-dark-text flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Drill</span>
            </button>

            <Link
              href="/browse"
              className="px-5 py-2 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <span>Explore 197 Reference Models</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
