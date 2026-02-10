'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type EventType = 'Workshop' | 'Webinar' | 'Treffen' | 'Conference';
type Region = 'Bern' | 'Aarau' | 'St. Gallen' | 'Zürich' | 'Online' | 'National';
type ViewMode = 'list' | 'calendar';

interface FruhchenEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: EventType;
  region: Region;
  location: string;
  description: string;
  participants: number;
  maxParticipants: number;
  isOnline: boolean;
  isFeatured?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const REGIONS: Array<{ label: string; value: Region | 'Alle' }> = [
  { label: 'Alle', value: 'Alle' },
  { label: 'Bern', value: 'Bern' },
  { label: 'Aarau', value: 'Aarau' },
  { label: 'St. Gallen', value: 'St. Gallen' },
  { label: 'Zürich', value: 'Zürich' },
  { label: 'Online', value: 'Online' },
];

const EVENT_TYPES: EventType[] = ['Workshop', 'Webinar', 'Treffen'];

const TYPE_BADGE_VARIANT: Record<EventType, 'brand' | 'violet' | 'teal' | 'rose' | 'blue'> = {
  Workshop: 'brand',
  Webinar: 'violet',
  Treffen: 'teal',
  Conference: 'rose',
};

const TYPE_COLORS: Record<EventType, { bg: string; text: string; accent: string }> = {
  Workshop: { bg: 'bg-brand-100', text: 'text-brand-700', accent: 'bg-brand-500' },
  Webinar: { bg: 'bg-violet-100', text: 'text-violet-700', accent: 'bg-violet-500' },
  Treffen: { bg: 'bg-teal-100', text: 'text-teal-700', accent: 'bg-teal-500' },
  Conference: { bg: 'bg-rose-100', text: 'text-rose-700', accent: 'bg-rose-500' },
};

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
];

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

const WEEKDAY_NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                 */
/* -------------------------------------------------------------------------- */

