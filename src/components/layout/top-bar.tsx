'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { getGreeting } from '@/lib/utils';

interface TopBarProps {
  userName: string;
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

export function TopBar({ userName, title, showBack, backHref = '/dashboard' }: TopBarProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Link href={backHref} className="p-1 -ml-1 rounded-xl text-gray-600 hover:bg-gray-100">
              <Icon name="ChevronLeft" size={24} />
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Icon name="Heart" size={16} className="text-white" />
            </div>
          )}
          {title ? (
            <h1 className="font-semibold text-gray-900">{title}</h1>
          ) : (
            <div>
              <p className="text-xs text-gray-400">{getGreeting()}</p>
              <p className="font-semibold text-gray-900 text-sm">{userName}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors relative">
            <Icon name="Bell" size={20} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          <Link href="/profile">
            <Avatar name={userName} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
