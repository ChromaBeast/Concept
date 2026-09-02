'use client';

import React from 'react';

export interface ShinyTextProps {
  children: React.ReactNode;
  shineColor?: string;
  speed?: number; // seconds per cycle
  className?: string;
}

/**
 * ShinyText sweeps a luminous reflective light sheen across typography
 * Inspired by C:\Projects\karma\prompts\text-animations\shiny-text.md
 */
export function ShinyText({
  children,
  shineColor = 'rgba(255, 255, 255, 0.95)',
  speed = 3.5,
  className = '',
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block bg-[linear-gradient(110deg,currentColor_35%,var(--shine-color)_50%,currentColor_65%)] bg-[length:250%_100%] bg-clip-text text-transparent animate-shine ${className}`}
      style={
        {
          '--shine-color': shineColor,
          animationDuration: `${speed}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}
