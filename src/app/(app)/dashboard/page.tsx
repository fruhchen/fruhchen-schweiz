'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { getGreeting } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Mock data  (all hardcoded for demo / presentation)
// ---------------------------------------------------------------------------

const BABY = {
  name: 'Lina',
  birthDate: '2025-12-25',
  chronologicalDays: 47,
  correctedAge: '3 Wochen',
  gestationalWeeks: 28,
  currentWeightG: 2340,
  birthWeightG: 980,
  nextMilestone: 'Erste eigenständige Flasche',
};

const PARENT_NAME = 'Sarah';

const QUICK_ACTIONS = [
  {
    label: 'Tagebuch schreiben',
    icon: 'BookHeart' as const,
    href: '/journal/new',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    ring: 'ring-rose-100',
  },
  {
    label: 'Glossar durchsuchen',
    icon: 'BookOpen' as const,
    href: '/glossary',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    ring: 'ring-violet-100',
  },
  {
    label: 'Mit AI chatten',
    icon: 'MessageCircle' as const,
    href: '/chat',
    bg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    ring: 'ring-teal-100',
  },
  {
    label: 'Peer kontaktieren',
    icon: 'Users' as const,
    href: '/peer',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    ring: 'ring-emerald-100',
  },
  {
    label: 'Nächster Termin',
    icon: 'Calendar' as const,
    href: '/events',
    bg: 'bg-brand-50',
    iconColor: 'text-brand-500',
    ring: 'ring-brand-100',
  },
  {
    label: 'Familie updaten',
    icon: 'Share2' as const,
    href: '/family',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    ring: 'ring-blue-100',
  },
];

const JOURNAL_ENTRIES = [
  {
    id: '1',
    date: '8. Februar 2026',
    mood: { emoji: '😊', label: 'Gut' },
    excerpt:
      'Heute hat Lina zum ersten Mal meine Hand richtig fest umgriffen. Der Arzt sagt, ihre Reflexe entwickeln sich wunderbar.',
  },
  {
    id: '2',
    date: '6. Februar 2026',
    mood: { emoji: '😄', label: 'Sehr gut' },
    excerpt:
      'Känguru-Zeit war heute besonders schön. 45 Minuten auf meiner Brust, sie war so ruhig und zufrieden.',
  },
  {
    id: '3',
    date: '4. Februar 2026',
    mood: { emoji: '😐', label: 'Okay' },
    excerpt:
      'Ein langer Tag auf der Neonatologie. Aber die Pflegerin hat mir Mut gemacht \u2014 Lina nimmt stetig zu.',
  },
];

const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'Elterngruppen-Treff Bern',
    date: '14. Feb',
    day: '14',
    month: 'Feb',
    time: '14:00 Uhr',
    location: 'Inselspital, Raum 2.14',
  },
  {
    id: '2',
    title: 'Online-Vortrag: Stillen bei Frühgeborenen',
    date: '18. Feb',
    day: '18',
    month: 'Feb',
    time: '19:30 Uhr',
    location: 'Zoom (Link folgt)',
  },
];

const WEIGHT_DATA = [
  { week: 'Geb.', value: 980 },
  { week: 'W1', value: 940 },
  { week: 'W2', value: 1020 },
  { week: 'W3', value: 1180 },
  { week: 'W4', value: 1410 },
  { week: 'W5', value: 1680 },
  { week: 'W6', value: 1950 },
  { week: 'Jetzt', value: 2340 },
];

const HEALTH_TIP = {
  title: 'Känguru-Pflege',
  body: 'Haut-zu-Haut-Kontakt stabilisiert die Herzfrequenz und Atmung Ihres Babys, fördert die Gewichtszunahme und stärkt die Bindung. Versuchen Sie täglich mindestens 60 Minuten.',
  icon: 'Heart' as const,
};

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  },
};

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Tiny inline sparkline for the weight card
// ---------------------------------------------------------------------------

