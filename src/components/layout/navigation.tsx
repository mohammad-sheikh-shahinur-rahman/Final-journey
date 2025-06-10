'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/report-death', label: 'Report Death' },
  { href: '/services', label: 'Services' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href ? 'text-primary' : 'text-foreground/60'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
