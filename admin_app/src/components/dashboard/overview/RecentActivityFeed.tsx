'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const ACTIVITIES = [
  { id: '1', title: 'Synthesized: Raft Consensus Algorithm', time: '10m ago', type: 'published', category: 'System Design' },
  { id: '2', title: 'Expanded: 15 Databases Topics', time: '25m ago', type: 'expand', category: 'Databases' },
  { id: '3', title: 'Synthesized: Epoll vs Select I/O Multiplexing', time: '40m ago', type: 'published', category: 'Operating Systems' },
  { id: '4', title: 'Baseline Seed: 25 Roadmap Topics inserted', time: '1h ago', type: 'seed', category: 'Core' },
  { id: '5', title: 'Synthesized: Token Bucket Rate Limiting', time: '2h ago', type: 'published', category: 'System Design' },
];

export function RecentActivityFeed() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity Stream</CardTitle>
            <CardDescription>Live telemetry from Go Cloud Engine and Gemini pipelines.</CardDescription>
          </div>
          <Badge variant="outline">Real-time Stream</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 font-mono text-xs">
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3 rounded-xl border border-paper-border bg-paper-surface/30 hover:bg-paper-surface/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-ochre/15 text-ochre flex items-center justify-center shrink-0">
                  {act.type === 'published' && <CheckCircle2 className="w-3.5 h-3.5 text-teal" />}
                  {act.type === 'expand' && <Sparkles className="w-3.5 h-3.5 text-ochre" />}
                  {act.type === 'seed' && <Clock className="w-3.5 h-3.5 text-paper-muted" />}
                </div>
                <div>
                  <div className="font-semibold text-paper-text font-sans">{act.title}</div>
                  <div className="text-[10px] text-paper-muted">{act.category}</div>
                </div>
              </div>
              <span className="text-[10px] text-paper-muted">{act.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
