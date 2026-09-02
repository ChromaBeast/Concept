'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, databases, APPWRITE_CONFIG } from './appwrite';
import { ID, OAuthProvider } from 'appwrite';
import { storage } from './storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithOAuth: (provider: 'github' | 'google') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

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
      // 401 User (role: guests) missing scopes is standard Appwrite response for non-authenticated sessions
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      await account.createEmailPasswordSession(email, pass);
      await checkCurrentUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed. Please check credentials.' };
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      await account.create(ID.unique(), email, pass, name);
      await account.createEmailPasswordSession(email, pass);
      await checkCurrentUser();

      // Initialize user profile in Appwrite DB
      try {
        if (APPWRITE_CONFIG.databaseId) {
          const userRes = await account.get();
          await databases.createDocument(
            APPWRITE_CONFIG.databaseId,
            'userProfiles',
            ID.unique(),
            {
              userId: userRes.$id,
              streakCount: storage.getStreak().streakDays,
              lastActiveDate: new Date().toISOString(),
              learnedConceptIds: storage.getLearned(),
              bookmarkedConceptIds: storage.getBookmarks(),
              themeMode: 'dark',
            }
          );
        }
      } catch {
        // Non-critical profile init
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Sign up failed.' };
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
      // Handled by browser redirect
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithOAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
