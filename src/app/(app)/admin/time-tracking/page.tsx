'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';

const TEAM_MEMBERS = [
  { name: 'Dina Hediger', role: 'Geschäftsleitung', hoursThisMonth: 84, color: 'brand' },
  { name: 'Désirée Koch', role: 'Kommunikation', hoursThisMonth: 62, color: 'violet' },
  { name: 'Sandra Meier', role: 'Peer-Koordination', hoursThisMonth: 48, color: 'teal' },
  { name: 'Nadine Vogt', role: 'Projekte', hoursThisMonth: 56, color: 'rose' },
  { name: 'Mario Bühler', role: 'IT & Web', hoursThisMonth: 20, color: 'blue' },
];

interface TimeEntry {
  user: string;
  project: string;
  task: string;
  hours: number;
  date: string;
}

const RECENT_ENTRIES: TimeEntry[] = [
  { user: 'Dina Hediger', project: 'Grants', task: 'Antrag Glückskette', hours: 3.5, date: '2026-02-09' },
  { user: 'Désirée Koch', project: 'Newsletter', task: 'Jahresbericht Draft', hours: 2, date: '2026-02-09' },
  { user: 'Sandra Meier', project: 'Peer Support', task: 'Supervision Bern', hours: 1.5, date: '2026-02-09' },
  { user: 'Dina Hediger', project: 'Admin', task: 'Teammeeting', hours: 1, date: '2026-02-09' },
  { user: 'Nadine Vogt', project: 'Events', task: 'Weltfrühgeborenentag Planung', hours: 4, date: '2026-02-08' },
  { user: 'Mario Bühler', project: 'IT', task: 'Website-Update', hours: 3, date: '2026-02-08' },
];

const PROJECT_OPTIONS = ['Grants', 'Newsletter', 'Peer Support', 'Events', 'Admin', 'IT'];
const FILTER_OPTIONS = ['Alle', ...PROJECT_OPTIONS];

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TimeTrackingPage() {
  const { timerRunning, timerStartTime, timerProject, timerTask, startTimer, stopTimer } = useAppStore();
  const [elapsed, setElapsed] = useState('00:00:00');
  const [projectFilter, setProjectFilter] = useState('Alle');
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  // Pre-start inputs
  const [newProject, setNewProject] = useState(PROJECT_OPTIONS[0]);
  const [newTask, setNewTask] = useState('');

  // Real timer tick
  useEffect(() => {
    if (!timerRunning || !timerStartTime) {
      setElapsed('00:00:00');
      return;
    }
    const tick = () => setElapsed(formatElapsed(Date.now() - timerStartTime));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerStartTime]);

  const handleStart = () => {
    if (!newTask.trim()) {
      toast.error('Bitte gib eine Aufgabe ein.');
      return;
    }
    startTimer(newProject, newTask.trim());
    toast.success('Timer gestartet!');
  };

  const handleStop = () => {
    stopTimer();
    toast.success(`Zeit erfasst: ${elapsed}`);
    setNewTask('');
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
        <Card className={`text-center space-y-4 ${timerRunning ? 'ring-2 ring-brand-200 bg-brand-50/30' : ''}`}>
          <div className="text-4xl font-mono font-bold text-gray-900 tabular-nums">
            {elapsed}
          </div>

          {/* Task/project inputs — show before starting */}
          {!timerRunning && (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Projekt</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  title="Projekt auswählen"
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                >
                  {PROJECT_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Aufgabe</label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="z.B. Antrag schreiben"
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {!timerRunning ? (
              <Button variant="primary" size="lg" icon="Play" onClick={handleStart}>
                Timer starten
              </Button>
            ) : (
              <>
                <Button variant="danger" size="lg" icon="Square" onClick={handleStop}>
                  Stoppen
                </Button>
                <Button variant="secondary" size="lg" icon="Pause">
                  Pause
                </Button>
              </>
            )}
          </div>
          {timerRunning && (
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Icon name="Folder" size={14} /> {timerProject}</span>
              <span className="flex items-center gap-1"><Icon name="FileText" size={14} /> {timerTask}</span>
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
        {FILTER_OPTIONS.map((p) => (
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
            <Card padding="sm" className="flex items-center gap-3 cursor-pointer hover:shadow-soft-lg transition-all" onClick={() => setSelectedEntry(entry)}>
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

      {/* Time entry detail modal */}
      <Modal open={!!selectedEntry} onClose={() => setSelectedEntry(null)} title="Zeiteintrag" size="md">
        {selectedEntry && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedEntry.user} size="md" />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedEntry.user}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedEntry.date).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Projekt</p>
                <p className="text-sm text-gray-900">{selectedEntry.project}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Aufgabe</p>
                <p className="text-sm text-gray-900">{selectedEntry.task}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Dauer</p>
                <p className="text-lg font-bold text-gray-900">{selectedEntry.hours}h</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</p>
                <p className="text-sm text-gray-900">{new Date(selectedEntry.date).toLocaleDateString('de-CH')}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
