'use client';

import React from 'react';
import { Logo } from './Logo';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-paper-bg text-paper-text select-none animate-fadeIn">
      <div className="flex flex-col items-center gap-6">
        {/* Simple Clean Concept Logo */}
        <Logo size="lg" asLink={false} />

        {/* Minimal Circular Loading Indicator */}
        <div className="w-5 h-5 border-2 border-paper-border border-t-ochre rounded-full animate-spin" />
      </div>
    </div>
  );
}
