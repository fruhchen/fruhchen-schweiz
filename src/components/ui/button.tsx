'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: `bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold
            shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30
            hover:-translate-y-0.5 active:translate-y-0`,
  secondary: `bg-white text-gray-700 font-medium border border-gray-200 shadow-soft
              hover:border-brand-300 hover:text-brand-600 hover:shadow-soft-lg hover:-translate-y-0.5
              active:translate-y-0`,
  ghost: `text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900`,
  danger: `bg-red-50 text-red-600 font-medium border border-red-200
           hover:bg-red-100 hover:border-red-300`,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
  lg: 'px-6 py-3 text-base rounded-2xl gap-2',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      loading,
      fullWidth,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          <Icon name={icon} size={iconSize} />
        ) : null}
        {children}
        {iconRight && !loading && <Icon name={iconRight} size={iconSize} />}
      </button>
    );
  }
);

Button.displayName = 'Button';
