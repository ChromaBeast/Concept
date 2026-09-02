'use client';

import React from 'react';
import { Logo } from './Logo';
import { ShinyText, DotGrid } from '@/components/animations';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-paper-bg text-paper-text select-none overflow-hidden animate-fadeIn">
      {/* Background Interactive Dot Matrix */}
      <DotGrid
        spacing={32}
        baseRadius={1}
        maxRadius={2.5}
        baseColor="rgba(150, 150, 150, 0.1)"
        activeColor="rgba(217, 119, 6, 0.4)"
        influenceRadius={120}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm px-6 text-center">
        {/* Animated Brand Vector Logo */}
        <div className="transform scale-125 transition-transform duration-500">
          <Logo size="lg" />
        </div>

        {/* Dynamic Status / Subtext */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-ochre">
            <ShinyText shineColor="rgba(255, 255, 255, 0.95)" speed={2.5}>
              SYNCHRONIZING_INVARIANTS...
            </ShinyText>
          </div>
          <p className="text-xs text-paper-muted font-mono leading-relaxed">
            Engineering mental models in &le;90s.
          </p>
        </div>

        {/* Minimalist Progress Loader Bar */}
        <div className="w-44 h-1 bg-paper-border rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ochre to-transparent animate-marquee" />
        </div>
      </div>
    </div>
  );
}
