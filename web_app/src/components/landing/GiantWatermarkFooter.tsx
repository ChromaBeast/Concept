'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';

export function GiantWatermarkFooter() {
  return (
    <footer className="relative border-t border-obsidian-border bg-obsidian-bg pt-16 sm:pt-20 pb-12 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Specific Action Callout */}
        <div className="p-8 sm:p-12 rounded-3xl border border-electric/40 bg-gradient-to-br from-electric/10 via-obsidian-card to-obsidian-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-electric">
              [ DIRECT REFERENCE ]
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-[-0.02em] text-white">
              Elevate Your System Design &amp; Architecture Intuition
            </h3>
            <p className="text-xs sm:text-sm text-dark-muted font-mono">
              100% free, offline-ready reference library and daily spaced repetition loops.
            </p>
          </div>

          <Link
            href="/browse"
            className="px-8 py-4 rounded-2xl bg-electric hover:bg-electric-400 text-obsidian-bg font-extrabold text-xs uppercase tracking-wider transition-colors shadow-xl shadow-electric/10 flex items-center gap-2 whitespace-nowrap"
          >
            <span>Explore 197 Reference Models</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categorized Navigation Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-mono">
          <div className="space-y-3">
            <div className="font-bold text-electric uppercase tracking-wider">DOMAIN CATALOG</div>
            <ul className="space-y-2 text-dark-muted">
              <li><Link href="/browse?domain=core_cs" className="hover:text-dark-text">Core Computer Science</Link></li>
              <li><Link href="/browse?domain=systems_cloud" className="hover:text-dark-text">Distributed Systems</Link></li>
              <li><Link href="/browse?domain=software_web" className="hover:text-dark-text">Software &amp; Web Eng</Link></li>
              <li><Link href="/browse?domain=practices_career" className="hover:text-dark-text">Reliability &amp; Staff+</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-electric uppercase tracking-wider">LEARNING SUITE</div>
            <ul className="space-y-2 text-dark-muted">
              <li><Link href="/courses" className="hover:text-dark-text">Structured Tracks</Link></li>
              <li><Link href="/search" className="hover:text-dark-text">Command Search (⌘K)</Link></li>
              <li><Link href="/bookmarks" className="hover:text-dark-text">Saved References</Link></li>
              <li><Link href="/profile" className="hover:text-dark-text">Daily Habit Tracker</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-electric uppercase tracking-wider">AUTHENTICATION</div>
            <ul className="space-y-2 text-dark-muted">
              <li><Link href="/login" className="hover:text-dark-text">Sign In with OAuth</Link></li>
              <li><Link href="/signup" className="hover:text-dark-text">Create Free Account</Link></li>
              <li><Link href="/forgot-password" className="hover:text-dark-text">Recover Password</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-electric uppercase tracking-wider">SOURCE &amp; ENGINE</div>
            <ul className="space-y-2 text-dark-muted">
              <li>
                <a
                  href="https://github.com/ChromaBeast/Concept"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-dark-text flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li><span className="text-dark-sub">MIT Open Source License</span></li>
              <li><span className="text-dark-sub">Go 1.26 Cloud Engine</span></li>
            </ul>
          </div>
        </div>

        {/* Giant Watermark Typography */}
        <div className="pt-8 text-center overflow-hidden">
          <div className="text-[15vw] font-black tracking-widest text-stroke uppercase leading-none opacity-30 hover:opacity-60 transition-opacity pointer-events-none">
            CONCEPT
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-dark-sub pt-6 border-t border-obsidian-border gap-2">
            <div>&copy; {new Date().getFullYear()} CONCEPT. HIGH-SIGNAL TECHNICAL REFERENCE.</div>
            <div className="text-electric">APPWRITE &bull; NEXT.JS &bull; FLUTTER</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
