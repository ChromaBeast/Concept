'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Copy, Check, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { adminApi } from '@/lib/adminApi';
import { Concept } from '@/lib/types';

export function ImageStudioTab() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputUrls, setInputUrls] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const loadConcepts = async () => {
    setLoading(true);
    const all = await adminApi.getConcepts();
    const visual = all.filter((c) => c.visualAid && !c.heroImageUrl);
    setConcepts(visual);
    setLoading(false);
  };

  useEffect(() => {
    loadConcepts();
  }, []);

  const handleCopyPrompt = (id: string, prompt?: string) => {
    if (!prompt) return;
    const full = `Flat vector technical architecture illustration, 2-3 color minimal palette, square composition, no text: ${prompt}`;
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveUrl = async (id: string) => {
    const url = inputUrls[id];
    if (!url || !url.trim()) return;
    await adminApi.updateConceptHeroImage(id, url.trim());
    loadConcepts();
  };

  const handleFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    try {
      const viewUrl = await adminApi.uploadHeroImage(file);
      await adminApi.updateConceptHeroImage(id, viewUrl);
      loadConcepts();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="p-4 rounded-2xl border border-paper-border bg-paper-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-1">
          <div className="text-sm font-bold text-paper-text font-sans flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ochre" />
            <span>Visual Aid Generation &amp; Storage Studio</span>
          </div>
          <p className="text-xs text-paper-muted">
            Concepts with <code>visualAid = true</code> awaiting hero vector illustrations.
          </p>
        </div>
        <Badge variant="accent">{concepts.length} Pending Images</Badge>
      </div>

      {concepts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map((concept) => (
            <Card key={concept.$id} className="p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-paper-text font-sans">{concept.title}</h4>
                <Badge variant="outline">{concept.category}</Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-paper-surface border border-paper-border space-y-2">
                <div className="text-[10px] text-paper-muted uppercase font-bold tracking-wider">
                  Generated Prompt Brief:
                </div>
                <p className="text-xs text-paper-text italic font-sans leading-relaxed">
                  &ldquo;{concept.imagePrompt || `Infographic showing ${concept.title} invariant`}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(concept.$id, concept.imagePrompt)}
                  className="inline-flex items-center gap-1.5 text-xs text-ochre font-bold hover:underline pt-1 cursor-pointer"
                >
                  {copiedId === concept.$id ? <Check className="w-3.5 h-3.5 text-teal" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === concept.$id ? 'Copied to Clipboard!' : 'Copy Vector Prompt'}</span>
                </button>
              </div>

              <div className="space-y-2 pt-1">
                {/* Direct Appwrite Storage File Upload */}
                <div className="flex items-center gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(concept.$id, e)}
                      className="hidden"
                      disabled={uploadingId === concept.$id}
                    />
                    <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-paper-border hover:border-ochre bg-paper-surface text-paper-muted hover:text-paper-text cursor-pointer transition-colors text-center">
                      <Upload className="w-3.5 h-3.5 text-ochre" />
                      <span>{uploadingId === concept.$id ? 'Uploading to Bucket...' : 'Upload Image to Storage'}</span>
                    </div>
                  </label>
                </div>

                {/* Direct Image URL input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Or paste external CDN / image URL..."
                    value={inputUrls[concept.$id] || ''}
                    onChange={(e) => setInputUrls({ ...inputUrls, [concept.$id]: e.target.value })}
                  />
                  <Button size="sm" onClick={() => handleSaveUrl(concept.$id)}>
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-paper-border rounded-2xl p-8 font-mono text-paper-muted">
          <CheckCircle2 className="w-8 h-8 text-teal mx-auto mb-2" />
          <p className="font-bold text-paper-text">All Visual Concepts Have Images!</p>
          <p className="text-xs">No pending image queue items found in Appwrite Database.</p>
        </div>
      )}
    </div>
  );
}