const EVENTS: FruhchenEvent[] = [
  {
    id: '1',
    title: 'Eltern-Treff Bern',
    date: '2026-03-14',
    time: '10:00 - 12:00',
    type: 'Treffen',
    region: 'Bern',
    location: 'Familienzentrum Bern, Effingerstrasse 20',
    description:
      'Gemütliches Zusammenkommen für Frühchen-Eltern. Erfahrungsaustausch bei Kaffee und Kuchen.',
    participants: 8,
    maxParticipants: 15,
    isOnline: false,
  },
  {
    id: '2',
    title: 'Webinar: Stillen von Frühgeborenen',
    date: '2026-03-21',
    time: '19:00 - 20:30',
    type: 'Webinar',
    region: 'Online',
    location: 'Zoom',
    description:
      'Praktische Tipps und fachliche Begleitung zum Thema Stillen bei frühgeborenen Babys.',
    participants: 24,
    maxParticipants: 50,
    isOnline: true,
  },
  {
    id: '3',
    title: 'Känguru-Pflege Workshop',
    date: '2026-04-04',
    time: '14:00 - 16:30',
    type: 'Workshop',
    region: 'Aarau',
    location: 'Kantonsspital Aarau, Raum B12',
    description:
      'Hands-on Workshop zur Känguru-Methode: Haut-an-Haut-Kontakt für die Entwicklung eures Frühchens.',
    participants: 6,
    maxParticipants: 12,
    isOnline: false,
  },
  {
    id: '4',
    title: 'Peer-Ausbildung Modul 1',
    date: '2026-04-18',
    time: '09:00 - 17:00',
    type: 'Workshop',
    region: 'St. Gallen',
    location: 'Beratungszentrum St. Gallen, Bahnhofstrasse 5',
    description:
      'Erstes Modul der Peer-Ausbildung: Grundlagen der Gesprächsführung und Empathie.',
    participants: 10,
    maxParticipants: 16,
    isOnline: false,
  },
  {
    id: '5',
    title: 'Geschwister-Workshop',
    date: '2026-05-09',
    time: '10:00 - 12:00',
    type: 'Workshop',
    region: 'Zürich',
    location: 'Elternzentrum Zürich, Limmatquai 62',
    description:
      'Workshop für Geschwisterkinder: Spielerisch lernen, wie sie ihr kleines Geschwisterchen unterstützen können.',
    participants: 12,
    maxParticipants: 20,
    isOnline: false,
  },
  {
    id: '6',
    title: 'Webinar: Entwicklungsförderung',
    date: '2026-05-22',
    time: '20:00 - 21:00',
    type: 'Webinar',
    region: 'Online',
    location: 'Zoom',
    description:
      'Altersgerechte Förderung von Frühgeborenen im ersten Lebensjahr — was wirklich hilft.',
    participants: 18,
    maxParticipants: 50,
    isOnline: true,
  },
  {
    id: '7',
    title: 'Familien-Picknick',
    date: '2026-06-13',
    time: '11:00 - 15:00',
    type: 'Treffen',
    region: 'Bern',
    location: 'Rosengarten Bern',
    description:
      'Sommerliches Familienpicknick mit Spielen, Austausch und guter Laune. Bring euer Picknick mit!',
    participants: 15,
    maxParticipants: 40,
    isOnline: false,
  },
  {
    id: '8',
    title: 'Weltfrühgeborenentag 2026',
    date: '2026-11-17',
    time: '10:00 - 18:00',
    type: 'Conference',
    region: 'National',
    location: 'Kursaal Bern & Online',
    description:
      'Der internationale Weltfrühgeborenentag — Vorträge, Workshops und gemeinsames Engagement für die Kleinsten.',
    participants: 120,
    maxParticipants: 500,
    isFeatured: true,
    isOnline: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  Animation Variants                                                        */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    transition: { duration: 0.25 },
  },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

function getDay(dateStr: string): number {
  return parseDate(dateStr).getDate();
}

function getMonthShort(dateStr: string): string {
  return MONTH_NAMES_SHORT[parseDate(dateStr).getMonth()];
}

function getMonthLong(dateStr: string): string {
  return MONTH_NAMES[parseDate(dateStr).getMonth()];
}

function getYear(dateStr: string): number {
  return parseDate(dateStr).getFullYear();
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatEventDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function DateBadge({ dateStr, type }: { dateStr: string; type: EventType }) {
  const colors = TYPE_COLORS[type];
  return (
    <div
      className={`flex-shrink-0 w-14 h-14 rounded-2xl ${colors.bg} flex flex-col items-center justify-center`}
    >
      <span className={`text-lg font-bold leading-none ${colors.text}`}>
        {getDay(dateStr)}
      </span>
      <span className={`text-[10px] font-semibold uppercase tracking-wide mt-0.5 ${colors.text} opacity-80`}>
        {getMonthShort(dateStr)}
      </span>
    </div>
  );
}

function ParticipantsBar({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const percentage = Math.min((current / max) * 100, 100);
  const isFull = current >= max;
  const isAlmostFull = percentage >= 80;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isFull
              ? 'bg-red-400'
              : isAlmostFull
              ? 'bg-amber-400'
              : 'bg-brand-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
      <span
        className={`text-xs font-medium whitespace-nowrap ${
          isFull ? 'text-red-500' : isAlmostFull ? 'text-amber-600' : 'text-gray-500'
        }`}
      >
        {current}/{max} Plätze
      </span>
    </div>
  );
}

function FeaturedEventCard({
  event,
  onSelect,
}: {
  event: FruhchenEvent;
  onSelect: (event: FruhchenEvent) => void;
}) {
  const dateObj = parseDate(event.date);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-brand-500 to-violet-500 p-[1px] cursor-pointer"
      onClick={() => onSelect(event)}
    >
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-500/90 via-brand-500/90 to-violet-500/90 p-6 sm:p-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Date display */}
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center border border-white/20">
            <span className="text-3xl sm:text-4xl font-bold text-white leading-none">
              {dateObj.getDate()}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-white/80 uppercase tracking-wider mt-1">
              {MONTH_NAMES_SHORT[dateObj.getMonth()]}
            </span>
          </div>

          {/* Event info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-white border border-white/20">
                <Icon name="Star" size={12} className="text-yellow-300" />
                Highlight
              </span>
              <Badge variant="rose" className="bg-white/20 text-white border border-white/20">
                {event.type}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {event.title}
            </h2>

            <p className="text-sm text-white/80 leading-relaxed mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Clock" size={14} />
                {event.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="MapPin" size={14} />
                {event.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Users" size={14} />
                {event.participants}/{event.maxParticipants} Plätze
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Button
              variant="secondary"
              size="lg"
              icon="ArrowRight"
              className="bg-white text-brand-600 border-0 shadow-lg hover:bg-white/90 hover:text-brand-700"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              Anmelden
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({
  event,
  index,
  onSelect,
}: {
  event: FruhchenEvent;
  index: number;
  onSelect: (event: FruhchenEvent) => void;
}) {
  return (
    <motion.div
      variants={cardVariants}
      layout
      layoutId={event.id}
      custom={index}
    >
      <Card interactive className="group cursor-pointer" onClick={() => onSelect(event)}>
        <div className="flex gap-4">
          {/* Date badge */}
          <DateBadge dateStr={event.date} type={event.type} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors truncate">
                {event.title}
              </h3>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <Badge variant={TYPE_BADGE_VARIANT[event.type]}>
                {event.isOnline && <Icon name="Video" size={11} />}
                {event.type}
              </Badge>
              {event.isOnline ? (
                <Badge variant="blue">
                  <Icon name="Globe" size={11} />
                  Online
                </Badge>
              ) : (
                <Badge variant="gray">{event.region}</Badge>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Clock" size={14} className="text-gray-400" />
                {event.time}
              </span>
              <span className="inline-flex items-center gap-1.5 truncate">
                <Icon name="MapPin" size={14} className="text-gray-400" />
                <span className="truncate">{event.location}</span>
              </span>
            </div>

            {/* Participants + CTA */}
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-[200px]">
                <ParticipantsBar
                  current={event.participants}
                  max={event.maxParticipants}
                />
              </div>
              <Button
                size="sm"
                icon="ArrowRight"
                disabled={event.participants >= event.maxParticipants}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                Anmelden
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function CalendarGrid({
  events,
  currentMonth,
  currentYear,
  onSelectEvent,
}: {
  events: FruhchenEvent[];
  currentMonth: number;
  currentYear: number;
  onSelectEvent: (event: FruhchenEvent) => void;
}) {
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days: Array<{ day: number | null; events: FruhchenEvent[] }> = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, events: [] });
  }

  // Days with events
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter((e) => {
      const eventDate = parseDate(e.date);
      return (
        eventDate.getDate() === d &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
    days.push({ day: d, events: dayEvents });
  }

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card padding="sm">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAY_NAMES.map((name) => (
            <div
              key={name}
              className="text-center text-xs font-semibold text-gray-400 py-2"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-100/50 rounded-2xl overflow-hidden">
          {days.map((cell, idx) => {
            const isToday = isCurrentMonth && cell.day === today.getDate();
            const hasEvents = cell.events.length > 0;

            return (
              <div
                key={idx}
                className={`
                  min-h-[80px] sm:min-h-[100px] p-1.5 bg-white transition-colors
                  ${cell.day ? 'hover:bg-brand-50/40' : 'bg-gray-50/50'}
                `}
              >
                {cell.day && (
                  <>
                    <span
                      className={`
                        inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium
                        ${isToday
                          ? 'bg-brand-500 text-white font-bold'
                          : hasEvents
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-400'}
                      `}
                    >
                      {cell.day}
                    </span>

                    {/* Event dots / labels */}
                    <div className="mt-1 space-y-0.5">
                      {cell.events.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          className={`
                            text-[10px] leading-tight font-medium px-1.5 py-0.5 rounded-md truncate cursor-pointer hover:opacity-80 transition-opacity
                            ${TYPE_COLORS[evt.type].bg} ${TYPE_COLORS[evt.type].text}
                          `}
                          title={evt.title}
                          onClick={() => onSelectEvent(evt)}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {cell.events.length > 2 && (
                        <span className="text-[10px] text-gray-400 font-medium px-1.5">
                          +{cell.events.length - 2} mehr
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'Alle'>('Alle');
  const [selectedTypes, setSelectedTypes] = useState<Set<EventType>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(2); // March 2026 (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [selectedEvent, setSelectedEvent] = useState<FruhchenEvent | null>(null);

  /* -- Filtering logic -- */
  const filteredEvents = EVENTS.filter((event) => {
    // Region filter
    if (selectedRegion !== 'Alle') {
      if (selectedRegion === 'Online') {
        if (!event.isOnline) return false;
      } else if (event.region !== selectedRegion) {
        return false;
      }
    }

    // Type filter
    if (selectedTypes.size > 0 && !selectedTypes.has(event.type)) {
      return false;
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const featuredEvent = EVENTS.find((e) => e.isFeatured);
  const upcomingEvents = filteredEvents
    .filter((e) => !e.isFeatured)
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());

  function toggleType(type: EventType) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function navigateMonth(direction: -1 | 1) {
    setCalendarMonth((prev) => {
      let newMonth = prev + direction;
      if (newMonth < 0) {
        setCalendarYear((y) => y - 1);
        return 11;
      }
      if (newMonth > 11) {
        setCalendarYear((y) => y + 1);
        return 0;
      }
      return newMonth;
    });
  }

  return (
    <div className="min-h-screen pb-24">
      {/* ------------------------------------------------------------------ */}
      {/*  Header                                                            */}
      {/* ------------------------------------------------------------------ */}
      <PageHeader
        title="Events & Workshops"
        subtitle="Veranstaltungen in deiner Nähe"
        action={
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-soft'
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              <Icon name="List" size={16} />
              Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-soft'
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              <Icon name="CalendarDays" size={16} />
              Kalender
            </button>
          </div>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/*  Search                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="mb-5">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Events suchen..."
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Filters                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3 mb-6">
        {/* Region pills */}
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <button
              key={region.value}
              onClick={() => setSelectedRegion(region.value)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${selectedRegion === region.value
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-600'}
              `}
            >
              {region.value === 'Online' && (
                <Icon name="Globe" size={13} className="inline mr-1 -mt-0.5" />
              )}
              {region.label}
            </button>
          ))}
        </div>

        {/* Type pills */}
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((type) => {
            const isActive = selectedTypes.has(type);
            const colors = TYPE_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? `${colors.bg} ${colors.text} shadow-sm`
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}
                `}
              >
                {type}
              </button>
            );
          })}
          {selectedTypes.size > 0 && (
            <button
              onClick={() => setSelectedTypes(new Set())}
              className="px-3 py-1.5 rounded-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={14} className="inline -mt-0.5" /> Zurücksetzen
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Featured Event                                                    */}
      {/* ------------------------------------------------------------------ */}
      {featuredEvent && viewMode === 'list' && selectedRegion === 'Alle' && selectedTypes.size === 0 && !searchQuery && (
        <div className="mb-6">
          <FeaturedEventCard event={featuredEvent} onSelect={setSelectedEvent} />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  List View                                                         */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'list' && (
        <>
          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{upcomingEvents.length}</span>{' '}
              {upcomingEvents.length === 1 ? 'Veranstaltung' : 'Veranstaltungen'} gefunden
            </p>
          </div>

          {/* Event list */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} onSelect={setSelectedEvent} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Icon name="CalendarX2" size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-subheading text-gray-700 mb-1">
                    Keine Veranstaltungen gefunden
                  </h3>
                  <p className="text-sm text-gray-500">
                    Versuche andere Filter oder einen anderen Suchbegriff.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  Calendar View                                                     */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'calendar' && (
        <div>
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Icon name="ChevronLeft" size={20} className="text-gray-600" />
            </button>
            <h2 className="text-heading text-gray-900">
              {MONTH_NAMES[calendarMonth]} {calendarYear}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Icon name="ChevronRight" size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Calendar grid */}
          <CalendarGrid
            events={filteredEvents}
            currentMonth={calendarMonth}
            currentYear={calendarYear}
            onSelectEvent={setSelectedEvent}
          />

          {/* Events for selected month */}
          <div className="mt-6">
            <h3 className="text-subheading text-gray-700 mb-3">
              Events im {MONTH_NAMES[calendarMonth]}
            </h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents
                  .filter((e) => {
                    const d = parseDate(e.date);
                    return (
                      d.getMonth() === calendarMonth &&
                      d.getFullYear() === calendarYear
                    );
                  })
                  .sort(
                    (a, b) =>
                      parseDate(a.date).getTime() - parseDate(b.date).getTime()
                  )
                  .map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} onSelect={setSelectedEvent} />
                  ))}
              </AnimatePresence>

              {filteredEvents.filter((e) => {
                const d = parseDate(e.date);
                return (
                  d.getMonth() === calendarMonth &&
                  d.getFullYear() === calendarYear
                );
              }).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <p className="text-sm text-gray-400">
                    Keine Events in diesem Monat.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  Bottom CTA                                                        */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12"
      >
        <Card className="bg-gradient-warm border-0 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center">
            <Icon name="CalendarPlus" size={24} className="text-brand-500" />
          </div>
          <h3 className="text-heading text-gray-900 mb-1">
            Event vorschlagen
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            Du planst ein Treffen oder einen Workshop für Frühchen-Familien?
            Wir helfen dir bei der Organisation.
          </p>
          <Button icon="Plus" size="md">
            Event einreichen
          </Button>
        </Card>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/*  Event Detail Modal                                                */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event-Details"
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-5">
            {/* Title and type */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedEvent.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={TYPE_BADGE_VARIANT[selectedEvent.type]}>
                  {selectedEvent.type}
                </Badge>
                {selectedEvent.isOnline ? (
                  <Badge variant="blue">
                    <Icon name="Globe" size={11} />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="gray">{selectedEvent.region}</Badge>
                )}
                {selectedEvent.isFeatured && (
                  <Badge variant="yellow">
                    <Icon name="Star" size={11} />
                    Highlight
                  </Badge>
                )}
              </div>
            </div>

            {/* Detail fields */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon name="CalendarDays" size={16} className="text-brand-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Datum</p>
                  <p className="text-gray-900 font-medium">{formatEventDate(selectedEvent.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={16} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Uhrzeit</p>
                  <p className="text-gray-900 font-medium">{selectedEvent.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPin" size={16} className="text-teal-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Ort</p>
                  <p className="text-gray-900 font-medium">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Icon name="Users" size={16} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Teilnehmer</p>
                  <p className="text-gray-900 font-medium">
                    {selectedEvent.participants} / {selectedEvent.maxParticipants} Plätze belegt
                  </p>
                </div>
              </div>
            </div>

            {/* Participants bar */}
            <div className="px-1">
              <ParticipantsBar
                current={selectedEvent.participants}
                max={selectedEvent.maxParticipants}
              />
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">Beschreibung</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button
                size="lg"
                icon="ArrowRight"
                fullWidth
                disabled={selectedEvent.participants >= selectedEvent.maxParticipants}
              >
                {selectedEvent.participants >= selectedEvent.maxParticipants
                  ? 'Ausgebucht'
                  : 'Jetzt anmelden'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
