'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { PageHeader } from '@/components/layout/page-header';
import { toast } from 'sonner';

const TEAM_MEMBERS = [
  { name: 'Dina Hediger', role: 'Geschäftsleitung', hoursThisMonth: 84, color: 'brand' },
  { name: 'Désirée Koch', role: 'Kommunikation', hoursThisMonth: 62, color: 'violet' },
  { name: 'Sandra Meier', role: 'Peer-Koordination', hoursThisMonth: 48, color: 'teal' },
  { name: 'Nadine Vogt', role: 'Projekte', hoursThisMonth: 56, color: 'rose' },
  { name: 'Mario Bühler', role: 'IT & Web', hoursThisMonth: 20, color: 'blue' },
];

const RECENT_ENTRIES = [
  { user: 'Dina Hediger', project: 'Grants', task: 'Antrag Glückskette', hours: 3.5, date: '2026-02-09' },
  { user: 'Désirée Koch', project: 'Newsletter', task: 'Jahresbericht Draft', hours: 2, date: '2026-02-09' },
  { user: 'Sandra Meier', project: 'Peer Support', task: 'Supervision Bern', hours: 1.5, date: '2026-02-09' },
  { user: 'Dina Hediger', project: 'Admin', task: 'Teammeeting', hours: 1, date: '2026-02-09' },
  { user: 'Nadine Vogt', project: 'Events', task: 'Weltfrühgeborenentag Planung', hours: 4, date: '2026-02-08' },
  { user: 'Mario Bühler', project: 'IT', task: 'Website-Update', hours: 3, date: '2026-02-08' },
];

const PROJECTS = ['Alle', 'Grants', 'Newsletter', 'Peer Support', 'Events', 'Admin', 'IT'];

export default function TimeTrackingPage() {
  const [tracking, setTracking] = useState(false);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [projectFilter, setProjectFilter] = useState('Alle');

  const startTracking = () => {
    setTracking(true);
    toast.success('Timer gestartet!');
  };

  const stopTracking = () => {
    setTracking(false);
    toast.success('Zeit erfasst: 1h 23m');
    setElapsed('00:00:00');
  };

  const filtered = projectFilter === 'Alle'
    ? RECENT_ENTRIES
    : RECENT_ENTRIES.filter((e) => e.project === projectFilter);

  const maxHours = Math.max(...TEAM_MEMBERS.map((m) => m.hoursThisMonth));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zeiterfassung"
        subtitle="Arbeitszeit nach Projekt und Team-Mitglied"
        action={<Button variant="secondary" size="sm" icon="Download">Export</Button>}
      />

      {/* Timer */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`text-center space-y-4 ${tracking ? 'ring-2 ring-brand-200 bg-brand-50/30' : ''}`}>
          <div className="text-4xl font-mono font-bold text-gray-900 tabular-nums">
            {tracking ? '01:23:45' : elapsed}
          </div>
          <div className="flex justify-center gap-3">
            {!tracking ? (
              <Button variant="primary" size="lg" icon="Play" onClick={startTracking}>
                Timer starten
              </Button>
            ) : (
              <>
                <Button variant="danger" size="lg" icon="Square" onClick={stopTracking}>
                  Stoppen
                </Button>
                <Button variant="secondary" size="lg" icon="Pause">
                  Pause
                </Button>
              </>
            )}
          </div>
          {tracking && (
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>Projekt: Grants</span>
              <span>Aufgabe: Antrag schreiben</span>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Team overview */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Team — Februar 2026</h3>
        <div className="space-y-3">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="flex items-center gap-3">
              <Avatar name={member.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                  <span className="text-sm text-gray-500 tabular-nums">{member.hoursThisMonth}h</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${member.color}-400 rounded-full transition-all duration-500`}
                    style={{ width: `${(member.hoursThisMonth / maxHours) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PROJECTS.map((p) => (
          <button
            key={p}
            onClick={() => setProjectFilter(p)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              projectFilter === p ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Recent entries */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Letzte Einträge</h3>
        {filtered.map((entry, i) => (
          <motion.div
            key={`${entry.user}-${entry.task}-${i}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
          >
            <Card padding="sm" className="flex items-center gap-3">
              <Avatar name={entry.user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{entry.task}</p>
                <p className="text-xs text-gray-400">{entry.user} · {entry.project}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 tabular-nums">{entry.hours}h</p>
                <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
