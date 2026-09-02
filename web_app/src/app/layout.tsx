import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AuthProvider } from '@/lib/authContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Concept — Technical Reference & Architecture Fundamentals in <2 Minutes',
  description: 'Dense architecture patterns, failure modes, and daily spaced repetition loops for senior engineers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-paper-bg text-paper-text antialiased flex flex-col min-h-screen font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-ochre text-white font-bold font-mono text-xs rounded-lg shadow-2xl focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
