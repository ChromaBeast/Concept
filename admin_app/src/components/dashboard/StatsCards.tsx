'use client';

import React from 'react';
import { BookOpen, ListTree, Layers, Cpu, Database } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface StatsCardsProps {
  stats: {
    totalConcepts: number;
    totalRoadmap: number;
    totalCourses: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      <Card className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/25 text-teal flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-paper-muted">Published Concepts</div>
          <div className="text-2xl font-bold text-paper-text font-sans">{stats.totalConcepts}</div>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-ochre/10 border border-ochre/25 text-ochre flex items-center justify-center shrink-0">
          <ListTree className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-paper-muted">Roadmap Topics</div>
          <div className="text-2xl font-bold text-paper-text font-sans">{stats.totalRoadmap}</div>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-paper-muted">Curated Tracks</div>
          <div className="text-2xl font-bold text-paper-text font-sans">{stats.totalCourses}</div>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-paper-muted">AI Engine Runtime</div>
          <div className="text-sm font-bold text-paper-text">Go 1.26 + Gemini</div>
        </div>
      </Card>
    </div>
  );
}
