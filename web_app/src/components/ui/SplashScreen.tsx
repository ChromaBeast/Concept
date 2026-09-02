'use client';

import React from 'react';
import { CinematicLogoSplash } from './CinematicLogoSplash';
import { ShinyText, DotGrid } from '@/components/animations';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 text-white select-none overflow-hidden animate-fadeIn">
      {/* Background Interactive Ambient Matrix */}
      <DotGrid
        spacing={34}
        baseRadius={1}
        maxRadius={2.8}
        baseColor="rgba(255, 255, 255, 0.06)"
        activeColor="rgba(217, 119, 6, 0.5)"
        influenceRadius={140}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        {/* Cinematic Glowing Stage with Concept Logo (Inspired by Reference Video) */}
        <CinematicLogoSplash />

        {/* Dynamic Brand Title & Invariant Subtext */}
        <div className="space-y-2 mt-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-widest text-white">
            <ShinyText shineColor="rgba(245, 158, 11, 0.9)" speed={3}>
              CONCEPT
            </ShinyText>
          </h1>
          <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">
            Engineering Mental Models in &le;90s
          </p>
        </div>

        {/* Status indicator bar */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden relative border border-neutral-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ochre to-teal animate-marquee" />
          </div>
          <span className="text-[11px] font-mono text-neutral-500 tracking-wider">
            SYNCHRONIZING_INVARIANTS...
          </span>
        </div>
      </div>
    </div>
  );
}
