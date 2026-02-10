'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';

// ── Types ────────────────────────────────────────────────────────────────────

type MoodLevel = 1 | 2 | 3 | 4 | 5;
type FilterTab = 'all' | 'entries' | 'milestones';

interface JournalEntry {
  id: string;
  date: string;
  time: string;
  mood: MoodLevel;
  title: string;
  excerpt: string;
  photos: number;
  milestone?: string;
  type: 'entry' | 'milestone';
}

// ── Mood configuration ───────────────────────────────────────────────────────

const MOODS: Record<MoodLevel, { emoji: string; label: string; color: string; bg: string }> = {
  1: { emoji: '\uD83D\uDE22', label: 'Traurig', color: 'text-rose-500', bg: 'bg-rose-50' },
  2: { emoji: '\uD83D\uDE14', label: 'Schwer', color: 'text-orange-400', bg: 'bg-orange-50' },
  3: { emoji: '\uD83D\uDE10', label: 'Okay', color: 'text-amber-400', bg: 'bg-amber-50' },
  4: { emoji: '\uD83D\uDE0A', label: 'Gut', color: 'text-emerald-400', bg: 'bg-emerald-50' },
  5: { emoji: '\uD83D\uDE04', label: 'Wunderbar', color: 'text-teal-500', bg: 'bg-teal-50' },
};

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: '2025-01-28',
    time: '20:15',
    mood: 4,
    title: 'Guter Tag auf der Station',
    excerpt:
      'Heute durfte ich Mila zum ersten Mal selbst wickeln. Die Schwester hat mir alles ganz geduldig gezeigt. Es fühlt sich gut an, etwas selbst tun zu können.',
    photos: 2,
    type: 'entry',
  },
  {
    id: '2',
    date: '2025-01-28',
    time: '14:30',
    mood: 5,
    title: 'Erstes Känguru!',
    excerpt:
      'Endlich! Nach 12 Tagen durfte ich Mila das erste Mal auf die Brust legen. Sie war so ruhig und ihr Herzschlag war stabil. Ich habe vor Freude geweint.',
    photos: 3,
    milestone: 'Erstes Känguru',
    type: 'milestone',
  },
  {
    id: '3',
    date: '2025-01-27',
    time: '19:45',
    mood: 2,
    title: 'Schwieriger Abend',
    excerpt:
      'Musste heute früher gehen weil ich so müde war. Schlechtes Gewissen, dass ich nicht länger bleiben konnte. Die Fahrt nach Hause war hart.',
    photos: 0,
    type: 'entry',
  },
  {
    id: '4',
    date: '2025-01-26',
    time: '16:00',
    mood: 4,
    title: '10g zugenommen!',
    excerpt:
      'Der Arzt sagt, Mila hat endlich zugenommen. 10 Gramm klingt wenig, aber für uns ist es ein Riesenschritt. Weiter so, kleine Kämpferin!',
    photos: 1,
    milestone: '10g zugenommen',
    type: 'milestone',
  },
  {
    id: '5',
    date: '2025-01-26',
    time: '10:20',
    mood: 3,
    title: 'Morgenroutine',
    excerpt:
      'Langsam gewöhne ich mich an den Alltag zwischen Zuhause und Station. Heute morgens Milch abgepumpt, dann direkt losgefahren. Es wird zur Routine.',
    photos: 0,
    type: 'entry',
  },
  {
    id: '6',
    date: '2025-01-25',
    time: '21:00',
    mood: 1,
    title: 'Alarm',
    excerpt:
      'Heute gab es einen Alarm bei Mila. Die Schwestern haben sofort reagiert und alles war schnell wieder stabil. Trotzdem zittere ich noch.',
    photos: 0,
    type: 'entry',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Heute';
  if (isSameDay(date, yesterday)) return 'Gestern';

  return date.toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function groupByDate(entries: JournalEntry[]): Record<string, JournalEntry[]> {
  return entries.reduce(
    (groups, entry) => {
      const key = entry.date;
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
      return groups;
    },
    {} as Record<string, JournalEntry[]>
  );
}

// ── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'entries', label: 'Einträge' },
  { key: 'milestones', label: 'Meilensteine' },
];

// ── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Photo placeholder grid ───────────────────────────────────────────────────

