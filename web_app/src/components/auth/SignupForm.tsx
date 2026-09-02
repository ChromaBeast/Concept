'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { OAuthButtons } from './OAuthButtons';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setError('');
    setSubmitting(true);

    const res = await signup(name, email, password);
    setSubmitting(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-obsidian-border bg-obsidian-card shadow-2xl space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-electric text-obsidian-bg font-extrabold text-lg mb-2">
          C
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-text">Create Free Account</h1>
        <p className="text-xs text-dark-muted">Join engineers mastering systems in &lt;2 minutes</p>
      </div>

      <OAuthButtons />

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-dark-muted">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Chen"
              className="w-full bg-obsidian-surface border border-obsidian-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-dark-text placeholder-dark-sub focus:outline-none focus:border-electric"
            />
          </div>
        </div>

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
          <label className="text-xs font-medium text-dark-muted">Password (min 8 chars)</label>
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
          {submitting ? 'Creating Account...' : 'Get Started Free'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-dark-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-electric font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
