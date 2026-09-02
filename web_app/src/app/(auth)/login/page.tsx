import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — Concept',
  description: 'Sign in to access your learning streak, saved concepts, and personalized curriculum.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <LoginForm />
    </div>
  );
}
