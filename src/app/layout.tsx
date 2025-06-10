import type { Metadata } from 'next';
import { Alegreya, PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import MainLayout from '@/components/layout/main-layout';

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-alegreya',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShebaPlan - Funeral Planning and Management',
  description: 'ShebaPlan offers comprehensive funeral planning and management services for Bangladeshi users. We provide support for death report submission, Janaza time suggestions, service provider connections, and more.',
  keywords: ['funeral plan', 'Bangladesh', 'Janaza', 'ShebaPlan', 'mourning', 'remembrance'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          alegreya.variable,
          ptSans.variable
        )}
      >
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
