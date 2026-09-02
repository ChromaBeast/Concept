'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Zap } from 'lucide-react';

const DRILLS = [
  {
    topic: 'Distributed Systems',
    question: 'Why do LSM-Trees (Log-Structured Merge-Trees) provide faster write throughput than B-Trees?',
    options: [
      'They perform in-place random disk writes',
      'They write sequentially to an append-only WAL and in-memory MemTable',
      'They disable database crash recovery logging',
      'They compress data before sending it over the network',
    ],
    correctIdx: 1,
    explanation: 'LSM-Trees append all writes sequentially to memory (MemTable) and a disk WAL, avoiding the expensive random I/O disk seeks required by B-Tree page rewrites.',
  },
  {
    topic: 'Networking & Protocols',
    question: 'How does HTTP/3 solve the TCP Head-of-Line (HoL) blocking problem?',
    options: [
      'By using WebSockets for all streaming communication',
      'By using UDP via QUIC so lost packets only stall that single stream',
      'By increasing the TCP window size to 1GB',
      'By compressing TLS 1.3 handshakes into headers',
    ],
    correctIdx: 1,
    explanation: 'QUIC runs over UDP and handles multiple independent streams natively. Packet loss in stream #1 does not delay or block stream #2.',
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
    <section className="py-20 border-t border-obsidian-border bg-obsidian-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ 04 / LIVE DRILL ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              TEST YOUR ARCHITECTURE <br />
              <span className="text-electric">INTUITION RIGHT NOW</span>
            </h2>
          </div>

          <p className="text-sm text-dark-muted max-w-md">
            Interactive retention checks built directly into every reference concept.
          </p>
        </div>

        {/* Drill Box */}
        <div className="max-w-3xl mx-auto p-8 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-electric px-3 py-1 rounded-full bg-electric/10 border border-electric/30">
              ✦ {drill.topic}
            </span>
            <span className="text-xs font-mono text-dark-muted">
              Question {currentIdx + 1} of {DRILLS.length}
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-dark-text leading-snug">
            {drill.question}
          </p>

          <div className="space-y-3">
            {drill.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === drill.correctIdx;

              let style = 'border-obsidian-border bg-obsidian-surface/60 hover:bg-obsidian-surface hover:border-obsidian-border text-dark-text';
              if (isAnswered) {
                if (isCorrect) style = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold';
                else if (isSelected) style = 'border-rose-500 bg-rose-500/10 text-rose-300';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-4 ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/80 text-xs text-dark-muted space-y-2 animate-fadeIn font-mono">
              <span className="text-electric font-bold">// ARCHITECTURAL RATIONALE</span>
              <p className="text-dark-text">{drill.explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-obsidian-border">
            <button
              type="button"
              onClick={nextDrill}
              className="px-4 py-2 rounded-xl border border-obsidian-border bg-obsidian-surface hover:bg-obsidian-variant text-xs font-mono text-dark-text flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Question</span>
            </button>

            <Link
              href="/browse"
              className="px-5 py-2 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5"
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
