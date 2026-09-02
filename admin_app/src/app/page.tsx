'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CommandMenuDialog } from '@/components/layout/CommandMenuDialog';
import { DashboardOverviewView } from '@/components/dashboard/overview/DashboardOverviewView';
import { PipelineRunnerCard } from '@/components/dashboard/PipelineRunnerCard';
import { RoadmapManagerTab } from '@/components/dashboard/RoadmapManagerTab';
import { ConceptTriageTab } from '@/components/dashboard/ConceptTriageTab';
import { ImageStudioTab } from '@/components/dashboard/ImageStudioTab';
import { CoursesTab } from '@/components/dashboard/CoursesTab';
import { adminApi } from '@/lib/adminApi';

export default function AdminDashboardPage() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [stats, setStats] = useState({ totalConcepts: 18, totalRoadmap: 155, totalCourses: 3 });
  const [commandOpen, setCommandOpen] = useState(false);

  const loadStats = async () => {
    const s = await adminApi.getStats();
    setStats(s);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-paper-bg font-sans">
        {/* Collapsible Modern Sidebar */}
        <DashboardSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          stats={stats}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-paper-bg overflow-x-hidden">
          <DashboardHeader
            currentTab={currentTab}
            onOpenCommand={() => setCommandOpen(true)}
            onSelectTab={setCurrentTab}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {currentTab === 'overview' && (
              <DashboardOverviewView stats={stats} onNavigate={setCurrentTab} />
            )}

            {currentTab === 'pipeline' && (
              <PipelineRunnerCard onRefresh={loadStats} />
            )}

            {currentTab === 'roadmap' && (
              <RoadmapManagerTab />
            )}

            {currentTab === 'concepts' && (
              <ConceptTriageTab />
            )}

            {currentTab === 'media' && (
              <ImageStudioTab />
            )}

            {currentTab === 'courses' && (
              <CoursesTab />
            )}
          </main>
        </div>
      </div>

      {/* Global Command Palette */}
      <CommandMenuDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onNavigate={setCurrentTab}
      />
    </AuthGuard>
  );
}
