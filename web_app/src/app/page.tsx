'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { LandingPage } from '@/components/landing/LandingPage';
import { LearningDashboard } from '@/components/dashboard/LearningDashboard';
import { LayoutGrid, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="space-y-6">
      {/* Top View Mode Switcher (Discreet Floating Toggle) */}
      <div className="flex justify-end items-center pb-2">
        <div className="inline-flex items-center p-1 rounded-xl border border-obsidian-border bg-obsidian-card text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('landing')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              viewMode === 'landing'
                ? 'bg-electric text-obsidian-bg font-bold'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              viewMode === 'dashboard'
                ? 'bg-electric text-obsidian-bg font-bold'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Daily Feed</span>
          </button>
        </div>
      </div>

      {viewMode === 'landing' ? <LandingPage /> : <LearningDashboard />}
    </div>
  );
}
