'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { href: '/journal', label: 'Tagebuch', icon: 'BookHeart' },
  { href: '/chat', label: 'Chat', icon: 'MessageCircle' },
  { href: '/glossary', label: 'Glossar', icon: 'BookOpen' },
  { href: '/profile', label: 'Profil', icon: 'User' },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100">
      <div className="flex items-center justify-around px-2 py-1" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[4rem]',
                isActive ? 'text-brand-500' : 'text-gray-400'
              )}
            >
              <div className={cn('relative', isActive && 'scale-110')}>
                <Icon name={item.icon as keyof typeof icons} size={22} strokeWidth={isActive ? 2 : 1.5} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-500" />
                )}
              </div>
              <span className={cn('text-[10px] font-medium', isActive ? 'text-brand-600' : 'text-gray-400')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
