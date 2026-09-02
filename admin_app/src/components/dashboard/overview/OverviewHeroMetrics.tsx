'use client';

import React from 'react';
import { BookOpen, ListTree, Layers, Cpu, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OverviewHeroMetricsProps {
  stats: {
    totalConcepts: number;
    totalRoadmap: number;
    totalCourses: number;
  };
  onNavigate: (tab: string) => void;
}

export function OverviewHeroMetrics({ stats, onNavigate }: OverviewHeroMetricsProps) {
  const publishedProgress = Math.min(100, Math.round((stats.totalConcepts / 200) * 100));
  const roadmapProgress = Math.min(100, Math.round((stats.totalRoadmap / 250) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {/* 1. Concepts */}
      <Card
        onClick={() => onNavigate('concepts')}
        className="p-5 hover:border-ochre/50 cursor-pointer transition-all hover:shadow-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-teal/10 border border-teal/25 text-teal flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-paper-muted" />
        </div>
        <div>
          <div className="text-[11px] text-paper-muted uppercase tracking-wider font-bold">Published Concepts</div>
          <div className="text-2xl font-bold text-paper-text font-sans mt-0.5">{stats.totalConcepts}</div>
        </div>
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-paper-muted">
            <span>Goal: 200</span>
            <span>{publishedProgress}%</span>
          </div>
          <Progress value={publishedProgress} indicatorClassName="bg-teal" />
        </div>
      </Card>

      {/* 2. Roadmap */}
      <Card
        onClick={() => onNavigate('roadmap')}
        className="p-5 hover:border-ochre/50 cursor-pointer transition-all hover:shadow-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-ochre/10 border border-ochre/25 text-ochre flex items-center justify-center">
            <ListTree className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-paper-muted" />
        </div>
        <div>
          <div className="text-[11px] text-paper-muted uppercase tracking-wider font-bold">Roadmap Queue</div>
          <div className="text-2xl font-bold text-paper-text font-sans mt-0.5">{stats.totalRoadmap}</div>
        </div>
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-paper-muted">
            <span>Capacity: 250</span>
            <span>{roadmapProgress}%</span>
          </div>
          <Progress value={roadmapProgress} indicatorClassName="bg-ochre" />
        </div>
      </Card>

      {/* 3. Courses */}
      <Card
        onClick={() => onNavigate('courses')}
        className="p-5 hover:border-ochre/50 cursor-pointer transition-all hover:shadow-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-paper-muted" />
        </div>
        <div>
          <div className="text-[11px] text-paper-muted uppercase tracking-wider font-bold">Curated Tracks</div>
          <div className="text-2xl font-bold text-paper-text font-sans mt-0.5">{stats.totalCourses}</div>
        </div>
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] text-paper-muted">
            <span>Active Playlists</span>
            <span>100% Curated</span>
          </div>
          <Progress value={100} indicatorClassName="bg-blue-500" />
        </div>
      </Card>

      {/* 4. AI Engine */}
      <Card
        onClick={() => onNavigate('pipeline')}
        className="p-5 hover:border-ochre/50 cursor-pointer transition-all hover:shadow-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
        </div>
        <div>
          <div className="text-[11px] text-paper-muted uppercase tracking-wider font-bold">Cascade Engine</div>
          <div className="text-base font-bold text-paper-text font-sans mt-0.5">Gemini 3.7 &rarr; 3.6 Flash</div>
        </div>
        <div className="text-[11px] text-teal pt-1 flex items-center justify-between">
          <span>Go 1.26 Cloud Runtime</span>
          <span className="font-bold">5 RPM</span>
        </div>
      </Card>
    </div>
  );
}
