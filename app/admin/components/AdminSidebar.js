'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Users, ArrowLeftRight,
  AlertTriangle, ListChecks, Settings, Sparkles, ChevronRight,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

const MENU_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'לוח ניהול' },
  { href: '/admin/products', icon: Package, label: 'ניהול מוצרים' },
  { href: '/admin/users', icon: Users, label: 'ניהול משתמשים' },
  { href: '/admin/listings', icon: ListChecks, label: 'מודעות' },
  { href: '/admin/transactions', icon: ArrowLeftRight, label: 'עסקאות' },
  { href: '/admin/disputes', icon: AlertTriangle, label: 'סכסוכים' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-[#0a0a0a] text-white flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-bold text-sm">פאנל ניהול</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto admin-scrollbar">
        <div className="flex flex-col gap-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="size-3 mr-auto" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          חזרה לאתר
        </Link>
      </div>
    </aside>
  );
}
