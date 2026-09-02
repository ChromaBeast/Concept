'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlignLeft } from 'lucide-react';

interface ConceptTableOfContentsProps {
  className?: string;
}

const SECTIONS = [
  { id: 'definition', label: 'Axiom Definition' },
  { id: 'why-it-matters', label: 'Why It Matters On The Job' },
  { id: 'code-example', label: 'Code & Scenario' },
  { id: 'pitfall', label: 'Production Pitfalls' },
  { id: 'interview-angle', label: 'Staff+ Interview Angle' },
  { id: 'quick-checks', label: 'Active Recall Drill' },
  { id: 'related', label: 'Related Concepts' },
];

export function ConceptTableOfContents({ className }: ConceptTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('definition');

  useEffect(() => {
    const handleScroll = () => {
      const positions = SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        return {
          id: sec.id,
          top: el ? el.getBoundingClientRect().top : Infinity,
        };
      });

      const active = positions.find((p) => p.top >= -60 && p.top <= 140);
      if (active && active.id !== activeId) {
        setActiveId(active.id);
      } else if (!active) {
        const above = positions.filter((p) => p.top < -60).sort((a, b) => b.top - a.top);
        if (above[0] && above[0].id !== activeId) {
          setActiveId(above[0].id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeId]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn('space-y-3 font-sans', className)}>
      <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-paper-muted">
        <AlignLeft className="w-3.5 h-3.5 text-ochre" />
        <span>On this concept</span>
      </div>

      <nav className="relative pl-3 border-l border-paper-border/80">
        <ul className="space-y-2.5 text-xs">
          {SECTIONS.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <li key={sec.id} className="relative">
                {isActive && (
                  <div className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-ochre rounded-full" />
                )}
                <button
                  type="button"
                  onClick={() => scrollTo(sec.id)}
                  className={cn(
                    'block w-full text-left transition-colors font-mono text-xs',
                    isActive
                      ? 'text-ochre font-bold'
                      : 'text-paper-muted hover:text-paper-text'
                  )}
                >
                  {sec.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
