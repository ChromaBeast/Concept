'use client';

import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { adminApi } from '@/lib/adminApi';
import { Concept } from '@/lib/types';
import { ConceptReviewDrawer } from './concepts/ConceptReviewDrawer';

export function ConceptTriageTab() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);

  const loadConcepts = async () => {
    setLoading(true);
    const data = await adminApi.getConcepts(statusFilter);
    setConcepts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadConcepts();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await adminApi.updateConceptStatus(id, status);
    if (selectedConcept && selectedConcept.$id === id) {
      setSelectedConcept({ ...selectedConcept, status: status as any });
    }
    loadConcepts();
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-paper-border bg-paper-card shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-paper-text">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-xl border border-paper-border bg-paper-surface px-3 text-xs text-paper-text"
          >
            <option value="all">All Concepts ({concepts.length})</option>
            <option value="needs_review">Needs Review</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <Button size="sm" variant="secondary" onClick={loadConcepts} loading={loading}>
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
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
                  {c.status === 'needs_review' && <Badge variant="error">Needs Review</Badge>}
                  {c.status === 'draft' && <Badge variant="default">Draft</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedConcept(c)}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-paper-muted">
                {loading ? 'Loading concepts from Appwrite DB...' : 'No concepts found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Slide-over Review Drawer */}
      <ConceptReviewDrawer
        concept={selectedConcept}
        onClose={() => setSelectedConcept(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
