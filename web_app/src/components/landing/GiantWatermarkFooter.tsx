'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Layers, ShieldCheck, Bookmark, Search } from 'lucide-react';

export function GiantWatermarkFooter() {
  return (
    <footer className="relative border-t border-paper-border bg-paper-bg pt-16 sm:pt-20 pb-12 overflow-hidden select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Call To Action Box */}
        <div className="p-8 sm:p-12 rounded-3xl border border-ochre/30 bg-gradient-to-br from-ochre/10 via-paper-card to-paper-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-ochre">
              [ 90-SECOND SWE HABIT ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-paper-text font-sans">
              Build your technical intuition. <br />
              <span className="text-ochre">One mental model a day.</span>
            </h2>
            <p className="text-xs sm:text-sm text-paper-muted leading-relaxed font-sans">
              Join working and senior engineers reviewing distributed invariants, database algorithms, and systems failure modes daily.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              href="/signup"
              className="px-6 py-3.5 rounded-xl bg-ochre hover:bg-ochre-dim text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Start Free Habit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/browse"
              className="px-6 py-3.5 rounded-xl border border-paper-border bg-paper-card hover:bg-paper-surface text-paper-text font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>Explore All Concepts</span>
            </Link>
          </div>
        </div>

        {/* Semantic Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs">
          <div className="space-y-3">
            <div className="text-paper-text font-bold uppercase tracking-wider">Explore</div>
            <ul className="space-y-2 text-paper-muted">
              <li><Link href="/browse" className="hover:text-ochre transition-colors">All Concepts</Link></li>
              <li><Link href="/courses" className="hover:text-ochre transition-colors">Curated Study Paths</Link></li>
              <li><Link href="/browse?domain=systems_cloud" className="hover:text-ochre transition-colors">Distributed Systems</Link></li>
              <li><Link href="/browse?domain=core_cs" className="hover:text-ochre transition-colors">Core Computer Science</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-paper-text font-bold uppercase tracking-wider">Features</div>
            <ul className="space-y-2 text-paper-muted">
              <li><Link href="/search" className="hover:text-ochre transition-colors">Instant Keyword Search</Link></li>
              <li><Link href="/bookmarks" className="hover:text-ochre transition-colors">Personal Saved Library</Link></li>
              <li><Link href="/profile" className="hover:text-ochre transition-colors">Daily Streak &amp; Habit</Link></li>
              <li><Link href="/admin" className="hover:text-ochre transition-colors">Admin &amp; Curation Engine</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-paper-text font-bold uppercase tracking-wider">Disciplines</div>
            <ul className="space-y-2 text-paper-muted">
              <li><Link href="/browse?category=dsa" className="hover:text-ochre transition-colors">Data Structures &amp; Algos</Link></li>
              <li><Link href="/browse?category=system_design" className="hover:text-ochre transition-colors">System Design &amp; Scale</Link></li>
              <li><Link href="/browse?category=databases" className="hover:text-ochre transition-colors">Database Engines</Link></li>
              <li><Link href="/browse?category=operating_systems" className="hover:text-ochre transition-colors">OS &amp; Kernel Internals</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-paper-text font-bold uppercase tracking-wider">Platform</div>
            <ul className="space-y-2 text-paper-muted">
              <li><span className="text-paper-muted">Appwrite Go Cloud Backend</span></li>
              <li><span className="text-paper-muted">Flutter iOS / Android</span></li>
              <li><span className="text-paper-muted">Next.js Web App</span></li>
              <li><span className="text-paper-muted">Human-Reviewed Before Publish</span></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-paper-muted pt-6 border-t border-paper-border gap-2">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-paper-text font-semibold">Concept &mdash; Engineering Mental Models in &lt;2 minutes.</div>
            <div>&copy; 2026 Concept.</div>
          </div>
          <div className="flex items-center gap-4">
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
