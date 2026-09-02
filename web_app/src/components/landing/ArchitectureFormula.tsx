'use client';

import React, { useState } from 'react';
import { XCircle, CheckCircle2, Zap, AlertTriangle, Briefcase, Code, Check } from 'lucide-react';

const SECTIONS = [
  { num: '01', title: 'Axiom Definition', cap: '&le;40w', desc: 'First-principles invariant. What the mechanism guarantees without hand-waving.' },
  { num: '02', title: 'Production Trade-off', cap: '&le;60w', desc: 'Throughput gains vs consistency costs. Why staff engineers pick it.' },
  { num: '03', title: 'Idiomatic Code', cap: '&le;12 lines', desc: 'Executable implementation demonstrating memory layout and network primitives.' },
  { num: '04', title: '3 AM Outage Pitfall', cap: '&le;40w', desc: 'The subtle failure modes, lock contentions, or stampedes that crash production.' },
  { num: '05', title: 'Staff+ Interview Angle', cap: '&le;30w', desc: 'The follow-up questions and system boundaries tested in senior evaluation loops.' },
];

export function ArchitectureFormula() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="section-fluid border-t border-obsidian-border bg-obsidian-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-electric">
            [ 03 / METHODOLOGY ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.02em] text-white">
            The 90-Second Formula vs. <br />
            <span className="text-electric">45-Minute Tutorial Bloat</span>
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted font-mono max-w-xl">
            Compare passive video consumption with high-density architectural compression.
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Status Quo Card (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              <XCircle className="w-4 h-4" />
              <span>THE STATUS QUO (45-MIN VIDEO)</span>
            </div>

            <ul className="space-y-4 text-xs font-mono text-dark-muted">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400">&times;</span>
                <span>12 minutes spent watching IDE boilerplate and package installations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400">&times;</span>
                <span>Superficial analogies that fall apart during production scale emergencies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400">&times;</span>
                <span>Passive watching with 0 recall after 48 hours.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400">&times;</span>
                <span>Zero mention of failure modes, split-brains, or memory overheads.</span>
              </li>
            </ul>
          </div>

          {/* Concept Formula Interactive Card (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-electric/40 bg-obsidian-card space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-electric">
                <CheckCircle2 className="w-4 h-4" />
                <span>THE CONCEPT INVARIANT STANDARD</span>
              </div>
              <span className="text-xs font-mono text-dark-muted font-semibold">Strict &le;260w Limit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {SECTIONS.map((sec, idx) => (
                <button
                  key={sec.num}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    activeIdx === idx
                      ? 'bg-electric/15 border-electric text-electric font-bold'
                      : 'bg-obsidian-surface border-obsidian-border text-dark-muted hover:text-dark-text'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{sec.num}. {sec.title}</span>
                    <span className="text-[10px] opacity-75" dangerouslySetInnerHTML={{ __html: sec.cap }} />
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-surface border border-obsidian-border text-xs font-mono space-y-2">
              <div className="text-electric font-bold">// DETAIL: {SECTIONS[activeIdx].title} ({SECTIONS[activeIdx].cap})</div>
              <p className="text-dark-text font-sans leading-relaxed">{SECTIONS[activeIdx].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
