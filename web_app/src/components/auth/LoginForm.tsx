'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { OAuthButtons } from './OAuthButtons';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-obsidian-border bg-obsidian-card shadow-2xl space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-electric text-obsidian-bg font-extrabold text-lg mb-2">
          C
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-text">Welcome Back</h1>
        <p className="text-xs text-dark-muted">Sign in to sync your learning streak and bookmarks</p>
      </div>

      <OAuthButtons />

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-dark-muted">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              className="w-full bg-obsidian-surface border border-obsidian-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-dark-text placeholder-dark-sub focus:outline-none focus:border-electric"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-dark-muted">Password</label>
            <Link href="/forgot-password" className="text-[11px] text-electric hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-obsidian-surface border border-obsidian-border rounded-xl pl-9 pr-10 py-2.5 text-xs text-dark-text placeholder-dark-sub focus:outline-none focus:border-electric"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 px-4 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-electric/10 disabled:opacity-50"
        >
          {submitting ? 'Signing In...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-dark-muted">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-electric font-semibold hover:underline">
          Create one free
        </Link>
      </div>
    </div>
  );
}
