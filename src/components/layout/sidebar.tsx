'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { NAV_ITEMS } from '@/lib/constants';
import { icons } from 'lucide-react';
import { useAppStore, useStoreHydrated } from '@/stores/app-store';

interface SidebarProps {
  userName: string;
  userRole: string;
  isAdmin?: boolean;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function Sidebar({ userName, userRole, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showAdminNav, setShowAdminNav] = useState(pathname.startsWith('/admin'));
  const hydrated = useStoreHydrated();
  const { timerRunning, timerStartTime, timerProject, timerTask } = useAppStore();
  const [elapsed, setElapsed] = useState('00:00:00');
  const showTimer = hydrated && timerRunning;

  const navItems = showAdminNav ? NAV_ITEMS.admin : NAV_ITEMS.parent;

  // Timer tick for sidebar
  useEffect(() => {
    if (!timerRunning || !timerStartTime) {
      setElapsed('00:00:00');
      return;
    }
    const tick = () => setElapsed(formatElapsed(Date.now() - timerStartTime));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerStartTime]);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen bg-white border-r border-gray-100 transition-all duration-300 sticky top-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        {collapsed ? (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
            <Icon name="Heart" size={20} className="text-white" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <img src="/fruhchen_neokinder_logo.svg" alt="Frühchen & Neokinder Schweiz" className="h-12 w-auto" />
          </motion.div>
        )}
      </div>

      {/* Admin / Parent Toggle */}
      {isAdmin && (
        <div className="px-3 pt-4 pb-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setShowAdminNav(false)}
              className={cn(
                'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all',
                !showAdminNav ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              )}
            >
              {collapsed ? <Icon name="Users" size={14} className="mx-auto" /> : 'Eltern'}
            </button>
            <button
              onClick={() => setShowAdminNav(true)}
              className={cn(
                'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all',
                showAdminNav ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              )}
            >
              {collapsed ? <Icon name="Shield" size={14} className="mx-auto" /> : 'Admin'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                name={item.icon as keyof typeof icons}
                size={20}
                className={cn(
                  'flex-shrink-0',
                  isActive ? 'text-brand-500' : 'text-gray-400'
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Running Timer Widget */}
      <AnimatePresence>
        {showTimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100"
          >
            <Link href="/admin/time-tracking" className="block px-3 py-3 hover:bg-brand-50/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Icon name="Timer" size={16} className="text-brand-500" />
                  </motion.div>
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-sm font-mono font-bold text-brand-600 tabular-nums">{elapsed}</p>
                    <p className="text-[10px] text-gray-500 truncate">{timerProject} · {timerTask}</p>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User */}
      <div className="border-t border-gray-100 p-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Avatar name={userName} size="sm" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden xl:flex items-center justify-center py-3 border-t border-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
      </button>
    </aside>
  );
}
