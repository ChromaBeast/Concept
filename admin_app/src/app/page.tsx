'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ListTree, FileCheck, Image as ImageIcon, Layers } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PipelineRunnerCard } from '@/components/dashboard/PipelineRunnerCard';
import { RoadmapManagerTab } from '@/components/dashboard/RoadmapManagerTab';
import { ConceptTriageTab } from '@/components/dashboard/ConceptTriageTab';
import { ImageStudioTab } from '@/components/dashboard/ImageStudioTab';
import { CoursesTab } from '@/components/dashboard/CoursesTab';
import { adminApi } from '@/lib/adminApi';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalConcepts: 18, totalRoadmap: 155, totalCourses: 3 });

  const loadStats = async () => {
    const s = await adminApi.getStats();
    setStats(s);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Top Metric Strip */}
      <StatsCards stats={stats} />

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto p-1.5 gap-1">
          <TabsTrigger value="pipeline" className="flex items-center gap-1.5 py-2">
            <Sparkles className="w-3.5 h-3.5 text-ochre" />
            <span>AI Pipeline</span>
          </TabsTrigger>

          <TabsTrigger value="roadmap" className="flex items-center gap-1.5 py-2">
            <ListTree className="w-3.5 h-3.5 text-ochre" />
            <span>Roadmap ({stats.totalRoadmap})</span>
          </TabsTrigger>

          <TabsTrigger value="triage" className="flex items-center gap-1.5 py-2">
            <FileCheck className="w-3.5 h-3.5 text-ochre" />
            <span>Review &amp; Triage</span>
          </TabsTrigger>

          <TabsTrigger value="images" className="flex items-center gap-1.5 py-2">
            <ImageIcon className="w-3.5 h-3.5 text-ochre" />
            <span>Image Studio</span>
          </TabsTrigger>

          <TabsTrigger value="courses" className="flex items-center gap-1.5 py-2">
            <Layers className="w-3.5 h-3.5 text-ochre" />
            <span>Study Tracks</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <PipelineRunnerCard onRefresh={loadStats} />
        </TabsContent>

        <TabsContent value="roadmap">
          <RoadmapManagerTab />
        </TabsContent>

        <TabsContent value="triage">
          <ConceptTriageTab />
        </TabsContent>

        <TabsContent value="images">
          <ImageStudioTab />
        </TabsContent>

        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
