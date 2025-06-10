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
  title: 'সেবাপ্ল্যান - জানাজা ও দাফন পরিকল্পনা এবং ব্যবস্থাপনা',
  description: 'সেবাপ্ল্যান বাংলাদেশী ব্যবহারকারীদের জন্য ব্যাপক অন্ত্যেষ্টিক্রিয়া পরিকল্পনা এবং ব্যবস্থাপনা পরিষেবা সরবরাহ করে। আমরা মৃত্যুর প্রতিবেদন জমা, জানাজার সময় প্রস্তাবনা, পরিষেবা প্রদানকারীদের সাথে সংযোগ এবং আরও অনেক কিছুর জন্য সহায়তা প্রদান করি।',
  keywords: ['ফিউনারেল প্ল্যান', 'বাংলাদেশ', 'জানাজা', 'সেবাপ্ল্যান', 'শোক', 'স্মরণ'],
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
