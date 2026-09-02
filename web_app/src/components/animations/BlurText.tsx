'use client';

import React, { useState, useEffect } from 'react';

export interface BlurTextProps {
  text: string;
  delay?: number;
  stagger?: number; // ms delay per word
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

/**
 * BlurText executes typographic entrance reveals transitioning from Gaussian blur to sharp text
 * Inspired by C:\Projects\karma\prompts\text-animations\blur-text.md
 */
export function BlurText({
  text,
  delay = 0,
  stagger = 35,
  className = '',
  as: Component = 'span',
}: BlurTextProps) {
  const [mounted, setMounted] = useState(false);
  const words = text.split(' ');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Component className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700 ease-out will-change-[filter,transform,opacity]"
          style={{
            transitionDelay: `${i * stagger}ms`,
            filter: mounted ? 'blur(0px)' : 'blur(10px)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0px)' : 'translateY(12px)',
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </Component>
  );
}
