'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Layers, Bookmark, User, Shield, ArrowRight, X } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { Concept, Course } from '@/lib/types';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [fetchedConcepts, fetchedCourses] = await Promise.all([
        dataService.getAllConcepts(),
        dataService.getCourses(),
      ]);
      setConcepts(fetchedConcepts);
      setCourses(fetchedCourses);
    };
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [
        { id: 'browse', title: 'Browse All Concepts', group: 'Navigation', icon: BookOpen, url: '/browse' },
        { id: 'courses', title: 'Explore Curated Tracks', group: 'Navigation', icon: Layers, url: '/courses' },
        { id: 'bookmarks', title: 'Saved References', group: 'Navigation', icon: Bookmark, url: '/bookmarks' },
        { id: 'profile', title: 'Learning Habit & Profile', group: 'Navigation', icon: User, url: '/profile' },
        { id: 'admin', title: 'Admin Console & Image Queue', group: 'Navigation', icon: Shield, url: '/admin' },
      ];
    }

    const matchedConcepts = concepts
      .filter((c) => c.title.toLowerCase().includes(q) || c.oneLiner.toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({
        id: `concept-${c.id}`,
        title: c.title,
        subtitle: c.oneLiner,
        group: 'Concepts',
        icon: BookOpen,
        url: `/concepts/${c.slug}`,
      }));

    const matchedCourses = courses
      .filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id: `course-${c.id}`,
        title: c.title,
        subtitle: `${c.conceptIds.length} concepts`,
        group: 'Tracks',
        icon: Layers,
        url: `/courses/${c.slug}`,
      }));

    return [...matchedConcepts, ...matchedCourses];
  }, [query, concepts, courses]);

  const selectResult = useCallback(
    (index: number) => {
      const item = results[index];
      if (item) {
        handleClose();
        router.push(item.url);
      }
    },
    [results, handleClose, router]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl bg-paper-card border border-paper-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-paper-border gap-3">
          <Search className="w-4 h-4 text-paper-muted shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % results.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
              } else if (e.key === 'Enter' && results.length > 0) {
                e.preventDefault();
                selectResult(selectedIndex);
              }
            }}
            placeholder="Search concepts, tracks, topics... (or ESC to close)"
            className="w-full bg-transparent text-sm text-paper-text placeholder:text-paper-muted focus:outline-none font-sans"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-paper-muted hover:text-paper-text">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-paper-muted bg-paper-surface border border-paper-border rounded-md">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-paper-muted">
              No matching published concepts or courses found.
            </div>
          ) : (
            results.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => selectResult(idx)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors select-none ${
                    isSelected
                      ? 'bg-ochre/15 border border-ochre/30 text-ochre'
                      : 'text-paper-text hover:bg-paper-surface border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-ochre/20 border-ochre/40 text-ochre' : 'bg-paper-surface border-paper-border text-paper-muted'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold truncate ${isSelected ? 'text-ochre' : 'text-paper-text'}`}>
                        {item.title}
                      </div>
                      {'subtitle' in item && item.subtitle && (
                        <div className="text-[11px] text-paper-muted truncate font-mono">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 transition-opacity ${isSelected ? 'opacity-100 text-ochre' : 'opacity-0'}`} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
