'use client';

import React, { useRef, useState, useCallback } from 'react';
import { calculateRelativeCoords, buildSpotlightGradient } from './spotlightMath';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  radius?: number;
  className?: string;
}

/**
 * SpotlightCard creates a hardware-accelerated radial spotlight tracking cursor coordinates
 * Inspired by C:\Projects\karma\prompts\components\spotlight-card.md
 */
export function SpotlightCard({
  children,
  spotlightColor = 'rgba(217, 119, 6, 0.12)', // Subtle warm ochre accent
  radius = 280,
  className = '',
  ...props
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rel = calculateRelativeCoords(e.clientX, e.clientY, containerRef.current);
    setCoords(rel);
    setOpacity(1);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-paper-border bg-paper-card transition-shadow duration-300 hover:shadow-md ${className}`}
      {...props}
    >
      {/* Spotlight Radial Overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: buildSpotlightGradient(coords.x, coords.y, radius, spotlightColor, opacity),
        }}
      />
      {/* Card Content */}
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
}
