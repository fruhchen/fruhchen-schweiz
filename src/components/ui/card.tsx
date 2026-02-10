'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  interactive,
  onClick,
  padding = 'md',
}: CardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={cn(
        'bg-white rounded-3xl shadow-soft border border-gray-100/50',
        paddingStyles[padding],
        interactive &&
          'transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 hover:border-brand-200/50 cursor-pointer',
        onClick && 'text-left w-full',
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn('text-heading text-gray-900', className)}>{children}</h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)}>{children}</p>
  );
}
