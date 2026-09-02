'use client';

import React from 'react';
import { LandingHero } from './LandingHero';
import { TickerMarquee } from './TickerMarquee';
import { StatsCounter } from './StatsCounter';
import { BentoCurriculum } from './BentoCurriculum';
import { ArchitectureFormula } from './ArchitectureFormula';
import { LiveConceptSandbox } from './LiveConceptSandbox';
import { GiantWatermarkFooter } from './GiantWatermarkFooter';

export function LandingPage() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 space-y-0">
      <LandingHero />
      <TickerMarquee />
      <StatsCounter />
      <BentoCurriculum />
      <ArchitectureFormula />
      <LiveConceptSandbox />
      <GiantWatermarkFooter />
    </div>
  );
}
