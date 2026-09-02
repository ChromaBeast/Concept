'use client';

import React from 'react';
import { CONCEPT_LOGO_PATHS } from './splashSvgPaths';

export function CinematicLogoSplash() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* 3D Perspective Stage Container */}
      <div className="relative w-72 sm:w-96 h-48 sm:h-60 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(217,119,6,0.15)] flex items-center justify-center overflow-hidden">
        {/* Subtle Ambient Radial Light Bloom */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,rgba(13,148,136,0.08)_40%,transparent_70%)] animate-pulse" />

        {/* Screen Specular Corner Accents */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-ochre/40" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-ochre/40" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-ochre/40" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-ochre/40" />

        {/* Animated Glowing Vector Concept Logo */}
        <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          <svg
            viewBox="0 0 88 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Linear Neon Energy Gradients */}
              <linearGradient id="conceptOchreLaser" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="50%" stopColor="#d97706" stopOpacity="1" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
              </linearGradient>

              {/* Dynamic Glow Filter */}
              <filter id="cinematicGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Faint Guide Geometry (Base Inactive Layer) */}
            <path
              d={CONCEPT_LOGO_PATHS.outerBracket}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d={CONCEPT_LOGO_PATHS.coreRays}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Glowing Connecting Synapse Rays */}
            <path
              d={CONCEPT_LOGO_PATHS.coreRays}
              stroke="url(#conceptOchreLaser)"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              className="animate-[marquee_3s_linear_infinite]"
              filter="url(#cinematicGlow)"
              opacity="0.85"
            />

            {/* Primary Glowing Outer Laser Sweep */}
            <path
              d={CONCEPT_LOGO_PATHS.outerBracket}
              stroke="url(#conceptOchreLaser)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray="220"
              strokeDashoffset="220"
              className="animate-[laserTrace_2.4s_ease-in-out_infinite]"
              filter="url(#cinematicGlow)"
            />

            {/* Core Neural Node */}
            <circle
              cx={CONCEPT_LOGO_PATHS.coreNode.cx}
              cy={CONCEPT_LOGO_PATHS.coreNode.cy}
              r={CONCEPT_LOGO_PATHS.coreNode.r}
              fill="#d97706"
              filter="url(#cinematicGlow)"
              className="animate-pulse"
            />
            <circle
              cx={CONCEPT_LOGO_PATHS.coreNode.cx}
              cy={CONCEPT_LOGO_PATHS.coreNode.cy}
              r="3.5"
              fill="#ffffff"
            />

            {/* Upper & Lower Terminal Anchors */}
            <circle
              cx={CONCEPT_LOGO_PATHS.upperAnchor.cx}
              cy={CONCEPT_LOGO_PATHS.upperAnchor.cy}
              r={CONCEPT_LOGO_PATHS.upperAnchor.r}
              fill="#fbbf24"
              filter="url(#cinematicGlow)"
            />
            <circle
              cx={CONCEPT_LOGO_PATHS.lowerAnchor.cx}
              cy={CONCEPT_LOGO_PATHS.lowerAnchor.cy}
              r={CONCEPT_LOGO_PATHS.lowerAnchor.r}
              fill="#14b8a6"
              filter="url(#cinematicGlow)"
            />
          </svg>
        </div>

        {/* Laser Grid Pedestal Reflection at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-ochre/15 to-transparent pointer-events-none" />
      </div>

      {/* 3D Perspective Base Pedestal Tiles (matching the reference stage) */}
      <div className="w-80 sm:w-[420px] h-6 -mt-2 bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-b-xl border-x border-b border-neutral-800 flex items-center justify-around px-6">
        <div className="w-12 h-1 bg-ochre/40 rounded-full animate-pulse" />
        <div className="w-16 h-1 bg-teal/30 rounded-full" />
        <div className="w-12 h-1 bg-ochre/40 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
