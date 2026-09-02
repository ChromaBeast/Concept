'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Bookmark, Compass } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { storage } from '@/lib/storage';
import { CATEGORY_META } from '@/lib/constants';
import { Category, Concept } from '@/lib/types';
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Chip } from '@/components/ui/Chip';

export default function BookmarksPage() {
  const [allConcepts, setAllConcepts] = useState<Concept[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const items = await dataService.getAllConcepts();
      setAllConcepts(items);
      setBookmarkedIds(storage.getBookmarks());
      setLoading(false);
    };
    load();

    const updateBookmarks = () => {
      setBookmarkedIds(storage.getBookmarks());
    };
    window.addEventListener('concept_storage_updated', updateBookmarks);
    return () => window.removeEventListener('concept_storage_updated', updateBookmarks);
  }, []);

  const bookmarkedConcepts = useMemo(() => {
    return allConcepts.filter((c) => {
      if (!bookmarkedIds.includes(c.id)) return false;
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      return true;
    });
  }, [allConcepts, bookmarkedIds, selectedCategory]);

  const categoriesWithBookmarks = useMemo(() => {
    const cats = new Set<Category>();
    allConcepts
      .filter((c) => bookmarkedIds.includes(c.id))
      .forEach((c) => cats.add(c.category));
    return Array.from(cats);
  }, [allConcepts, bookmarkedIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16 font-sans">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-ochre/10 text-ochre border border-ochre/25">
            <Bookmark className="w-4 h-4 fill-current" />
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-paper-text font-sans">
            Saved Bookmarks
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-paper-muted font-mono">
          Your personal reference library of saved concepts for fast pre-interview review.
        </p>
      </div>

      {categoriesWithBookmarks.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Chip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
            All ({bookmarkedConcepts.length})
          </Chip>
          {categoriesWithBookmarks.map((cat) => (
            <Chip
              key={cat}
              active={selectedCategory === cat}
              colorHex={CATEGORY_META[cat]?.color}
              onClick={() => setSelectedCategory(cat)}
            >
              {CATEGORY_META[cat]?.label}
            </Chip>
          ))}
        </div>
      )}

      {bookmarkedConcepts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-paper-border rounded-2xl p-8 max-w-md mx-auto space-y-4 font-mono shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-paper-surface border border-paper-border flex items-center justify-center mx-auto text-paper-muted">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-paper-text mb-1">
              {loading ? 'Loading saved bookmarks...' : 'No bookmarks saved yet'}
            </h3>
            <p className="text-xs text-paper-muted leading-relaxed">
              Click the bookmark icon on any concept card while browsing to save it here for fast recall.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ochre hover:bg-ochre-dim text-white text-xs font-mono font-bold tracking-wider transition-colors shadow-sm"
          >
            <Compass className="w-4 h-4" /> Browse Concepts
          </Link>
        </div>
      )}
    </div>
  );
}
