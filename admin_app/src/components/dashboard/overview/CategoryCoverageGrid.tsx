'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const CATEGORY_STATS = [
  { name: 'System Design', count: 32, max: 40, color: 'bg-amber-500' },
  { name: 'Data Structures & Algorithms', count: 28, max: 35, color: 'bg-teal' },
  { name: 'Databases & Storage', count: 24, max: 30, color: 'bg-blue-500' },
  { name: 'Operating Systems & Concurrency', count: 22, max: 30, color: 'bg-indigo-500' },
  { name: 'Networking & Protocols', count: 20, max: 25, color: 'bg-purple-500' },
  { name: 'DevOps & Reliability', count: 18, max: 25, color: 'bg-rose-500' },
  { name: 'OOP & Design Patterns', count: 16, max: 20, color: 'bg-emerald-500' },
  { name: 'Cloud & Infrastructure', count: 14, max: 20, color: 'bg-cyan-500' },
];

export function CategoryCoverageGrid() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Domain Knowledge Coverage</CardTitle>
            <CardDescription>Synthesized concepts across major software engineering domains.</CardDescription>
          </div>
          <Badge variant="accent">8 Domains Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          {CATEGORY_STATS.map((cat) => {
            const pct = Math.round((cat.count / cat.max) * 100);
            return (
              <div key={cat.name} className="p-3 rounded-xl border border-paper-border bg-paper-surface/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-paper-text truncate">{cat.name}</span>
                  <span className="text-paper-muted font-bold">{cat.count}/{cat.max}</span>
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
