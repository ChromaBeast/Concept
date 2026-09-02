'use client';

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { LoginForm } from './LoginForm';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 font-mono text-xs text-paper-muted">
        <RefreshCw className="w-6 h-6 animate-spin text-ochre" />
        <span>Verifying Appwrite admin session...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12">
        <LoginForm />
      </div>
    );
  }

  return <>{children}</>;
}
