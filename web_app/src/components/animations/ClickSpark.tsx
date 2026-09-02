'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { SparkParticle, createSparkBurst, updateParticles } from './sparkPhysics';

export interface ClickSparkProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  sparkCount?: number;
  sparkColors?: string[];
  className?: string;
}

/**
 * ClickSpark creates dynamic particle bursts on click with physics velocity and decay
 * Inspired by C:\Projects\karma\prompts\animations\click-spark.md
 */
export function ClickSpark({
  children,
  sparkCount = 12,
  sparkColors,
  className = '',
  ...props
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<SparkParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const renderLoop = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
    lastTimeRef.current = time;

    particlesRef.current = updateParticles(particlesRef.current, time, dt);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particlesRef.current) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }

    if (particlesRef.current.length > 0) {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animFrameIdRef.current = null;
      lastTimeRef.current = 0;
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      const newSparks = createSparkBurst(x, y, sparkCount, sparkColors);
      particlesRef.current.push(...newSparks);

      if (!animFrameIdRef.current) {
        lastTimeRef.current = performance.now();
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    },
    [sparkCount, sparkColors, renderLoop]
  );

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative ${className}`}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      />
      {children}
    </div>
  );
}
