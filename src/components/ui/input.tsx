'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
import { icons } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: keyof typeof icons;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon name={icon} size={18} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 bg-white rounded-2xl border text-gray-900',
              'placeholder:text-gray-400 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400',
              'hover:border-gray-300',
              icon && 'pl-10',
              error
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                : 'border-gray-200',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
