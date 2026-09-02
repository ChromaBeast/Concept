'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onUndo?: () => void;
  undoDuration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  showUndo: (message: string, onUndo: () => void, durationSeconds?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  const showUndo = useCallback(
    (message: string, onUndo: () => void, durationSeconds = 5) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        id,
        message,
        type: 'info',
        onUndo,
        undoDuration: durationSeconds,
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(id), durationSeconds * 1000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, showUndo }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-paper-card border border-paper-border shadow-2xl backdrop-blur-md animate-slide-up font-mono text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              {toast.type === 'info' && <CheckCircle2 className="w-4 h-4 text-ochre shrink-0" />}
              <span className="truncate text-paper-text font-medium">{toast.message}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {toast.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    removeToast(toast.id);
                  }}
                  className="px-2 py-1 rounded-lg bg-ochre/15 hover:bg-ochre/25 text-ochre font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 text-paper-muted hover:text-paper-text rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
