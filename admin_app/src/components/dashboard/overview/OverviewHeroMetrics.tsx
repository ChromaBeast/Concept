'use client';

import React from 'react';
import { BookOpen, ListTree, Layers, Cpu, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 font-sans">
      {/* 1. Concepts Card */}
      <Card
        onClick={() => onNavigate('concepts')}
        className="p-5 hover:border-ochre/40 cursor-pointer transition-all duration-150 hover:shadow-md space-y-3.5 bg-paper-card"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-teal/10 border border-teal/20 text-teal flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            <span>Goal: 200</span>
            <ArrowUpRight className="w-3 h-3 ml-0.5 text-paper-muted" />
          </Badge>
        </div>
        <div>
          <div className="text-[11px] font-bold text-paper-muted uppercase tracking-wider font-mono">
            Published Concepts
          </div>
          <div className="text-3xl font-bold text-paper-text tracking-tight mt-1 font-sans">
            {stats.totalConcepts}
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] text-paper-muted font-mono">
            <span>Target Progress</span>
            <span className="font-semibold text-paper-text">{publishedProgress}%</span>
          </div>
          <Progress value={publishedProgress} indicatorClassName="bg-teal" />
        </div>
      </Card>

      {/* 2. Roadmap Queue */}
      <Card
        onClick={() => onNavigate('roadmap')}
        className="p-5 hover:border-ochre/40 cursor-pointer transition-all duration-150 hover:shadow-md space-y-3.5 bg-paper-card"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-ochre/10 border border-ochre/20 text-ochre flex items-center justify-center">
            <ListTree className="w-4 h-4" />
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            <span>Queue</span>
            <ArrowUpRight className="w-3 h-3 ml-0.5 text-paper-muted" />
          </Badge>
        </div>
        <div>
          <div className="text-[11px] font-bold text-paper-muted uppercase tracking-wider font-mono">
            Roadmap Topics
          </div>
          <div className="text-3xl font-bold text-paper-text tracking-tight mt-1 font-sans">
            {stats.totalRoadmap}
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] text-paper-muted font-mono">
            <span>Capacity</span>
            <span className="font-semibold text-paper-text">{roadmapProgress}%</span>
          </div>
          <Progress value={roadmapProgress} indicatorClassName="bg-ochre" />
        </div>
      </Card>

      {/* 3. Study Tracks */}
      <Card
        onClick={() => onNavigate('courses')}
        className="p-5 hover:border-ochre/40 cursor-pointer transition-all duration-150 hover:shadow-md space-y-3.5 bg-paper-card"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            <span>Tracks</span>
            <ArrowUpRight className="w-3 h-3 ml-0.5 text-paper-muted" />
          </Badge>
        </div>
        <div>
          <div className="text-[11px] font-bold text-paper-muted uppercase tracking-wider font-mono">
            Curated Tracks
          </div>
          <div className="text-3xl font-bold text-paper-text tracking-tight mt-1 font-sans">
            {stats.totalCourses}
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] text-paper-muted font-mono">
            <span>Playlists</span>
            <span className="font-semibold text-teal">Ready</span>
          </div>
          <Progress value={100} indicatorClassName="bg-blue-500" />
        </div>
      </Card>

      {/* 4. AI Engine */}
      <Card
        onClick={() => onNavigate('pipeline')}
        className="p-5 hover:border-ochre/40 cursor-pointer transition-all duration-150 hover:shadow-md space-y-3.5 bg-paper-card"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="flex items-center gap-1 text-[10px] text-teal font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            5 RPM
          </span>
        </div>
        <div>
          <div className="text-[11px] font-bold text-paper-muted uppercase tracking-wider font-mono">
            AI Engine Model
          </div>
          <div className="text-lg font-bold text-paper-text tracking-tight mt-1 font-sans truncate">
            Gemini 3.7 &rarr; 3.6 Flash
          </div>
        </div>
        <div className="text-[11px] text-paper-muted font-mono pt-1 flex items-center justify-between">
          <span>Go Cloud Runtime</span>
          <span className="font-semibold text-ochre">Cascading</span>
        </div>
      </Card>
    </div>
  );
}
