'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, History, Trash2, Tag as TagIcon, X } from 'lucide-react';
import { allSeedConcepts, seedTags } from '@/lib/seed';
import { storage } from '@/lib/storage';
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Chip } from '@/components/ui/Chip';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(storage.getRecentSearches());
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
    return allSeedConcepts.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchOneLiner = c.oneLiner.toLowerCase().includes(q);
      const matchDef = c.body.definition.toLowerCase().includes(q);
      const matchTag = c.tagIds.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchOneLiner || matchDef || matchTag;
    });
  }, [debouncedQuery]);

  const handleClearHistory = () => {
    storage.clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
          Search Engineering Reference
        </h1>
        <p className="text-sm text-dark-muted font-mono">
          Instant fulltext lookup across algorithms, distributed systems, OS internals, and interview patterns.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword, algorithm, pattern, or tag (e.g., CAP, LRU, TCP, Sharding)..."
          className="w-full bg-obsidian-card border border-obsidian-border rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-dark-muted focus:outline-none focus:border-electric font-mono shadow-sm"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* When query is empty: Recent Searches & Trending Tags */}
      {!debouncedQuery.trim() ? (
        <div className="space-y-8 pt-2 font-mono">
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-dark-muted uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-electric" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="hover:text-rose-400 flex items-center gap-1 transition-colors"
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
                    className="px-3 py-1.5 rounded-xl bg-obsidian-card hover:bg-obsidian-surface border border-obsidian-border text-xs text-dark-muted hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-dark-muted uppercase tracking-wider">
              <TagIcon className="w-3.5 h-3.5 text-electric" /> Trending Topics &amp; Tags
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {seedTags.map((tag) => (
                <Chip
                  key={tag.id}
                  size="sm"
                  onClick={() => setQuery(tag.name)}
                >
                  #{tag.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-4 font-mono">
          <div className="text-xs text-dark-muted">
            Found <strong>{searchResults.length}</strong> concepts for &ldquo;{debouncedQuery}&rdquo;
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((concept) => (
                <ConceptCard key={concept.id} concept={concept} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-obsidian-border rounded-2xl p-8 font-mono">
              <p className="text-white font-medium mb-1">No concepts matching &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-xs text-dark-muted">
                Try searching for broader terms like &quot;Cache&quot;, &quot;Graph&quot;, or &quot;Distributed&quot;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
