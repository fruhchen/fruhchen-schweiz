import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = 'de-CH'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string, locale = 'de-CH'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

export function formatTime(date: Date | string, locale = 'de-CH'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function calculateCorrectedAge(
  birthDate: Date,
  gestationalWeeks: number
): { months: number; weeks: number; label: string } {
  const fullTermWeeks = 40;
  const prematureWeeks = fullTermWeeks - gestationalWeeks;
  const prematureDays = prematureWeeks * 7;

  const now = new Date();
  const chronologicalDays = Math.floor(
    (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const correctedDays = Math.max(0, chronologicalDays - prematureDays);
  const correctedWeeks = Math.floor(correctedDays / 7);
  const correctedMonths = Math.floor(correctedDays / 30.44);

  const remainingWeeks = correctedWeeks - correctedMonths * 4;

  let label = '';
  if (correctedMonths > 0) {
    label = `${correctedMonths} Monat${correctedMonths !== 1 ? 'e' : ''}`;
    if (remainingWeeks > 0) {
      label += ` und ${remainingWeeks} Woche${remainingWeeks !== 1 ? 'n' : ''}`;
    }
  } else {
    label = `${correctedWeeks} Woche${correctedWeeks !== 1 ? 'n' : ''}`;
  }

  return { months: correctedMonths, weeks: correctedWeeks, label };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Gute Nacht';
  if (hour < 12) return 'Guten Morgen';
  if (hour < 17) return 'Guten Tag';
  if (hour < 21) return 'Guten Abend';
  return 'Gute Nacht';
}
