'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'brand' | 'violet' | 'teal' | 'rose' | 'green';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

const colorStyles = {
  brand: 'bg-gradient-to-r from-brand-400 to-brand-500',
  violet: 'bg-gradient-to-r from-violet-400 to-violet-500',
  teal: 'bg-gradient-to-r from-teal-400 to-teal-500',
  rose: 'bg-gradient-to-r from-rose-400 to-rose-500',
  green: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'brand',
  size = 'md',
  showLabel,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex-1 bg-gray-100 rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colorStyles[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500 tabular-nums w-10 text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
