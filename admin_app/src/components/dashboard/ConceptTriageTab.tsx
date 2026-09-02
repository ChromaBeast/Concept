'use client';

import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pagination } from '../ui/pagination';
import { adminApi } from '@/lib/adminApi';
import { Concept } from '@/lib/types';
import { ConceptReviewDrawer } from './concepts/ConceptReviewDrawer';

const PAGE_SIZE = 15;

export function ConceptTriageTab() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const loadConcepts = async () => {
    setLoading(true);
    const res = await adminApi.getConcepts(statusFilter, page, PAGE_SIZE);
    setConcepts(res.items);
    setTotal(res.total);
    setLoading(false);
  };

  useEffect(() => {
    loadConcepts();
    // Auto-refresh every 20s to catch newly cron-generated concepts
    const interval = setInterval(loadConcepts, 20000);
    return () => clearInterval(interval);
  }, [statusFilter, page]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await adminApi.updateConceptStatus(id, status);
    if (selectedConcept && selectedConcept.$id === id) {
      setSelectedConcept({ ...selectedConcept, status: status as any });
    }
    loadConcepts();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-paper-border bg-paper-card shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-paper-text font-sans">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 rounded-xl border border-paper-border bg-paper-surface px-3 text-xs text-paper-text font-mono"
          >
            <option value="all">All Concepts ({total})</option>
            <option value="needs_review">Needs Review (Triage Queue)</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-teal font-mono">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="hidden sm:inline">Auto-Sync Live</span>
          </span>
          <Button size="sm" variant="secondary" onClick={loadConcepts} loading={loading}>
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Concepts Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Concept Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Read Time</TableHead>
            <TableHead>Visual</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concepts.length > 0 ? (
            concepts.map((c) => (
              <TableRow key={c.$id}>
                <TableCell>
                  <div className="font-bold text-paper-text font-sans">{c.title}</div>
                  <div className="text-[11px] text-paper-muted truncate max-w-xs sm:max-w-md">{c.oneLiner}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                <TableCell>~{c.estimatedReadSeconds}s</TableCell>
                <TableCell>
                  {c.visualAid && (
                    <Badge variant={c.heroImageUrl ? 'success' : 'warning'}>
                      <ImageIcon className="w-3 h-3 mr-1" />
                      {c.heroImageUrl ? 'Ready' : 'Queue'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {c.status === 'published' && <Badge variant="success">Published</Badge>}
                  {c.status === 'needs_review' && <Badge variant="accent"><Sparkles className="w-3 h-3 mr-1" /> Needs Review</Badge>}
                  {c.status === 'draft' && <Badge variant="default">Draft</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant={c.status === 'needs_review' ? 'primary' : 'secondary'} onClick={() => setSelectedConcept(c)}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-paper-muted">
                {loading ? 'Polling Appwrite Database for new concepts...' : 'No concepts found in this filter.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="pt-2">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Slide-over Review Drawer */}
      <ConceptReviewDrawer
        concept={selectedConcept}
        onClose={() => setSelectedConcept(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
