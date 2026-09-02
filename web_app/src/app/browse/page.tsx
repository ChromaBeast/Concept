'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Search } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { CATEGORY_META, DIFFICULTY_META } from '@/lib/constants';
import { CATEGORY_DOMAINS } from '@/lib/domains';
import { Category, Difficulty, Concept } from '@/lib/types';
import { ConceptCard } from '@/components/concept/ConceptCard';
import { Chip } from '@/components/ui/Chip';

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'all';

  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    dataService.getAllConcepts().then(setConcepts);
  }, []);

  const activeDomain = useMemo(
    () => CATEGORY_DOMAINS.find((d) => d.id === selectedDomain) || CATEGORY_DOMAINS[0],
    [selectedDomain]
  );

  const availableCategories: (Category | 'all')[] = useMemo(() => {
    return ['all', ...activeDomain.categories];
  }, [activeDomain]);

  const difficulties: (Difficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredConcepts = useMemo(() => {
    return concepts.filter((c) => {
      if (c.status === 'needs_review') return false;
      if (selectedDomain !== 'all' && !activeDomain.categories.includes(c.category)) return false;
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchOneLiner = c.oneLiner.toLowerCase().includes(q);
        if (!matchTitle && !matchOneLiner) return false;
      }
      return true;
    });
  }, [concepts, selectedDomain, activeDomain, selectedCategory, selectedDifficulty, query]);

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase font-display">
          Concept Catalog
        </h1>
        <p className="text-xs sm:text-sm text-dark-muted font-mono">
          Dense, structured 90-second references organized into intuitive domain clusters.
        </p>
      </div>

      {/* Domain Clusters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_DOMAINS.map((domain) => {
          const isSelected = domain.id === selectedDomain;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => {
                setSelectedDomain(domain.id);
                if (selectedCategory !== 'all' && !domain.categories.includes(selectedCategory as Category)) {
                  setSelectedCategory('all');
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-electric text-obsidian-bg border-electric shadow-sm'
                  : 'bg-obsidian-card text-dark-muted hover:text-dark-text border-obsidian-border'
              }`}
            >
              {domain.label}
            </button>
          );
        })}
      </div>

      {/* Category Pills within Active Domain */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {availableCategories.map((cat) => (
            <Chip
              key={cat}
              active={selectedCategory === cat}
              colorHex={cat === 'all' ? undefined : CATEGORY_META[cat]?.color}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All in Domain' : CATEGORY_META[cat]?.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Difficulty & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-obsidian-border bg-obsidian-card">
        <div className="flex items-center gap-2 flex-wrap font-mono">
          <span className="text-xs text-dark-muted font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Difficulty:
          </span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-electric/20 text-electric border-electric/40'
                  : 'bg-obsidian-surface text-dark-muted hover:text-dark-text border-obsidian-border'
              }`}
            >
              {diff === 'all' ? 'Any' : DIFFICULTY_META[diff].label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            placeholder="Filter list..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-obsidian-surface border border-obsidian-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-dark-text placeholder-dark-muted focus:outline-none focus:border-electric font-mono"
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-dark-muted font-mono">
        <span>Showing {filteredConcepts.length} concepts</span>
        {(selectedDomain !== 'all' || selectedCategory !== 'all' || selectedDifficulty !== 'all' || query) && (
          <button
            onClick={() => {
              setSelectedDomain('all');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setQuery('');
            }}
            className="text-electric hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Grid of Concepts */}
      {filteredConcepts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-obsidian-border rounded-2xl p-8 font-mono">
          <p className="text-dark-text font-medium mb-1">No matching concepts found</p>
          <p className="text-xs text-dark-muted">Try adjusting your domain, category, or difficulty filters.</p>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dark-muted font-mono">Loading catalog...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
