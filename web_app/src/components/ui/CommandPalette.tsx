"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Layers, Bookmark, User, Shield, ArrowRight, X } from "lucide-react";
import { allSeedConcepts, seedCourses } from "../../lib/seed";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return [
        { id: "browse", title: "Browse all concepts", category: "Navigation", icon: BookOpen, url: "/browse" },
        { id: "courses", title: "Explore structured tracks", category: "Navigation", icon: Layers, url: "/courses" },
        { id: "bookmarks", title: "View saved bookmarks", category: "Navigation", icon: Bookmark, url: "/bookmarks" },
        { id: "profile", title: "View learning profile & streaks", category: "Navigation", icon: User, url: "/profile" },
        { id: "admin", title: "Admin dashboard & image queue", category: "Navigation", icon: Shield, url: "/admin" },
      ];
    }

    const matchedConcepts = allSeedConcepts.filter(
      (c) => c.title.toLowerCase().includes(q) || c.oneLiner.toLowerCase().includes(q)
    ).slice(0, 5).map((c) => ({
      id: `concept-${c.id}`,
      title: c.title,
      subtitle: c.oneLiner,
      category: "Concept",
      icon: BookOpen,
      url: `/concepts/${c.slug}`,
    }));

    const matchedCourses = seedCourses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    ).slice(0, 3).map((c) => ({
      id: `course-${c.id}`,
      title: c.title,
      subtitle: `${c.conceptIds.length} concepts`,
      category: "Track",
      icon: Layers,
      url: `/courses/${c.slug}`,
    }));

    return [...matchedConcepts, ...matchedCourses];
  }, [query]);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
          <Search className="w-5 h-5 text-text-tertiary shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % results.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
              } else if (e.key === "Enter" && results.length > 0) {
                e.preventDefault();
                selectResult(selectedIndex);
              }
            }}
            placeholder="Search concepts, courses, topics... (or ESC to close)"
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 text-text-tertiary hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-text-tertiary bg-surface-variant border border-border rounded">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto p-2 divide-y divide-border/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-tertiary">
              No matching concepts or courses found.
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
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? "bg-primary-500/10 text-primary-400" : "hover:bg-surface-variant text-text-secondary"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-primary-500/20 text-primary-400" : "bg-surface-variant text-text-tertiary"}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">{item.title}</div>
                      {"subtitle" in item && item.subtitle && (
                        <div className="text-xs text-text-tertiary truncate">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-variant text-text-tertiary">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? "text-primary-400 opacity-100" : "opacity-0"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-surface-variant/50 border-t border-border flex items-center justify-between text-[11px] text-text-tertiary">
          <div className="flex items-center gap-3">
            <span>Navigate <kbd className="font-mono">↑↓</kbd></span>
            <span>Select <kbd className="font-mono">↵</kbd></span>
          </div>
          <span>Concept Microlearning</span>
        </div>
      </div>
    </div>
  );
}