function WeightSparkline() {
  const max = Math.max(...WEIGHT_DATA.map((d) => d.value));
  const min = Math.min(...WEIGHT_DATA.map((d) => d.value));
  const range = max - min || 1;
  const h = 64;
  const w = 220;
  const padY = 4;

  const points = WEIGHT_DATA.map((d, i) => {
    const x = (i / (WEIGHT_DATA.length - 1)) * w;
    const y = h - padY - ((d.value - min) / range) * (h - padY * 2);
    return `${x},${y}`;
  }).join(' ');

  // Gradient fill area
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-16"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#sparkFill)" />
        <polyline
          points={points}
          fill="none"
          stroke="rgb(249 115 22)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Last dot (current weight) */}
        {(() => {
          const last = WEIGHT_DATA[WEIGHT_DATA.length - 1];
          const x = w;
          const y =
            h - padY - ((last.value - min) / range) * (h - padY * 2);
          return (
            <>
              <circle cx={x} cy={y} r="4" fill="white" stroke="rgb(249 115 22)" strokeWidth="2" />
              <circle cx={x} cy={y} r="7" fill="rgb(249 115 22)" fillOpacity="0.15" />
            </>
          );
        })()}
      </svg>
      {/* Labels */}
      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
        {WEIGHT_DATA.map((d) => (
          <span key={d.week}>{d.week}</span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const greeting = getGreeting();

  return (
    <div className="space-y-6 pb-8">
      {/* ----------------------------------------------------------------- */}
      {/* 1. Welcome Banner                                                  */}
      {/* ----------------------------------------------------------------- */}
      <FadeUp delay={0}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-warm-50 to-violet-50 border border-brand-100/60 p-6 sm:p-8">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-brand-200/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-4 bottom-0 h-28 w-28 rounded-full bg-violet-200/20 blur-2xl" />
          <div className="pointer-events-none absolute right-12 bottom-4 h-20 w-20 rounded-full bg-teal-200/15 blur-2xl" />

          {/* Subtle floating illustration shapes */}
          <motion.div
            className="pointer-events-none absolute right-8 top-6 opacity-10"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon name="Baby" size={64} className="text-brand-400" />
          </motion.div>

          <div className="relative z-10">
            <Badge variant="brand" className="mb-3">
              <Icon name="Sparkles" size={12} className="text-brand-500" />
              Dein Tag mit {BABY.name}
            </Badge>

            <h1 className="text-display-sm text-gray-900 mb-2">
              {greeting}, {PARENT_NAME}.
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed">
              {BABY.name} ist heute{' '}
              <span className="font-semibold text-brand-600">
                {BABY.chronologicalDays} Tage alt
              </span>{' '}
              (korrigiertes Alter:{' '}
              <span className="font-semibold text-violet-600">
                {BABY.correctedAge}
              </span>
              ).
            </p>

            <div className="mt-5">
              <Link href="/journal/new">
                <Button icon="PenLine" size="lg">
                  Neuer Tagebuch-Eintrag
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Quick Actions Grid                                              */}
      {/* ----------------------------------------------------------------- */}
      <FadeUp delay={0.08}>
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {QUICK_ACTIONS.map((action) => (
            <motion.div key={action.href} variants={stagger.item}>
              <Link href={action.href} className="block h-full">
                <Card
                  interactive
                  padding="sm"
                  className="h-full flex flex-col items-center text-center gap-2.5 py-5 group"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${action.bg} ring-1 ${action.ring} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon name={action.icon} size={20} className={action.iconColor} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 leading-tight">
                    {action.label}
                  </span>
                  <Icon
                    name="ArrowRight"
                    size={14}
                    className="text-gray-300 group-hover:text-brand-400 transition-colors duration-300"
                  />
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </FadeUp>

      {/* Two-column layout for journal + events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --------------------------------------------------------------- */}
        {/* 3. Recent Journal Entries                                        */}
        {/* --------------------------------------------------------------- */}
        <FadeUp delay={0.16}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Icon name="BookHeart" size={18} className="text-rose-500" />
                </div>
                <h2 className="text-subheading text-gray-900">Letzte Einträge</h2>
              </div>
              <Link
                href="/journal"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1"
              >
                Alle
                <Icon name="ChevronRight" size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {JOURNAL_ENTRIES.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                >
                  <Link href={`/journal/${entry.id}`}>
                    <div className="group flex gap-3.5 p-3 -mx-3 rounded-2xl hover:bg-warm-50/60 transition-colors duration-200 cursor-pointer">
                      <span className="text-2xl flex-shrink-0 mt-0.5">
                        {entry.mood.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-gray-400">
                            {entry.date}
                          </span>
                          <Badge variant="gray" className="text-[10px] px-2 py-0.5">
                            {entry.mood.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {entry.excerpt}
                        </p>
                      </div>
                      <Icon
                        name="ChevronRight"
                        size={16}
                        className="text-gray-200 group-hover:text-brand-400 flex-shrink-0 mt-2 transition-colors"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </FadeUp>

        {/* --------------------------------------------------------------- */}
        {/* 4. Upcoming Events                                               */}
        {/* --------------------------------------------------------------- */}
        <FadeUp delay={0.22}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon name="Calendar" size={18} className="text-brand-500" />
                </div>
                <h2 className="text-subheading text-gray-900">Nächste Events</h2>
              </div>
              <Link
                href="/events"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1"
              >
                Alle
                <Icon name="ChevronRight" size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {UPCOMING_EVENTS.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                >
                  <Link href="/events">
                    <div className="group flex gap-4 p-3 -mx-3 rounded-2xl hover:bg-warm-50/60 transition-colors duration-200 cursor-pointer">
                      <div className="flex-shrink-0 w-12 h-14 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 text-white flex flex-col items-center justify-center shadow-sm">
                        <span className="text-lg font-bold leading-none">
                          {event.day}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                          {event.month}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 leading-snug mb-1">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="MapPin" size={12} />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <Icon
                        name="ChevronRight"
                        size={16}
                        className="text-gray-200 group-hover:text-brand-400 flex-shrink-0 mt-3 transition-colors"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Card>
        </FadeUp>
      </div>

      {/* Three-column layout for progress / peer / tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --------------------------------------------------------------- */}
        {/* 5. Baby Progress Card                                            */}
        {/* --------------------------------------------------------------- */}
        <FadeUp delay={0.28}>
          <Card className="h-full">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <Icon name="TrendingUp" size={18} className="text-brand-500" />
              </div>
              <h2 className="text-subheading text-gray-900">{BABY.name}s Fortschritt</h2>
            </div>

            {/* Corrected age highlight */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-violet-50/70">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Icon name="Baby" size={16} className="text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Korrigiertes Alter</p>
                <p className="text-sm font-semibold text-violet-700">
                  {BABY.correctedAge}
                </p>
              </div>
            </div>

            {/* Weight sparkline */}
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-xs text-gray-500">Gewicht</p>
                <p className="text-sm font-semibold text-brand-600">
                  {(BABY.currentWeightG / 1000).toFixed(2)} kg
                </p>
              </div>
              <WeightSparkline />
            </div>

            {/* Weight progress bar */}
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <p className="text-xs text-gray-500">Gewichtszunahme seit Geburt</p>
              </div>
              <ProgressBar
                value={BABY.currentWeightG - BABY.birthWeightG}
                max={2500}
                color="brand"
                showLabel
              />
            </div>

            {/* Next milestone */}
            <div className="p-3 rounded-2xl bg-warm-50/80 border border-brand-100/40">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Star" size={14} className="text-brand-400" />
                <p className="text-xs font-medium text-brand-600">Nächster Meilenstein</p>
              </div>
              <p className="text-sm text-gray-700">{BABY.nextMilestone}</p>
            </div>

            {/* Encouraging message */}
            <p className="text-xs text-gray-400 mt-4 text-center italic">
              Jeder Tag ist ein Fortschritt. Ihr macht das wunderbar.
            </p>
          </Card>
        </FadeUp>

        {/* --------------------------------------------------------------- */}
        {/* 6. Peer Support Status                                           */}
        {/* --------------------------------------------------------------- */}
        <FadeUp delay={0.34}>
          <Card className="h-full flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Icon name="Users" size={18} className="text-emerald-500" />
              </div>
              <h2 className="text-subheading text-gray-900">Peer Support</h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              {/* Availability indicator */}
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                  <Icon name="HeartHandshake" size={28} className="text-emerald-500" />
                </div>
                {/* Green pulse dot */}
                <span className="absolute top-0 right-0 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
                </span>
              </div>

              <p className="text-sm font-medium text-gray-800 mb-1">
                Jemand ist für dich da
              </p>
              <p className="text-xs text-gray-400 mb-5 max-w-[200px] leading-relaxed">
                Monika, erfahrene Peer-Mutter, ist heute erreichbar.
              </p>

              <Link href="/peer">
                <Button variant="secondary" icon="MessageCircle" size="sm">
                  Nachricht schreiben
                </Button>
              </Link>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100/80">
              <Link
                href="/peer"
                className="flex items-center justify-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Alle Peers anzeigen
                <Icon name="ArrowRight" size={12} />
              </Link>
            </div>
          </Card>
        </FadeUp>

        {/* --------------------------------------------------------------- */}
        {/* 7. Quick Health Tip                                              */}
        {/* --------------------------------------------------------------- */}
        <FadeUp delay={0.4}>
          <Card className="h-full flex flex-col relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="pointer-events-none absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-rose-100/30 blur-2xl" />

            <div className="flex items-center gap-2.5 mb-4 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <Icon name="Lightbulb" size={18} className="text-rose-500" />
              </div>
              <h2 className="text-subheading text-gray-900">Tipp des Tages</h2>
            </div>

            <div className="flex-1 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Icon name={HEALTH_TIP.icon} size={16} className="text-rose-400" />
                <h3 className="text-sm font-semibold text-gray-800">
                  {HEALTH_TIP.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {HEALTH_TIP.body}
              </p>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100/80 relative z-10">
              <Link
                href="/health"
                className="flex items-center justify-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
              >
                Mehr Wissenswertes
                <Icon name="ArrowRight" size={12} />
              </Link>
            </div>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