function PhotoGrid({ count }: { count: number }) {
  if (count === 0) return null;

  const gradients = [
    'from-brand-200 to-brand-300',
    'from-violet-200 to-violet-300',
    'from-teal-200 to-teal-300',
  ];

  return (
    <div className="flex gap-2 mt-3">
      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
        <div
          key={i}
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center opacity-80`}
        >
          <Icon name="Image" size={16} className="text-white/70" />
        </div>
      ))}
      {count > 3 && (
        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-400">+{count - 3}</span>
        </div>
      )}
    </div>
  );
}

// ── Entry card ───────────────────────────────────────────────────────────────

function EntryCard({
  entry,
  onSelect,
}: {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
}) {
  const mood = MOODS[entry.mood];

  return (
    <motion.div variants={itemVariants}>
      <Card interactive className="relative overflow-hidden cursor-pointer" onClick={() => onSelect(entry)}>
        {/* Milestone ribbon */}
        {entry.milestone && (
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
              Meilenstein
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {/* Mood indicator */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full ${mood.bg} flex items-center justify-center text-lg`}
            >
              {mood.emoji}
            </div>
            <span className={`text-[10px] font-medium ${mood.color}`}>{mood.label}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{entry.title}</h3>
              <span className="text-xs text-gray-400 flex-shrink-0">{entry.time}</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{entry.excerpt}</p>

            <PhotoGrid count={entry.photos} />

            {/* Milestone badge */}
            {entry.milestone && (
              <div className="mt-3">
                <Badge variant="yellow">
                  <Icon name="Star" size={12} className="text-amber-500" />
                  {entry.milestone}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const filteredEntries = MOCK_ENTRIES.filter((entry) => {
    if (activeFilter === 'entries') return entry.type === 'entry';
    if (activeFilter === 'milestones') return entry.type === 'milestone';
    return true;
  });

  const grouped = groupByDate(filteredEntries);
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      {/* Header */}
      <PageHeader
        title="Tagebuch"
        subtitle="Deine Gedanken und Meilensteine"
        action={
          <Link href="/journal/new">
            <Button icon="Plus" size="md">
              Neuer Eintrag
            </Button>
          </Link>
        }
      />

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex gap-2 mb-6"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === tab.key
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-200 hover:text-brand-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 pb-24 lg:pb-8"
      >
        {sortedDates.map((dateStr) => (
          <motion.div key={dateStr} variants={itemVariants}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Icon name="Calendar" size={16} className="text-brand-400" />
                {formatDate(dateStr)}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            </div>

            {/* Entries for this date */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 pl-2"
            >
              {/* Timeline line */}
              <div className="relative">
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-brand-200 via-brand-100 to-transparent" />
                <div className="space-y-3">
                  {grouped[dateStr].map((entry) => (
                    <div key={entry.id} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className="absolute left-[14px] top-5 w-2.5 h-2.5 rounded-full bg-white border-2 border-brand-300 z-10" />
                      <EntryCard entry={entry} onSelect={setSelectedEntry} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Empty state */}
        {filteredEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="BookHeart" size={28} className="text-brand-400" />
            </div>
            <p className="text-gray-500 text-sm">Keine Einträge gefunden</p>
          </motion.div>
        )}
      </motion.div>

      {/* Floating add button (mobile) */}
      <Link href="/journal/new" className="lg:hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
        >
          <Icon name="Plus" size={24} strokeWidth={2.5} />
        </motion.div>
      </Link>

      {/* ------------------------------------------------------------------ */}
      {/*  Entry Detail Modal                                                */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title="Tagebuch-Eintrag"
        size="md"
      >
        {selectedEntry && (() => {
          const mood = MOODS[selectedEntry.mood];
          return (
            <div className="space-y-5">
              {/* Title and mood */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full ${mood.bg} flex items-center justify-center text-2xl`}
                  >
                    {mood.emoji}
                  </div>
                  <span className={`text-xs font-medium ${mood.color}`}>{mood.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedEntry.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedEntry.milestone && (
                      <Badge variant="yellow">
                        <Icon name="Star" size={12} className="text-amber-500" />
                        {selectedEntry.milestone}
                      </Badge>
                    )}
                    {selectedEntry.type === 'milestone' && !selectedEntry.milestone && (
                      <Badge variant="yellow">Meilenstein</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Date and time */}
              <div className="flex gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Icon name="CalendarDays" size={16} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Datum</p>
                    <p className="text-gray-900 font-medium">{formatFullDate(selectedEntry.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Icon name="Clock" size={16} className="text-violet-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Uhrzeit</p>
                    <p className="text-gray-900 font-medium">{selectedEntry.time} Uhr</p>
                  </div>
                </div>
              </div>

              {/* Full text */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">Eintrag</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedEntry.excerpt}
                </p>
              </div>

              {/* Photos */}
              {selectedEntry.photos > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Fotos ({selectedEntry.photos})
                  </p>
                  <PhotoGrid count={selectedEntry.photos} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="md" icon="Pencil" fullWidth>
                  Bearbeiten
                </Button>
                <Button variant="secondary" size="md" icon="Share2" fullWidth>
                  Teilen
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </>
  );
}
