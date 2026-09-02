'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, History, Trash2, Tag as TagIcon, X } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { storage } from '@/lib/storage';
import { Concept } from '@/lib/types';
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Chip } from '@/components/ui/Chip';

export default function SearchPage() {
  const [allConcepts, setAllConcepts] = useState<Concept[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const items = await dataService.getAllConcepts();
      setAllConcepts(items);
      setRecentSearches(storage.getRecentSearches());
    };
    load();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim().length >= 2) {
        storage.addRecentSearch(query.trim());
        setRecentSearches(storage.getRecentSearches());
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    return allConcepts.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchOneLiner = c.oneLiner.toLowerCase().includes(q);
      const matchDef = c.body?.definition?.toLowerCase().includes(q) || false;
      const matchTag = c.tagIds?.some((t) => t.toLowerCase().includes(q)) || false;
      return matchTitle || matchOneLiner || matchDef || matchTag;
    });
  }, [debouncedQuery, allConcepts]);

  const handleClearHistory = () => {
    storage.clearRecentSearches();
    setRecentSearches([]);
  };

  const trendingTags = useMemo(() => {
    const tagSet = new Set<string>();
    allConcepts.forEach((c) => c.tagIds?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 15);
  }, [allConcepts]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16 font-sans">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-paper-text font-sans">
          Search Engineering Reference
        </h1>
        <p className="text-xs sm:text-sm text-paper-muted font-mono">
          Instant fulltext lookup across algorithms, distributed systems, OS internals, and interview patterns.
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-paper-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search keywords, invariants, trade-offs (e.g., CAP, LRU, TCP, Sharding)..."
          className="w-full bg-paper-card border border-paper-border rounded-2xl pl-11 pr-10 py-3 text-sm text-paper-text placeholder:text-paper-muted focus:outline-none focus:border-ochre font-mono shadow-sm"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-paper-muted hover:text-paper-text p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!debouncedQuery.trim() ? (
        <div className="space-y-8 pt-2 font-mono">
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-paper-muted uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-ochre" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="hover:text-rose-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-paper-card hover:bg-paper-surface border border-paper-border text-xs text-paper-muted hover:text-paper-text transition-colors shadow-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {trendingTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-paper-muted uppercase tracking-wider">
                <TagIcon className="w-3.5 h-3.5 text-ochre" /> Trending Topics &amp; Tags
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {trendingTags.map((tag) => (
                  <Chip key={tag} size="sm" onClick={() => setQuery(tag)}>
                    #{tag}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 font-mono">
          <div className="text-xs text-paper-muted">
            Found <strong>{searchResults.length}</strong> concepts for &ldquo;{debouncedQuery}&rdquo;
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map((concept) => (
                <ConceptCard key={concept.id} concept={concept} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-paper-border rounded-2xl p-8 font-mono shadow-sm">
              <p className="text-paper-text font-medium mb-1">No concepts matching &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-xs text-paper-muted">
                Try searching for broader terms like &quot;Cache&quot;, &quot;Graph&quot;, or &quot;Distributed&quot;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
