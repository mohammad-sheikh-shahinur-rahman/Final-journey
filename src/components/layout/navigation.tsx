
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'হোম' },
  { href: '/report-death', label: 'মৃত্যুর প্রতিবেদন' },
  { href: '/services', label: 'সেবাসমূহ' },
  { href: '/generate-obituary', label: 'স্মরণিকা জেনারেটর' },
  { href: '/plan-ahead', label: 'আগাম পরিকল্পনা' },
  { href: '/chat', label: 'এআই চ্যাট' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2 lg:space-x-4 overflow-x-auto">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary py-2 px-1 sm:px-2 whitespace-nowrap',
            pathname === item.href ? 'text-primary' : 'text-foreground/60'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
