'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Eye, RefreshCw, FileText } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { adminApi } from '@/lib/adminApi';
import { Concept, ConceptBody } from '@/lib/types';

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

  const bodyObj = (selectedConcept?.body || {}) as ConceptBody;

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
                  <div className="text-[11px] text-paper-muted truncate max-w-md">{c.oneLiner}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                <TableCell>~{c.estimatedReadSeconds}s</TableCell>
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
              <TableCell colSpan={5} className="text-center py-8 text-paper-muted">
                {loading ? 'Loading concepts from Appwrite DB...' : 'No concepts found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Review & Approve Modal */}
      {selectedConcept && (
        <Dialog open={Boolean(selectedConcept)} onOpenChange={(open) => !open && setSelectedConcept(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant={selectedConcept.status === 'published' ? 'success' : 'error'}>
                  {selectedConcept.status}
                </Badge>
                <Badge variant="outline">{selectedConcept.category}</Badge>
              </div>
              <DialogTitle className="text-xl pt-1">{selectedConcept.title}</DialogTitle>
              <DialogDescription>{selectedConcept.oneLiner}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 font-sans text-xs">
              <div className="p-3 rounded-xl bg-paper-surface border border-paper-border space-y-1">
                <div className="font-bold text-paper-text uppercase font-mono text-[10px]">Definition (≤40 words)</div>
                <p className="text-paper-muted leading-relaxed">{bodyObj.definition}</p>
              </div>

              <div className="p-3 rounded-xl bg-paper-surface border border-paper-border space-y-1">
                <div className="font-bold text-paper-text uppercase font-mono text-[10px]">Why It Matters (≤60 words)</div>
                <p className="text-paper-muted leading-relaxed">{bodyObj.whyItMatters}</p>
              </div>

              {bodyObj.example && (
                <div className="p-3 rounded-xl bg-paper-surface border border-paper-border space-y-1 font-mono">
                  <div className="font-bold text-ochre text-[10px]">// Code Example / Scenario</div>
                  <pre className="text-[11px] overflow-x-auto text-paper-text">{bodyObj.example}</pre>
                </div>
              )}

              {selectedConcept.needsReviewReasons && selectedConcept.needsReviewReasons.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 font-mono">
                  <div className="font-bold mb-1">Flagged Self-Check Reasons:</div>
                  <ul className="list-disc list-inside">
                    {selectedConcept.needsReviewReasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-border font-mono">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleUpdateStatus(selectedConcept.$id, 'published')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve &amp; Publish
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleUpdateStatus(selectedConcept.$id, 'needs_review')}
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> Flag for Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
