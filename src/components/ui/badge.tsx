'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'brand' | 'violet' | 'teal' | 'rose' | 'gray' | 'green' | 'blue' | 'red' | 'yellow';

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-100 text-brand-700',
  violet: 'bg-violet-100 text-violet-700',
  teal: 'bg-teal-100 text-teal-700',
  rose: 'bg-rose-100 text-rose-700',
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-amber-100 text-amber-700',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'brand', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
