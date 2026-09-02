'use client';

import React from 'react';
import { OverviewHeroMetrics } from './OverviewHeroMetrics';
import { CategoryCoverageGrid } from './CategoryCoverageGrid';
import { RecentActivityFeed } from './RecentActivityFeed';
import { TriagePriorityAlert } from './TriagePriorityAlert';

interface DashboardOverviewViewProps {
  stats: {
    totalConcepts: number;
    totalRoadmap: number;
    totalCourses: number;
  };
  onNavigate: (tab: string) => void;
}

export function DashboardOverviewView({ stats, onNavigate }: DashboardOverviewViewProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* 1. Top KPI Metrics Strip */}
      <OverviewHeroMetrics stats={stats} onNavigate={onNavigate} />

      {/* 2. Priority Editorial Triage Callout */}
      <TriagePriorityAlert count={2} onReview={() => onNavigate('concepts')} />

      {/* 3. Category Distribution & Live Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryCoverageGrid />
        <RecentActivityFeed />
      </div>
    </div>
  );
}
