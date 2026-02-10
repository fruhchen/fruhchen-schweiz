'use client';

import { cn } from '@/lib/utils';
import { Icon } from './icon';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Suchen...',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <Icon name="Search" size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200
                   text-gray-900 placeholder:text-gray-400 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400
                   hover:border-gray-300"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          <Icon name="X" size={16} />
        </button>
      )}
    </div>
  );
}
