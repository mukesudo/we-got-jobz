'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SettingsNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Profile', href: '/settings/profile' },
    { name: 'Password', href: '/settings/password' },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-slate-100 text-black font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-slate-50'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}