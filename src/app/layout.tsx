import type { Metadata } from 'next';
import { Alegreya, PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import MainLayout from '@/components/layout/main-layout';

const alegreya = Alegreya({
  subsets: ['latin', 'bengali'],
  variable: '--font-alegreya',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin', 'bengali'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'অন্তিম যাত্রা - অন্ত্যেষ্টিক্রিয়া পরিকল্পনা ও সহায়তা',
  description: 'অন্তিম যাত্রা বাংলাদেশী ব্যবহারকারীদের জন্য ব্যাপক অন্ত্যেষ্টিক্রিয়া পরিকল্পনা এবং ব্যবস্থাপনা পরিষেবা সরবরাহ করে। আমরা মৃত্যুর প্রতিবেদন, জানাজার সময়, পরিষেবা প্রদানকারী, শোক ও সান্ত্বনা এবং আরও অনেক কিছুর জন্য সহায়তা প্রদান করি।',
  keywords: ['অন্তিম যাত্রা', 'ফিউনারেল প্ল্যান', 'বাংলাদেশ', 'জানাজা', 'শোক', 'সান্ত্বনা', 'মৃত্যু পরবর্তী সেবা'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
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
