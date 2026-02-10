'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';

const TIMELINE_PHASES = [
  {
    id: 'prenatal',
    label: 'Pränatal',
    icon: 'Baby',
    color: 'violet',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-500',
    borderColor: 'border-violet-200',
    status: 'completed' as const,
    date: 'Oktober 2025',
    items: [
      'Risikoschwangerschaft erkannt',
      'Stationäre Aufnahme',
      'Lungenreife-Behandlung',
    ],
  },
  {
    id: 'birth',
    label: 'Geburt',
    icon: 'Heart',
    color: 'rose',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
    borderColor: 'border-rose-200',
    status: 'completed' as const,
    date: '28. Dezember 2025',
    items: ['Lina geboren in der 29+3 SSW', 'Geburtsgewicht: 1\'180g', 'APGAR: 6/7/8'],
  },
  {
    id: 'nicu',
    label: 'Neonatologie',
    icon: 'Building2',
    color: 'brand',
    bgColor: 'bg-brand-50',
    iconColor: 'text-brand-500',
    borderColor: 'border-brand-200',
    status: 'current' as const,
    date: 'Seit 28. Dezember',
    duration: '47 Tage',
    items: [
      { text: 'CPAP-Beatmung', done: true },
      { text: 'Erste Känguru-Pflege', done: true },
      { text: 'Beginn Muttermilch per Sonde', done: true },
      { text: 'Gewicht 1\'680g erreicht', done: true },
      { text: 'Selbstständig atmen', done: false },
      { text: 'Erste Flasche', done: false },
      { text: 'Gewicht 2\'000g', done: false },
    ],
  },
  {
    id: 'discharge',
    label: 'Entlassung',
    icon: 'Home',
    color: 'teal',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-500',
    borderColor: 'border-teal-200',
    status: 'upcoming' as const,
    date: 'Voraussichtlich März 2026',
    items: ['Entlassungsgespräch', 'Nachsorge-Plan', 'Medikamenten-Einweisung', 'Erste Nacht zu Hause'],
  },
  {
    id: 'followup',
    label: 'Nachsorge',
    icon: 'ClipboardCheck',
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    status: 'upcoming' as const,
    date: 'Ab Entlassung',
    items: ['Kinderarzt-Kontrollen', 'Entwicklungsnachsorge', 'Physiotherapie', 'Augenkontrollen (ROP)'],
  },
  {
    id: 'milestones',
    label: 'Meilensteine',
    icon: 'Star',
    color: 'yellow',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    borderColor: 'border-amber-200',
    status: 'upcoming' as const,
    date: '1. Lebensjahr (korrigiert)',
    items: ['Erster Brei', 'Sitzen', 'Krabbeln', 'Erste Schritte', 'Erster Geburtstag'],
  },
];

const statusLabel = {
  completed: { text: 'Abgeschlossen', color: 'green' },
  current: { text: 'Aktuell', color: 'brand' },
  upcoming: { text: 'Kommend', color: 'gray' },
};

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Timeline"
        subtitle="Linas Reise — Schritt für Schritt"
      />

      {/* Corrected age card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-brand-50 to-violet-50 border-brand-200/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center">
              <Icon name="Calculator" size={24} className="text-brand-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Korrigiertes Alter</p>
              <p className="text-2xl font-bold text-gray-900">3 Wochen</p>
              <p className="text-sm text-gray-500">
                Chronologisch: 47 Tage · Geboren: 29+3 SSW
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 lg:left-1/2 lg:-translate-x-px" />

        <div className="space-y-8">
          {TIMELINE_PHASES.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="relative pl-14 lg:pl-0"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-3 w-7 h-7 rounded-full border-4 border-white ${
                  phase.status === 'current'
                    ? 'bg-brand-500 shadow-glow-brand'
                    : phase.status === 'completed'
                    ? 'bg-emerald-500'
                    : 'bg-gray-300'
                } lg:left-1/2 lg:-translate-x-1/2 z-10`}
              >
                {phase.status === 'current' && (
                  <div className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-30" />
                )}
              </div>

              <Card className={`${phase.status === 'current' ? 'ring-2 ring-brand-200' : ''} lg:w-[45%] ${i % 2 === 0 ? 'lg:ml-auto lg:mr-[5%]' : 'lg:mr-auto lg:ml-[5%]'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${phase.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={phase.icon as any} size={20} className={phase.iconColor} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{phase.label}</h3>
                      <Badge variant={statusLabel[phase.status].color as any}>
                        {statusLabel[phase.status].text}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{phase.date}</p>
                    {phase.duration && (
                      <p className="text-xs text-brand-500 font-medium">{phase.duration}</p>
                    )}
                  </div>
                </div>

                <ul className="space-y-2">
                  {phase.items.map((item, j) => {
                    const isCheckable = typeof item === 'object';
                    const text = isCheckable ? item.text : item;
                    const done = isCheckable ? item.done : phase.status === 'completed';

                    return (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            done
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {done ? (
                            <Icon name="Check" size={12} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <span className={done ? 'text-gray-600' : 'text-gray-400'}>
                          {text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
