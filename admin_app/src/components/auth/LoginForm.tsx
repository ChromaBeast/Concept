'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '@/lib/authContext';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(email.trim(), password);
    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Authentication failed.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <Card className="shadow-xl border-paper-border bg-paper-card">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-ochre/15 border border-ochre/30 text-ochre flex items-center justify-center mx-auto mb-1 font-mono shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold">Admin Console Sign In</CardTitle>
          <CardDescription>
            Enter your Appwrite administrator credentials to access mission control.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-paper-text flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-ochre" />
                <span>Admin Email</span>
              </label>
              <Input
                type="email"
                placeholder="admin@concept.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-paper-text flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-ochre" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" loading={loading}>
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
