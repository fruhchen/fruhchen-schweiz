'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { TopBar } from '@/components/layout/top-bar';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/providers/auth-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();

  const userName = profile?.full_name ?? '';
  const userRole = profile?.role ?? 'parent';
  const isAdmin = profile?.role === 'admin';

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-shell">
        <Sidebar
          userName={userName}
          userRole={userRole}
          isAdmin={isAdmin}
        />
        <main className="flex-1 min-w-0">
          <TopBar userName={userName} />
          <div className="px-4 py-6 lg:px-8 lg:py-8 pb-safe max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <MobileNav isAdmin={isAdmin} />
      </div>
    </AuthGuard>
  );
}
