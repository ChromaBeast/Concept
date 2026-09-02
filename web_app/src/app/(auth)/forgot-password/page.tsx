'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { account } from '@/lib/appwrite';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : '/';
      await account.createRecovery(email, redirectUrl);
    } catch {
      // Security standard: always indicate sent
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-obsidian-border bg-obsidian-card shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-electric text-obsidian-bg font-extrabold text-lg mb-2">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-dark-text">Password Recovery</h1>
          <p className="text-xs text-dark-muted">Enter your email to receive a secure recovery link</p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-semibold text-dark-text">Check your inbox</div>
            <p className="text-xs text-dark-muted">
              We&apos;ve sent instructions to <span className="text-dark-text font-mono">{email}</span>.
            </p>
            <Link href="/login" className="inline-block mt-2 text-xs text-electric font-semibold hover:underline">
              Return to login &rarr;
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-electric hover:bg-electric-400 text-obsidian-bg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-electric/10 disabled:opacity-50"
            >
              {submitting ? 'Sending Link...' : 'Send Recovery Link'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-dark-muted">
              Remember your password?{' '}
              <Link href="/login" className="text-electric font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
