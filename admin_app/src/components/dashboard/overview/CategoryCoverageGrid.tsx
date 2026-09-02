'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const CATEGORY_STATS = [
  { name: 'System Design', count: 32, max: 40, color: 'bg-ochre' },
  { name: 'DSA Core Patterns', count: 28, max: 35, color: 'bg-teal' },
  { name: 'Databases & Storage', count: 24, max: 30, color: 'bg-blue-500' },
  { name: 'Operating Systems', count: 22, max: 30, color: 'bg-indigo-500' },
  { name: 'Networking & Protocols', count: 20, max: 25, color: 'bg-purple-500' },
  { name: 'DevOps & Reliability', count: 18, max: 25, color: 'bg-rose-500' },
  { name: 'OOP & Architecture', count: 16, max: 20, color: 'bg-emerald-500' },
  { name: 'Cloud Infrastructure', count: 14, max: 20, color: 'bg-cyan-500' },
];

export function CategoryCoverageGrid() {
  return (
    <Card className="shadow-sm bg-paper-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle>Domain Knowledge Coverage</CardTitle>
            <CardDescription>Synthesized concept depth across core software domains.</CardDescription>
          </div>
          <Badge variant="accent" className="font-mono text-[10px]">8 Domains</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans text-xs">
          {CATEGORY_STATS.map((cat) => {
            const pct = Math.round((cat.count / cat.max) * 100);
            return (
              <div
                key={cat.name}
                className="p-3 rounded-xl border border-paper-border bg-paper-surface/40 space-y-2 hover:bg-paper-surface/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-paper-text">{cat.name}</span>
                  <span className="text-paper-muted font-mono text-[11px] font-medium">{cat.count}/{cat.max}</span>
                </div>
                <Progress value={pct} indicatorClassName={cat.color} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
