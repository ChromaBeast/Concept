'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConceptLogoIcon } from '@/components/ui/logo';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-paper-border font-sans bg-paper-card">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3">
          <ConceptLogoIcon size="lg" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <CardTitle className="text-xl font-bold font-sans">Concept Admin Studio</CardTitle>
          <Badge variant="accent">Console</Badge>
        </div>
        <CardDescription className="text-xs font-mono">
          Authenticate with your Appwrite Administrator account.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4 font-mono text-xs">
          {error && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-paper-text font-sans">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-paper-muted" />
              <Input
                type="email"
                placeholder="admin@concept.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-paper-text font-sans">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-paper-muted" />
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6">
          <Button type="submit" className="w-full font-mono text-xs" loading={loading}>
            <span>Sign In to Admin Console</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
