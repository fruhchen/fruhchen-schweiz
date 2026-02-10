'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SearchInput } from '@/components/ui/search-input';
import { PageHeader } from '@/components/layout/page-header';

const VOLUNTEERS = [
  {
    id: '1', name: 'Maria Keller', region: 'Bern', role: 'Senior Peer', active: true,
    modulesCompleted: 8, totalModules: 8, refresherDue: null, sessionsThisMonth: 12,
  },
  {
    id: '2', name: 'Thomas Brunner', region: 'Aarau', role: 'Peer', active: true,
    modulesCompleted: 6, totalModules: 8, refresherDue: '2026-03-15', sessionsThisMonth: 8,
  },
  {
    id: '3', name: 'Anna Schmid', region: 'St. Gallen', role: 'Peer', active: true,
    modulesCompleted: 8, totalModules: 8, refresherDue: '2026-02-28', sessionsThisMonth: 5,
  },
  {
    id: '4', name: 'Claudia Weber', region: 'Zürich', role: 'Trainer', active: true,
    modulesCompleted: 8, totalModules: 8, refresherDue: null, sessionsThisMonth: 15,
  },
  {
    id: '5', name: 'Peter Meier', region: 'Bern', role: 'Peer', active: false,
    modulesCompleted: 4, totalModules: 8, refresherDue: null, sessionsThisMonth: 0,
  },
  {
    id: '6', name: 'Laura Roth', region: 'Basel', role: 'Peer', active: true,
    modulesCompleted: 7, totalModules: 8, refresherDue: '2026-04-01', sessionsThisMonth: 6,
  },
];

const TRAINING_MODULES = [
  'Grundlagen Peer-Begleitung',
  'Kommunikation & Gesprächsführung',
  'Frühgeburt & Neonatologie Basics',
  'Psychische Gesundheit erkennen',
  'Trauer & Verlust begleiten',
  'Grenzen setzen & Selbstfürsorge',
  'Digitale Begleitung',
  'Praxis & Supervision',
];

const roleColors: Record<string, string> = {
  Peer: 'violet',
  'Senior Peer': 'brand',
  Trainer: 'teal',
};

export default function VolunteersPage() {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('Alle');

  const regions = ['Alle', ...Array.from(new Set(VOLUNTEERS.map((v) => v.region)))];
  const filtered = VOLUNTEERS.filter((v) => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === 'Alle' || v.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const activeCount = VOLUNTEERS.filter((v) => v.active).length;
  const refreshersDue = VOLUNTEERS.filter((v) => v.refresherDue && new Date(v.refresherDue) <= new Date(Date.now() + 30 * 86400000)).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Freiwillige & Peers"
        subtitle="Training, Status und Einsatzplanung"
        action={<Button variant="primary" size="sm" icon="UserPlus">Neue*r Freiwillige*r</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Aktive Peers', value: activeCount, icon: 'Users', color: 'brand' },
          { label: 'Sessions/Monat', value: VOLUNTEERS.reduce((s, v) => s + v.sessionsThisMonth, 0), icon: 'MessageCircle', color: 'teal' },
          { label: 'Auffrischung fällig', value: refreshersDue, icon: 'AlertCircle', color: 'rose' },
          { label: 'Regionen', value: new Set(VOLUNTEERS.map((v) => v.region)).size, icon: 'MapPin', color: 'violet' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <Icon name={stat.icon as any} size={16} className={`text-${stat.color}-500`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and filter */}
      <div className="flex gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Freiwillige suchen..." className="flex-1" />
        <div className="flex gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                regionFilter === r ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Volunteer cards */}
      <div className="space-y-3">
        {filtered.map((vol, i) => (
          <motion.div
            key={vol.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
          >
            <Card interactive className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name={vol.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{vol.name}</h3>
                    <Badge variant={roleColors[vol.role] as any}>{vol.role}</Badge>
                    {!vol.active && <Badge variant="gray">Inaktiv</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1"><Icon name="MapPin" size={12} />{vol.region}</span>
                    <span>{vol.sessionsThisMonth} Sessions/Mt.</span>
                  </div>
                </div>
                {vol.refresherDue && new Date(vol.refresherDue) <= new Date(Date.now() + 30 * 86400000) && (
                  <Badge variant="rose">
                    <Icon name="AlertCircle" size={12} className="mr-1" />
                    Auffrischung fällig
                  </Badge>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Training</span>
                  <span>{vol.modulesCompleted}/{vol.totalModules} Module</span>
                </div>
                <ProgressBar
                  value={vol.modulesCompleted}
                  max={vol.totalModules}
                  color={vol.modulesCompleted === vol.totalModules ? 'green' : 'brand'}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Training modules reference */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">Ausbildungsmodule</h3>
        <div className="space-y-2">
          {TRAINING_MODULES.map((module, i) => (
            <div key={module} className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <span className="text-gray-700">{module}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
