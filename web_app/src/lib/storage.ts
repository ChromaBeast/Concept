import { STORAGE_KEYS } from './constants';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function safeGetJSON<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSetJSON<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('concept_storage_updated'));
  } catch (err) {
    console.error(`Failed to write to localStorage key "${key}":`, err);
  }
}

export const storage = {
  getBookmarks(): string[] {
    return safeGetJSON<string[]>(STORAGE_KEYS.bookmarks, ['concept-cap-theorem', 'concept-binary-search']);
  },
  toggleBookmark(id: string): boolean {
    const bookmarks = this.getBookmarks();
    const exists = bookmarks.includes(id);
    const updated = exists ? bookmarks.filter((x) => x !== id) : [...bookmarks, id];
    safeSetJSON(STORAGE_KEYS.bookmarks, updated);
    return !exists;
  },
  isBookmarked(id: string): boolean {
    return this.getBookmarks().includes(id);
  },

  getLearned(): string[] {
    return safeGetJSON<string[]>(STORAGE_KEYS.learned, ['concept-binary-search']);
  },
  toggleLearned(id: string): boolean {
    const learned = this.getLearned();
    const exists = learned.includes(id);
    const updated = exists ? learned.filter((x) => x !== id) : [...learned, id];
    safeSetJSON(STORAGE_KEYS.learned, updated);
    this.recordActivity();
    return !exists;
  },
  isLearned(id: string): boolean {
    return this.getLearned().includes(id);
  },

  getStreak(): { streakDays: number; lastActiveDate: string } {
    const today = new Date().toISOString().split('T')[0];
    return safeGetJSON(STORAGE_KEYS.streak, { streakDays: 4, lastActiveDate: today });
  },
  recordActivity(): void {
    const current = this.getStreak();
    const today = new Date().toISOString().split('T')[0];
    if (current.lastActiveDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = current.lastActiveDate === yesterday ? current.streakDays + 1 : 1;
    safeSetJSON(STORAGE_KEYS.streak, { streakDays: newStreak, lastActiveDate: today });
  },

  getRecentSearches(): string[] {
    return safeGetJSON<string[]>(STORAGE_KEYS.recentSearches, ['CAP Theorem', 'LRU', 'Binary Search', 'Epoll']);
  },
  addRecentSearch(term: string): void {
    if (!term.trim()) return;
    const existing = this.getRecentSearches().filter((s) => s.toLowerCase() !== term.toLowerCase());
    safeSetJSON(STORAGE_KEYS.recentSearches, [term.trim(), ...existing].slice(0, 8));
  },
  clearRecentSearches(): void {
    safeSetJSON(STORAGE_KEYS.recentSearches, []);
  },

  getCustomImages(): Record<string, string> {
    return safeGetJSON<Record<string, string>>(STORAGE_KEYS.customImages, {});
  },
  setCustomImage(conceptId: string, url: string): void {
    const current = this.getCustomImages();
    safeSetJSON(STORAGE_KEYS.customImages, { ...current, [conceptId]: url });
  },
};
