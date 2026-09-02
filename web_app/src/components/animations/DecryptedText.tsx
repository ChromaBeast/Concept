'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface DecryptedTextProps {
  text: string;
  speed?: number; // ms per frame
  maxIterations?: number;
  characters?: string;
  animateOn?: 'mount' | 'hover';
  className?: string;
}

const DEFAULT_CHARS = '0123456789ABCDEF!@#$%^&*<>[]{}';

/**
 * DecryptedText simulates terminal cryptographic decryption where glyphs scramble and lock in
 * Inspired by C:\Projects\karma\prompts\text-animations\decrypted-text.md
 */
export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 8,
  characters = DEFAULT_CHARS,
  animateOn = 'mount',
  className = '',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startDecryption = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / (maxIterations / 2)) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      if (iteration >= text.length * (maxIterations / 2)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }

      iteration += 1;
    }, speed);
  }, [text, speed, maxIterations, characters]);

  useEffect(() => {
    if (animateOn === 'mount') {
      startDecryption();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animateOn, startDecryption]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setIsHovered(true);
      startDecryption();
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className={`font-mono inline-block select-none ${className}`}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}
