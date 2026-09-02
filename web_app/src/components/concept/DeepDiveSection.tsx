'use client';

import React, { useState } from 'react';
import { DeepDiveContent } from '@/lib/types';
import { ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface DeepDiveSectionProps {
  deepDive?: DeepDiveContent;
  needsDeepDive?: boolean;
}

export function DeepDiveSection({ deepDive, needsDeepDive }: DeepDiveSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!deepDive || !deepDive.sections || deepDive.sections.length === 0) {
    return null;
  }

  const readMinutes = Math.max(2, Math.ceil((deepDive.estimatedReadSeconds || 360) / 60));

  return (
    <div className="rounded-xl border border-paper-border bg-paper-surface/60 overflow-hidden shadow-sm transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-paper-card/60 transition-colors group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal">
                Go Deeper
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-paper-border/60 text-paper-muted">
                ~{readMinutes} min read
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-paper-text group-hover:text-teal transition-colors mt-0.5 truncate">
              {deepDive.title || 'In-Depth Architectural & Protocol Mechanics'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-paper-muted group-hover:text-paper-text transition-colors flex-shrink-0 ml-3">
          <span className="text-xs font-mono hidden sm:inline">
            {isOpen ? 'Collapse' : 'Explore'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-paper-border bg-paper-bg space-y-6 animate-fadeIn">
          {deepDive.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2.5">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-paper-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                {sec.heading}
              </h4>
              <p className="text-sm sm:text-base text-paper-text leading-relaxed whitespace-pre-line">
                {sec.content}
              </p>
              {sec.codeSnippet && (
                <div className="pt-2">
                  <CodeBlock code={sec.codeSnippet} title={`${sec.heading} code`} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
