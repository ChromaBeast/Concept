'use client';

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Concept, ConceptBody } from '@/lib/types';
import { ConceptWordCountMeter, countWords } from './ConceptWordCountMeter';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewDrawerProps {
  concept: Concept | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export function ConceptReviewDrawer({ concept, onClose, onUpdateStatus }: ReviewDrawerProps) {
  if (!concept) return null;

  const body = (concept.body || {}) as ConceptBody;
  const totalWords =
    countWords(body.definition) +
    countWords(body.whyItMatters) +
    countWords(body.commonPitfall) +
    countWords(body.interviewAngle);

  return (
    <Sheet open={Boolean(concept)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="space-y-6">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant={concept.status === 'published' ? 'success' : 'error'}>
              {concept.status}
            </Badge>
            <Badge variant="outline">{concept.category}</Badge>
            <Badge variant="outline">{concept.difficulty}</Badge>
          </div>
          <SheetTitle className="text-xl pt-1">{concept.title}</SheetTitle>
          <SheetDescription>{concept.oneLiner}</SheetDescription>
        </SheetHeader>

        {/* Word Count Compliance Checklist */}
        <div className="p-4 rounded-xl border border-paper-border bg-paper-surface/50 space-y-3 font-mono">
          <div className="text-[11px] font-bold uppercase text-paper-text tracking-wider">
            Microlearning Word Limits
          </div>
          <ConceptWordCountMeter label="1. Definition" text={body.definition} limit={40} />
          <ConceptWordCountMeter label="2. Why It Matters" text={body.whyItMatters} limit={60} />
          <ConceptWordCountMeter label="3. Common Pitfall" text={body.commonPitfall} limit={40} />
          <ConceptWordCountMeter label="Total Concept Word Count" text={String(totalWords)} limit={260} />
        </div>

        {/* Concept Body Sections */}
        <div className="space-y-4 font-sans text-xs">
          <div className="p-3.5 rounded-xl border border-paper-border bg-paper-surface/30 space-y-1">
            <div className="font-bold text-[10px] uppercase font-mono text-paper-muted">Definition</div>
            <p className="text-paper-text leading-relaxed">{body.definition}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-paper-border bg-paper-surface/30 space-y-1">
            <div className="font-bold text-[10px] uppercase font-mono text-paper-muted">Why It Matters</div>
            <p className="text-paper-text leading-relaxed">{body.whyItMatters}</p>
          </div>

          {body.example && (
            <div className="p-3.5 rounded-xl border border-paper-border bg-paper-surface/30 space-y-1 font-mono">
              <div className="font-bold text-[10px] text-ochre">// Code Example / Key Scenario</div>
              <pre className="text-[11px] overflow-x-auto text-paper-text whitespace-pre-wrap">{body.example}</pre>
            </div>
          )}

          {body.commonPitfall && (
            <div className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/10 space-y-1 text-rose-700 dark:text-rose-300">
              <div className="font-bold text-[10px] font-mono">⚠️ Common Pitfall</div>
              <p className="leading-relaxed">{body.commonPitfall}</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-paper-border font-mono">
          <Button size="sm" variant="success" onClick={() => onUpdateStatus(concept.$id, 'published')}>
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve &amp; Publish
          </Button>
          <Button size="sm" variant="danger" onClick={() => onUpdateStatus(concept.$id, 'needs_review')}>
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> Flag for Review
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
