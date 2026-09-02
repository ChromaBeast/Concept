'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bookmark, CheckCircle2 } from 'lucide-react';

interface ConceptTableOfContentsProps {
  className?: string;
  hasVisualAid?: boolean;
}

const SECTIONS = [
  { id: 'definition', label: '01. Definition' },
  { id: 'why-it-matters', label: '02. Why It Matters' },
  { id: 'code-example', label: '03. Code & Scenario' },
  { id: 'pitfall', label: '04. Common Pitfalls' },
  { id: 'interview-angle', label: '05. Interview Angle' },
  { id: 'quick-checks', label: '06. Quick Check Drill' },
  { id: 'related', label: '07. Related Concepts' },
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

      const active = positions.find((p) => p.top >= -80 && p.top <= 160);
      if (active && active.id !== activeId) {
        setActiveId(active.id);
      } else if (!active) {
        const above = positions.filter((p) => p.top < -80).sort((a, b) => b.top - a.top);
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
      const offset = 90;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn('space-y-3 font-mono', className)}>
      <h4 className="text-xs font-bold uppercase tracking-wider text-electric flex items-center gap-1.5">
        <span>On this concept</span>
      </h4>
      <nav>
        <ul className="space-y-1.5 text-xs">
          {SECTIONS.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(sec.id)}
                  className={cn(
                    'block w-full text-left py-1 px-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-electric/15 text-electric font-bold border-l-2 border-electric'
                      : 'text-dark-muted hover:text-dark-text hover:bg-obsidian-surface'
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
