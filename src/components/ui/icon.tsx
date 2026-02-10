'use client';

import { icons, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 1.5 }: IconProps) {
  const IconComponent = icons[name as keyof typeof icons] as LucideIcon | undefined;
  if (!IconComponent) return null;
  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} />;
}
