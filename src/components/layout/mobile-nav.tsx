'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { useAppStore, useStoreHydrated } from '@/stores/app-store';

const PARENT_NAV = [
  { href: '/dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { href: '/journal', label: 'Tagebuch', icon: 'BookHeart' },
  { href: '/chat', label: 'Chat', icon: 'MessageCircle' },
  { href: '/glossary', label: 'Glossar', icon: 'BookOpen' },
  { href: '/profile', label: 'Profil', icon: 'User' },
] as const;

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'BarChart3' },
  { href: '/admin/grants', label: 'Stiftungen', icon: 'Landmark' },
  { href: '/admin/volunteers', label: 'Team', icon: 'UserCheck' },
  { href: '/admin/time-tracking', label: 'Zeit', icon: 'Timer' },
  { href: '/profile', label: 'Profil', icon: 'User' },
] as const;

interface MobileNavProps {
  isAdmin?: boolean;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  const pathname = usePathname();
  const isOnAdminPage = pathname.startsWith('/admin');
  const navItems = isAdmin && isOnAdminPage ? ADMIN_NAV : PARENT_NAV;

  const hydrated = useStoreHydrated();
  const { timerRunning, timerStartTime, timerProject, timerTask } = useAppStore();
  const [elapsed, setElapsed] = useState('00:00:00');
  const showTimer = hydrated && timerRunning;

  useEffect(() => {
    if (!timerRunning || !timerStartTime) { setElapsed('00:00:00'); return; }
    const tick = () => setElapsed(formatElapsed(Date.now() - timerStartTime));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerStartTime]);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100">
      {/* Running timer banner */}
      {showTimer && (
        <Link href="/admin/time-tracking" className="flex items-center justify-between px-4 py-1.5 bg-brand-50 border-b border-brand-100">
          <span className="flex items-center gap-2 text-xs font-medium text-brand-600">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            {timerProject} · {timerTask}
          </span>
          <span className="text-xs font-mono font-bold text-brand-600 tabular-nums">{elapsed}</span>
        </Link>
      )}

      {/* Admin toggle bar */}
      {isAdmin && (
        <div className="flex border-b border-gray-100">
          <Link
            href="/dashboard"
            className={cn(
              'flex-1 py-1.5 text-[10px] font-semibold text-center transition-colors',
              !isOnAdminPage ? 'text-brand-600 bg-brand-50' : 'text-gray-400'
            )}
          >
            Eltern
          </Link>
          <Link
            href="/admin/dashboard"
            className={cn(
              'flex-1 py-1.5 text-[10px] font-semibold text-center transition-colors',
              isOnAdminPage ? 'text-brand-600 bg-brand-50' : 'text-gray-400'
            )}
          >
            Admin
          </Link>
        </div>
      )}

      <div className="flex items-center justify-around px-2 py-1" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        {navItems.map((item) => {
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
