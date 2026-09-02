'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Database, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { adminApi } from '@/lib/adminApi';

const CATEGORIES = [
  'system_design',
  'dsa',
  'databases',
  'operating_systems',
  'networking',
  'backend',
  'devops_infra',
  'oop_design_patterns',
];

export function PipelineRunnerCard({ onRefresh }: { onRefresh?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('system_design');
  const [batchSize, setBatchSize] = useState(3);
  const [logs, setLogs] = useState<string[]>(['[Ready] Cloud Engine idle. Ready for trigger executions.']);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleRunPipeline = async () => {
    setLoading(true);
    addLog(`Triggering Content Pipeline Batch (batchSize=${batchSize}, Model=Gemini 3.8 Flash)...`);
    try {
      const res = await adminApi.triggerEngine('pipeline', { batch: batchSize });
      addLog(`Pipeline result: Published=${res.published || 0}, Reviewed=${res.reviewed || 0}`);
      onRefresh?.();
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandRoadmap = async () => {
    setLoading(true);
    addLog(`Expanding Roadmap for category: "${selectedCategory}" via Gemini 3.8 Flash...`);
    try {
      const res = await adminApi.triggerEngine('expand', { category: selectedCategory });
      addLog(`Expansion result: Inserted ${res.inserted || 0} new topics to roadmap.`);
      onRefresh?.();
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDB = async () => {
    setLoading(true);
    addLog('Seeding initial verified roadmap topics into Appwrite Database...');
    try {
      const res = await adminApi.triggerEngine('seed');
      addLog(`Seed result: Inserted ${res.inserted || 0} baseline topics.`);
      onRefresh?.();
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ochre" />
              <span>Gemini Cloud Pipeline Console</span>
            </CardTitle>
            <CardDescription>
              Execute Go Cloud Functions on Appwrite Cloud with automatic 3.7 Flash &rarr; 3.6 Flash &rarr; Lite cascade.
            </CardDescription>
          </div>
          <Badge variant="accent">5 RPM Pacing Active</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-paper-border bg-paper-surface/50 space-y-3">
            <div className="text-xs font-bold text-paper-text font-mono">1. Run Synthesis Batch</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-16 h-8 rounded-lg border border-paper-border bg-paper-card px-2 text-xs font-mono text-center text-paper-text"
              />
              <span className="text-[11px] text-paper-muted font-mono">topics batch</span>
            </div>
            <Button size="sm" className="w-full" loading={loading} onClick={handleRunPipeline}>
              <Play className="w-3 h-3 mr-1" /> Synthesize Batch
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-paper-border bg-paper-surface/50 space-y-3">
            <div className="text-xs font-bold text-paper-text font-mono">2. Expand Category Roadmap</div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-8 rounded-lg border border-paper-border bg-paper-card px-2 text-xs font-mono text-paper-text"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Button size="sm" variant="secondary" className="w-full" loading={loading} onClick={handleExpandRoadmap}>
              <Sparkles className="w-3 h-3 mr-1 text-ochre" /> Expand Topics
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-paper-border bg-paper-surface/50 space-y-3">
            <div className="text-xs font-bold text-paper-text font-mono">3. Baseline Seed</div>
            <p className="text-[11px] text-paper-muted leading-relaxed">
              Populate Appwrite DB with 25 essential verified topics.
            </p>
            <Button size="sm" variant="outline" className="w-full" loading={loading} onClick={handleSeedDB}>
              <Database className="w-3 h-3 mr-1" /> Seed DB
            </Button>
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="rounded-xl border border-paper-border bg-paper-surface p-3 font-mono text-xs space-y-1.5 shadow-inner">
          <div className="flex items-center gap-2 text-[11px] text-paper-muted border-b border-paper-border pb-1.5 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-ochre" />
            <span>Execution Stream</span>
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-paper-text leading-tight">{log}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
