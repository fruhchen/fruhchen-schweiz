import { describe, it, expect, vi } from 'vitest';
import {
  cn,
  formatDate,
  formatDateShort,
  formatTime,
  calculateCorrectedAge,
  getInitials,
  truncate,
  slugify,
  getGreeting,
} from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('resolves Tailwind conflicts', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate', () => {
  it('formats a date string in de-CH locale', () => {
    const result = formatDate('2026-01-15');
    expect(result).toContain('15');
    expect(result).toContain('2026');
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date(2026, 0, 15));
    expect(result).toContain('15');
  });
});

describe('formatDateShort', () => {
  it('formats a short date', () => {
    const result = formatDateShort('2026-06-20');
    expect(result).toContain('20');
  });
});

describe('formatTime', () => {
  it('formats time from a date string', () => {
    const result = formatTime('2026-01-15T14:30:00');
    expect(result).toMatch(/14[:.h]30/);
  });
});

describe('calculateCorrectedAge', () => {
  it('calculates corrected age for a premature baby', () => {
    const birthDate = new Date();
    birthDate.setDate(birthDate.getDate() - 120); // 120 days ago
    const result = calculateCorrectedAge(birthDate, 32);

    expect(result.months).toBeGreaterThanOrEqual(0);
    expect(result.weeks).toBeGreaterThanOrEqual(0);
    expect(result.label).toBeTruthy();
  });

  it('returns 0 if corrected age would be negative', () => {
    const birthDate = new Date();
    birthDate.setDate(birthDate.getDate() - 10); // 10 days ago
    const result = calculateCorrectedAge(birthDate, 28); // very premature

    expect(result.months).toBe(0);
    expect(result.weeks).toBe(0);
  });

  it('formats label with months and weeks', () => {
    const birthDate = new Date();
    birthDate.setDate(birthDate.getDate() - 200); // ~6.5 months ago
    const result = calculateCorrectedAge(birthDate, 34);

    expect(result.label).toBeTruthy();
    expect(typeof result.label).toBe('string');
  });
});

describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('Dina Hediger')).toBe('DH');
  });

  it('handles single name', () => {
    expect(getInitials('Dina')).toBe('D');
  });

  it('limits to 2 characters', () => {
    expect(getInitials('Dina Maria Hediger')).toBe('DM');
  });
});

describe('truncate', () => {
  it('returns original string if shorter than max', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates long strings with ellipsis', () => {
    expect(truncate('Hello World This Is A Long String', 10)).toBe('Hello W...');
  });

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});

describe('slugify', () => {
  it('converts to lowercase kebab-case', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('handles German umlauts', () => {
    expect(slugify('Frühchen Zürich')).toBe('fruehchen-zuerich');
  });

  it('handles ß', () => {
    expect(slugify('Straße')).toBe('strasse');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });
});

describe('getGreeting', () => {
  it('returns a German greeting string', () => {
    const greeting = getGreeting();
    expect(greeting).toMatch(/^Gut(en|e) (Morgen|Tag|Abend|Nacht)$/);
  });

  it('returns morning greeting before noon', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 9, 0, 0));
    expect(getGreeting()).toBe('Guten Morgen');
    vi.useRealTimers();
  });

  it('returns afternoon greeting in the afternoon', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 14, 0, 0));
    expect(getGreeting()).toBe('Guten Tag');
    vi.useRealTimers();
  });

  it('returns evening greeting in the evening', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 19, 0, 0));
    expect(getGreeting()).toBe('Guten Abend');
    vi.useRealTimers();
  });

  it('returns night greeting late at night', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 23, 0, 0));
    expect(getGreeting()).toBe('Gute Nacht');
    vi.useRealTimers();
  });
});
