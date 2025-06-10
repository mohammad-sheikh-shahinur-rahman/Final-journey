import Link from 'next/link';
import Navigation from './navigation';
import { Leaf } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl sm:inline-block">
            সেবাপ্ল্যান
          </span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
