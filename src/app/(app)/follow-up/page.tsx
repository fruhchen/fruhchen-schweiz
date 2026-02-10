'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PageHeader } from '@/components/layout/page-header';

const UPCOMING_APPOINTMENTS = [
  {
    id: '1',
    title: 'Kinderarzt-Kontrolle',
    doctor: 'Dr. med. M. Fischer',
    date: '2026-02-20',
    time: '10:30',
    location: 'Praxis am Bahnhof, Bern',
    type: 'checkup',
    notes: 'Gewichtskontrolle, Impfberatung',
  },
  {
    id: '2',
    title: 'Augenärztliche Kontrolle (ROP)',
    doctor: 'Dr. med. L. Schneider',
    date: '2026-02-27',
    time: '14:00',
    location: 'Inselspital Bern, Augenklinik',
    type: 'specialist',
    notes: 'ROP-Screening Folgeuntersuchung',
  },
  {
    id: '3',
    title: 'Physiotherapie',
    doctor: 'S. Gerber, Physiotherapeutin',
    date: '2026-03-03',
    time: '09:00',
    location: 'Physio Zentrum Bern',
    type: 'therapy',
    notes: 'Motorische Entwicklungsförderung',
  },
];

const MEDICATIONS = [
  { name: 'Vitamin D Tropfen', dosage: '1 Tropfen täglich', time: 'Morgens', active: true },
  { name: 'Eisenpräparat', dosage: '0.5ml täglich', time: 'Mittags', active: true },
  { name: 'Koffeinzitrat', dosage: '1ml täglich', time: 'Morgens', active: false, note: 'Abgesetzt am 10.02.' },
];

const CHECKINS = [
  { date: '2026-02-08', mood: 4, feeding: 'Gut', sleep: 'Okay', notes: 'Guter Tag, hat viel geschlafen' },
  { date: '2026-02-07', mood: 3, feeding: 'Schwierig', sleep: 'Schlecht', notes: 'Unruhige Nacht' },
  { date: '2026-02-06', mood: 4, feeding: 'Gut', sleep: 'Gut', notes: 'Erster Spaziergang!' },
];

const MOOD_EMOJI = ['', '😢', '😔', '😐', '😊', '😄'];

export default function FollowUpPage() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'medications' | 'checkins'>('appointments');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nachsorge"
        subtitle="Termine, Medikamente und Check-ins nach der Entlassung"
        action={<Button variant="primary" size="sm" icon="Plus">Termin</Button>}
      />

      {/* Progress card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-teal-600" />
                <span className="font-semibold text-teal-900">Nachsorge-Fortschritt</span>
              </div>
              <span className="text-sm text-teal-600 font-medium">4 von 12 Terminen</span>
            </div>
            <ProgressBar value={33} color="teal" />
            <p className="text-sm text-teal-700">
              Nächster Termin: <strong>Kinderarzt am 20. Februar</strong>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        {(['appointments', 'medications', 'checkins'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {tab === 'appointments' ? 'Termine' : tab === 'medications' ? 'Medikamente' : 'Check-ins'}
          </button>
        ))}
      </div>

      {/* Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-3">
          {UPCOMING_APPOINTMENTS.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card interactive className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-brand-600">
                    {new Date(apt.date).getDate()}
                  </span>
                  <span className="text-[10px] text-brand-500 font-medium uppercase">
                    {new Date(apt.date).toLocaleDateString('de-CH', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{apt.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{apt.doctor}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {apt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      {apt.location.split(',')[0]}
                    </span>
                  </div>
                  {apt.notes && (
                    <p className="text-xs text-gray-400 mt-1 bg-gray-50 px-2 py-1 rounded-lg">
                      {apt.notes}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Medications */}
      {activeTab === 'medications' && (
        <div className="space-y-3">
          {MEDICATIONS.map((med, i) => (
            <motion.div
              key={med.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className={!med.active ? 'opacity-60' : ''}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    med.active ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <Icon name="Pill" size={20} className={med.active ? 'text-emerald-600' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm">{med.name}</h3>
                      {!med.active && <Badge variant="gray">Abgesetzt</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{med.dosage} — {med.time}</p>
                    {med.note && <p className="text-xs text-gray-400 mt-0.5">{med.note}</p>}
                  </div>
                  {med.active && (
                    <Button variant="ghost" size="sm" icon="Check">
                      Genommen
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Check-ins */}
      {activeTab === 'checkins' && (
        <div className="space-y-3">
          <Button variant="primary" fullWidth icon="Plus">
            Heutiges Check-in
          </Button>
          {CHECKINS.map((ci, i) => (
            <motion.div
              key={ci.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{MOOD_EMOJI[ci.mood]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(ci.date).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        Trinken: {ci.feeding}
                      </span>
                      <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">
                        Schlaf: {ci.sleep}
                      </span>
                    </div>
                    {ci.notes && <p className="text-sm text-gray-500 mt-2">{ci.notes}</p>}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
