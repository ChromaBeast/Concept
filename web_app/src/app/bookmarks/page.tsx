'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Bookmark, Compass } from 'lucide-react';
import { allSeedConcepts } from '@/lib/seed';
import { storage } from '@/lib/storage';
import { CATEGORY_META } from '@/lib/constants';
import { Category } from '@/lib/types';
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Chip } from '@/components/ui/Chip';

export default function BookmarksPage() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  useEffect(() => {
    const updateBookmarks = () => {
      setBookmarkedIds(storage.getBookmarks());
    };
    updateBookmarks();
    window.addEventListener('concept_storage_updated', updateBookmarks);
    return () => window.removeEventListener('concept_storage_updated', updateBookmarks);
  }, []);

  const bookmarkedConcepts = useMemo(() => {
    return allSeedConcepts.filter((c) => {
      if (!bookmarkedIds.includes(c.id)) return false;
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      return true;
    });
  }, [bookmarkedIds, selectedCategory]);

  const categoriesWithBookmarks = useMemo(() => {
    const cats = new Set<Category>();
    allSeedConcepts
      .filter((c) => bookmarkedIds.includes(c.id))
      .forEach((c) => cats.add(c.category));
    return Array.from(cats);
  }, [bookmarkedIds]);

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/30">
            <Bookmark className="w-4 h-4 fill-current" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-dark-text">
            Saved Bookmarks
          </h1>
        </div>
        <p className="text-sm text-dark-muted">
          Your personal library of saved concepts for fast pre-interview review.
        </p>
      </div>

      {categoriesWithBookmarks.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Chip
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            All ({bookmarkedIds.length})
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-dark-border rounded-2xl p-8 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center mx-auto text-dark-muted">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-dark-text mb-1">No bookmarks saved yet</h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              Click the bookmark icon on any concept card while browsing to save it here for fast recall.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Compass className="w-4 h-4" /> Browse Concepts
          </Link>
        </div>
      )}
    </div>
  );
}
