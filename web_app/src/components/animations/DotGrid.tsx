'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { renderDotGrid, DotGridConfig } from './dotGridRenderer';

export interface DotGridProps {
  spacing?: number;
  baseRadius?: number;
  maxRadius?: number;
  baseColor?: string;
  activeColor?: string;
  influenceRadius?: number;
  className?: string;
}

/**
 * DotGrid renders an interactive 2D dot matrix background responding to cursor proximity
 * Inspired by C:\Projects\karma\prompts\backgrounds\dot-grid.md
 */
export function DotGrid({
  spacing = 28,
  baseRadius = 1.2,
  maxRadius = 3.5,
  baseColor = 'rgba(150, 150, 150, 0.15)',
  activeColor = 'rgba(217, 119, 6, 0.65)',
  influenceRadius = 130,
  className = '',
}: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovered: false });
  const animFrameRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config: DotGridConfig = {
      spacing,
      baseRadius,
      maxRadius,
      baseColor,
      activeColor,
      influenceRadius,
    };

    renderDotGrid(
      ctx,
      canvas.width,
      canvas.height,
      mouseRef.current.x,
      mouseRef.current.y,
      mouseRef.current.isHovered,
      config
    );
  }, [spacing, baseRadius, maxRadius, baseColor, activeColor, influenceRadius]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    };
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(() => {
        draw();
        animFrameRef.current = null;
      });
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000, isHovered: false };
    draw();
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      draw();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto absolute inset-0 -z-10 h-full w-full ${className}`}
    />
  );
}
