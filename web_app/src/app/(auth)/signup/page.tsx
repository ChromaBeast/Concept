import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — Concept',
  description: 'Join thousands of engineers mastering complex systems and algorithms in <2 minutes.',
};

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <SignupForm />
    </div>
  );
}
