"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastOptions {
  message: string;
  type?: "info" | "success" | "error";
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  showUndo: (message: string, onUndo: () => void) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

interface ActiveToast extends ToastOptions {
  id: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, type = "info", actionLabel, onAction, durationMs = 3500 }: ToastOptions) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, actionLabel, onAction, durationMs }]);

      setTimeout(() => {
        removeToast(id);
      }, durationMs);
    },
    [removeToast]
  );

  const showUndo = useCallback(
    (message: string, onUndo: () => void) => {
      showToast({
        message,
        type: "info",
        actionLabel: "UNDO",
        onAction: onUndo,
        durationMs: 4000,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, showUndo }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-surface border border-border shadow-2xl backdrop-blur-md animate-slide-up"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : toast.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-primary-400 shrink-0" />
              )}
              <span className="text-sm font-medium text-text-primary truncate">{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    removeToast(toast.id);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 text-text-tertiary hover:text-text-primary transition-colors"
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
