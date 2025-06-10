
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu, Leaf } from 'lucide-react';

const navItems = [
  { href: '/', label: 'হোম' },
  { href: '/report-death', label: 'মৃত্যুর প্রতিবেদন' },
  { href: '/services', label: 'সেবাসমূহ' },
  { href: '/register-imam', label: 'ইমাম রেজিস্ট্রেশন'},
  { href: '/generate-obituary', label: 'স্মরণিকা জেনারেটর' },
  { href: '/plan-ahead', label: 'আগাম পরিকল্পনা' },
  { href: '/invitations', label: 'আমন্ত্রণ সহায়তা' },
  { href: '/chat', label: 'এআই চ্যাট' },
  { href: '/grief-support', label: 'শোক ও সান্ত্বনা' },
  { href: '/developer-info', label: 'ডেভেলপার পরিচিতি' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              pathname === item.href
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground/70 hover:text-primary'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation Trigger and Sheet */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 sm:w-1/2 bg-background p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-xl">
                      অন্তিম যাত্রা
                    </span>
                  </Link>
                </SheetClose>
                {/* The X close button is part of SheetContent by default */}
              </div>
              <nav className="flex-grow space-y-1 p-4">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        pathname === item.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/80'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="border-t p-4">
                <p className="text-xs text-muted-foreground text-center">
                  © {new Date().getFullYear()} অন্তিম যাত্রা। সর্বস্বত্ব সংরক্ষিত।
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
