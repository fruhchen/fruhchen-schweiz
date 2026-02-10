export const APP_NAME = 'Frühchen Schweiz';
export const APP_DESCRIPTION =
  'Die digitale Begleitung für Familien mit Frühgeborenen und Neokindern in der Schweiz.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const ROLES = {
  PARENT: 'parent',
  PEER: 'peer',
  FACHPERSON: 'fachperson',
  ADMIN: 'admin',
  DONOR: 'donor',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  parent: 'Elternteil',
  peer: 'Peer-Eltern',
  fachperson: 'Fachperson',
  admin: 'Admin',
  donor: 'Gönner*in',
};

export const REGIONS = [
  { id: 'bern', label: 'Bern', emoji: '🏔' },
  { id: 'aarau', label: 'Aarau', emoji: '🌿' },
  { id: 'st-gallen', label: 'St. Gallen', emoji: '⛰' },
  { id: 'zurich', label: 'Zürich', emoji: '🏙' },
  { id: 'basel', label: 'Basel', emoji: '🌉' },
  { id: 'luzern', label: 'Luzern', emoji: '💧' },
  { id: 'lausanne', label: 'Lausanne', emoji: '🏛' },
  { id: 'genf', label: 'Genf', emoji: '⛲' },
  { id: 'lugano', label: 'Lugano', emoji: '☀' },
] as const;

export const LANGUAGES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
] as const;

export const MOOD_OPTIONS = [
  { value: 1, label: 'Sehr schwer', emoji: '😢', color: 'rose' },
  { value: 2, label: 'Schwer', emoji: '😔', color: 'orange' },
  { value: 3, label: 'Okay', emoji: '😐', color: 'yellow' },
  { value: 4, label: 'Gut', emoji: '😊', color: 'teal' },
  { value: 5, label: 'Sehr gut', emoji: '😄', color: 'green' },
] as const;

export const GRANT_STAGES = [
  { id: 'research', label: 'Recherche', color: 'gray' },
  { id: 'contacted', label: 'Kontakt aufgenommen', color: 'blue' },
  { id: 'submitted', label: 'Antrag eingereicht', color: 'violet' },
  { id: 'approved', label: 'Bewilligt', color: 'green' },
  { id: 'rejected', label: 'Abgelehnt', color: 'red' },
] as const;

export const JOURNAL_MILESTONE_TYPES = [
  { id: 'weight', label: 'Gewichtszunahme', icon: 'Scale' },
  { id: 'kangaroo', label: 'Erstes Känguru', icon: 'Heart' },
  { id: 'bottle', label: 'Erste Flasche', icon: 'Baby' },
  { id: 'breathing', label: 'Selbstständig atmen', icon: 'Wind' },
  { id: 'homecoming', label: 'Nach Hause!', icon: 'Home' },
  { id: 'custom', label: 'Eigener Meilenstein', icon: 'Star' },
] as const;

export const NAV_ITEMS = {
  parent: [
    { href: '/dashboard', label: 'Übersicht', icon: 'LayoutDashboard' },
    { href: '/journal', label: 'Tagebuch', icon: 'BookHeart' },
    { href: '/glossary', label: 'Glossar', icon: 'BookOpen' },
    { href: '/chat', label: 'AI Chat', icon: 'MessageCircle' },
    { href: '/events', label: 'Events', icon: 'Calendar' },
    { href: '/timeline', label: 'Timeline', icon: 'Clock' },
    { href: '/peer', label: 'Peer Support', icon: 'Users' },
    { href: '/health', label: 'Wissenswertes', icon: 'HeartPulse' },
    { href: '/media', label: 'Medien', icon: 'Play' },
    { href: '/babyphone', label: 'Babyphone', icon: 'Video' },
    { href: '/family', label: 'Familie', icon: 'Share2' },
    { href: '/follow-up', label: 'Nachsorge', icon: 'ClipboardCheck' },
    { href: '/hospital', label: 'Spital', icon: 'Building2' },
    { href: '/mental-health', label: 'Wohlbefinden', icon: 'Brain' },
    { href: '/neobox', label: 'NEO Box', icon: 'Package' },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { href: '/admin/grants', label: 'Stiftungen', icon: 'Landmark' },
    { href: '/admin/donations', label: 'Spenden', icon: 'Heart' },
    { href: '/admin/newsletter', label: 'Newsletter', icon: 'Mail' },
    { href: '/admin/projects', label: 'Projekte', icon: 'FolderKanban' },
    { href: '/admin/volunteers', label: 'Freiwillige', icon: 'UserCheck' },
    { href: '/admin/time-tracking', label: 'Zeiterfassung', icon: 'Timer' },
    { href: '/admin/analytics', label: 'Analytik', icon: 'TrendingUp' },
  ],
} as const;
