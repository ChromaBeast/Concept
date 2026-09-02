'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from './appwrite';
import { OAuthProvider } from 'appwrite';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithOAuth: (provider: 'github' | 'google') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkCurrentUser = async () => {
    try {
      const res = await account.get();
      if (res && res.$id) {
        setUser({
          id: res.$id,
          name: res.name || res.email.split('@')[0],
          email: res.email,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await account.createEmailPasswordSession(email, pass);
      await checkCurrentUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed. Please verify admin credentials.' };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch {
      // Ignore
    } finally {
      setUser(null);
    }
  };

  const loginWithOAuth = async (provider: 'github' | 'google') => {
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin + '/' : '/';
      const p = provider === 'github' ? OAuthProvider.Github : OAuthProvider.Google;
      account.createOAuth2Session(p, redirectUrl, redirectUrl);
    } catch {
      // Handled by redirect
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginWithOAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
