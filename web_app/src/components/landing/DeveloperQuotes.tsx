'use client';

import React from 'react';

export function DeveloperQuotes() {
  return (
    <section className="section-fluid border-t border-obsidian-border bg-obsidian-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-electric">
            [ 05 / PRAISE ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-[-0.02em] text-white">
            Engineered for <br />
            <span className="text-electric">Practicing Staff Engineers</span>
          </h2>
        </div>

        {/* Asymmetrical 8 / 4 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Large Editorial Quote (8 cols) */}
          <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-8 flex flex-col justify-between hover:border-electric/30 transition-colors">
            <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed font-sans">
              &ldquo;Concept is the first technical reference that treats a senior engineer’s time as valuable. The failure mode callouts alone saved our team from a catastrophic distributed lease bug during a database failover.&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-6 border-t border-obsidian-border/70 font-mono">
              <div className="w-10 h-10 rounded-xl bg-electric text-obsidian-bg flex items-center justify-center font-bold text-sm">
                ER
              </div>
              <div>
                <div className="text-sm font-bold text-white">Elena Rostova</div>
                <div className="text-xs text-dark-muted">Staff Infrastructure Engineer • Ex-Stripe</div>
              </div>
            </div>
          </div>

          {/* 2 Stacked Context Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-4 hover:border-electric/30 transition-colors">
              <p className="text-xs sm:text-sm text-dark-text leading-relaxed font-sans font-medium">
                &ldquo;Zero 45-minute slide deck fluff. Just crisp definitions, actual memory trade-offs, and staff-level interview angles.&rdquo;
              </p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-obsidian-border text-xs font-mono">
                <span className="text-white font-bold">David Kim</span>
                <span className="text-dark-muted">• Principal Architect</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-obsidian-border bg-obsidian-card space-y-4 hover:border-electric/30 transition-colors">
              <p className="text-xs sm:text-sm text-dark-text leading-relaxed font-sans font-medium">
                &ldquo;I review 2 concepts every morning with coffee. My mental model of Raft consensus and LSM-Trees has never been sharper.&rdquo;
              </p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-obsidian-border text-xs font-mono">
                <span className="text-white font-bold">Marcus Vance</span>
                <span className="text-dark-muted">• Senior Systems Eng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
