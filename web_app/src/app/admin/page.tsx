'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Image as ImageIcon, Copy, Check, AlertCircle, Sparkles, Upload, CheckCircle2 } from 'lucide-react';
import { allSeedConcepts } from '@/lib/seed';
import { storage } from '@/lib/storage';
import { Concept } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'imageQueue' | 'needsReview'>('imageQueue');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [inputUrls, setInputUrls] = useState<Record<string, string>>({});
  const [reviewedConcepts, setReviewedConcepts] = useState<string[]>([]);

  useEffect(() => {
    setCustomImages(storage.getCustomImages());
  }, []);

  const imageQueueConcepts = allSeedConcepts.filter(
    (c) => c.visualAid && !c.heroImageUrl && !customImages[c.id]
  );

  const completedImageConcepts = allSeedConcepts.filter(
    (c) => c.visualAid && (c.heroImageUrl || customImages[c.id])
  );

  const needsReviewConcepts = allSeedConcepts.filter(
    (c) => c.status === 'needs_review' && !reviewedConcepts.includes(c.id)
  );

  const handleCopyPrompt = (id: string, prompt?: string) => {
    if (!prompt) return;
    const fullPrompt = `Flat vector technical illustration, 2-3 color minimal palette, square composition, no text: ${prompt}`;
    navigator.clipboard.writeText(fullPrompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveImageUrl = (id: string) => {
    const url = inputUrls[id];
    if (!url || !url.trim()) return;
    storage.setCustomImage(id, url.trim());
    setCustomImages(storage.getCustomImages());
    setInputUrls((prev) => ({ ...prev, [id]: '' }));
  };

  const handleApproveReview = (id: string) => {
    setReviewedConcepts((prev) => [...prev, id]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark-text">
            Admin Pipeline & Fallback Review
          </h1>
        </div>
        <p className="text-sm text-dark-muted">
          Manual Google Flow Image Queue and automated self-check triage fallback.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-dark-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('imageQueue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'imageQueue'
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/40'
              : 'text-dark-muted hover:text-dark-text hover:bg-dark-surface'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image Generation Queue ({imageQueueConcepts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('needsReview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'needsReview'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
              : 'text-dark-muted hover:text-dark-text hover:bg-dark-surface'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Needs Review ({needsReviewConcepts.length})</span>
        </button>
      </div>

      {/* Tab 1: Image Queue */}
      {activeTab === 'imageQueue' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-500/5 text-xs text-dark-muted space-y-1">
            <div className="font-semibold text-brand-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Google Flow Image Workflow:
            </div>
            <p>1. Copy prompt &rarr; 2. Generate in Google Flow with credits &rarr; 3. Paste image URL below.</p>
          </div>

          {imageQueueConcepts.length > 0 ? (
            <div className="space-y-4">
              {imageQueueConcepts.map((concept) => (
                <div key={concept.id} className="p-5 rounded-xl border border-dark-border bg-dark-card space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-dark-text">{concept.title}</h3>
                    <Badge variant="accent">Pending Hero Image</Badge>
                  </div>

                  <div className="p-3.5 rounded-lg bg-dark-surface border border-dark-border space-y-2">
                    <div className="text-[11px] text-dark-muted uppercase font-mono tracking-wider">
                      Generated Prompt Brief:
                    </div>
                    <p className="text-xs text-dark-text italic leading-relaxed font-mono">
                      &ldquo;{concept.imagePrompt}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(concept.id, concept.imagePrompt)}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium pt-1"
                    >
                      {copiedId === concept.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === concept.id ? 'Copied Prompt with Style Prefix!' : 'Copy Formatted Prompt'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste uploaded image URL (e.g., https://...)..."
                      value={inputUrls[concept.id] || ''}
                      onChange={(e) => setInputUrls({ ...inputUrls, [concept.id]: e.target.value })}
                      className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-xs text-dark-text placeholder-dark-muted focus:outline-none focus:border-brand-500"
                    />
                    <Button size="sm" onClick={() => handleSaveImageUrl(concept.id)}>
                      <Upload className="w-3.5 h-3.5 mr-1" /> Attach URL
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-dark-border rounded-xl text-dark-muted text-xs">
              All visual aid concepts have hero images attached!
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Needs Review */}
      {activeTab === 'needsReview' && (
        <div className="space-y-4">
          {needsReviewConcepts.length > 0 ? (
            needsReviewConcepts.map((concept) => (
              <div key={concept.id} className="p-5 rounded-xl border border-rose-500/30 bg-dark-card space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-dark-text">{concept.title}</h3>
                  <Badge variant="error">Self-Check Flagged</Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-rose-400">Failure Reasons:</div>
                  <ul className="text-xs text-dark-muted list-disc list-inside space-y-1">
                    {concept.needsReviewReasons?.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button size="sm" onClick={() => handleApproveReview(concept.id)}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Override & Publish
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-dark-border rounded-xl text-dark-muted text-xs">
              No concepts currently waiting for review! The automated pipeline is 100% clean.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
