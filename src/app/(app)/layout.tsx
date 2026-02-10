'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { TopBar } from '@/components/layout/top-bar';

// In production, this comes from Supabase auth context
const DEMO_USER = {
  name: 'Sarah Müller',
  role: 'parent',
  isAdmin: true, // For demo, show all features
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-shell">
      <Sidebar
        userName={DEMO_USER.name}
        userRole={DEMO_USER.role}
        isAdmin={DEMO_USER.isAdmin}
      />
      <main className="flex-1 min-w-0">
        <TopBar userName={DEMO_USER.name} />
        <div className="px-4 py-6 lg:px-8 lg:py-8 pb-safe max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
