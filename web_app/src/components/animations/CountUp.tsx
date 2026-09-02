'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number; // seconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * CountUp animates numeric values using exponential ease-out curves
 * Inspired by C:\Projects\karma\prompts\text-animations\count-up.md
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.8,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: CountUpProps) {
  const [value, setValue] = useState(from);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Exponential ease-out: 1 - 2^(-10 * progress)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = from + (to - from) * easeOut;

      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [from, to, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
