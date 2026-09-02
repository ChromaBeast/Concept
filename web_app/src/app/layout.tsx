import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AuthProvider } from '@/lib/authContext';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Concept — Software Engineering Mental Models in <2 Minutes',
  description: 'Dense architectural reference, production trade-offs, and daily spaced repetition loops for senior engineers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-obsidian-bg text-dark-text antialiased flex flex-col min-h-screen font-sans selection:bg-electric/25 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-electric text-obsidian-bg font-bold font-mono text-xs rounded-lg shadow-2xl focus:outline-none"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ToastProvider>
            <CommandPalette />
            <Navbar />
            <main id="main-content" className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
