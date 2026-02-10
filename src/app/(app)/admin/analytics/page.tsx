'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PageHeader } from '@/components/layout/page-header';

const METRICS = [
  { label: 'Aktive Nutzer (30 Tage)', value: '247', change: '+12%', positive: true, icon: 'Users' },
  { label: 'Neue Registrierungen', value: '34', change: '+18%', positive: true, icon: 'UserPlus' },
  { label: 'Journal-Einträge', value: '189', change: '+7%', positive: true, icon: 'BookHeart' },
  { label: 'AI Chat Anfragen', value: '412', change: '+31%', positive: true, icon: 'MessageCircle' },
  { label: 'Peer Sessions', value: '89', change: '+5%', positive: true, icon: 'Heart' },
  { label: 'Events besucht', value: '56', change: '-3%', positive: false, icon: 'Calendar' },
];

const FEATURE_USAGE = [
  { feature: 'Tagebuch', usage: 78, color: 'rose' as const },
  { feature: 'Glossar', usage: 65, color: 'violet' as const },
  { feature: 'AI Chat', usage: 58, color: 'teal' as const },
  { feature: 'Events', usage: 42, color: 'brand' as const },
  { feature: 'Peer Chat', usage: 35, color: 'green' as const },
  { feature: 'Babyphone', usage: 28, color: 'rose' as const },
  { feature: 'Timeline', usage: 22, color: 'violet' as const },
  { feature: 'Familie updaten', usage: 18, color: 'teal' as const },
];

const MONTHLY_USERS = [
  { month: 'Sep', users: 120 },
  { month: 'Okt', users: 145 },
  { month: 'Nov', users: 178 },
  { month: 'Dez', users: 201 },
  { month: 'Jan', users: 228 },
  { month: 'Feb', users: 247 },
];

const REGIONS_DATA = [
  { region: 'Bern', families: 78, percentage: 32 },
  { region: 'Zürich', families: 52, percentage: 21 },
  { region: 'Aarau', families: 38, percentage: 15 },
  { region: 'St. Gallen', families: 31, percentage: 13 },
  { region: 'Basel', families: 22, percentage: 9 },
  { region: 'Andere', families: 26, percentage: 10 },
];

export default function AnalyticsPage() {
  const maxUsers = Math.max(...MONTHLY_USERS.map((m) => m.users));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytik & Reporting"
        subtitle="Nutzungsstatistiken und Impact-Metriken"
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card>
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon name={metric.icon as any} size={18} className="text-brand-500" />
                </div>
                <Badge variant={metric.positive ? 'green' : 'red'}>{metric.change}</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{metric.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User growth chart */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Nutzerwachstum</h3>
        <div className="flex items-end gap-4 h-48">
          {MONTHLY_USERS.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">{m.users}</span>
              <div className="w-full relative">
                <div
                  className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-xl transition-all duration-700"
                  style={{ height: `${(m.users / maxUsers) * 150}px` }}
                />
              </div>
              <span className="text-xs text-gray-500">{m.month}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature usage */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Feature-Nutzung</h3>
          <div className="space-y-4">
            {FEATURE_USAGE.map((f) => (
              <div key={f.feature}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{f.feature}</span>
                  <span className="text-gray-500">{f.usage}%</span>
                </div>
                <ProgressBar value={f.usage} color={f.color} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Regional distribution */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Regionale Verteilung</h3>
          <div className="space-y-3">
            {REGIONS_DATA.map((r, i) => (
              <motion.div
                key={r.region}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <span className="text-sm font-bold text-violet-600">{r.percentage}%</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{r.region}</span>
                    <span className="text-xs text-gray-400">{r.families} Familien</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-400 rounded-full"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Impact summary */}
      <Card className="bg-gradient-to-r from-brand-50 to-violet-50 border-brand-200/50">
        <h3 className="font-semibold text-gray-900 mb-3">Impact Report — Für Stiftungsanträge</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-brand-600">247</p>
            <p className="text-sm text-gray-600">Familien begleitet</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-violet-600">89</p>
            <p className="text-sm text-gray-600">Peer Sessions/Monat</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-teal-600">8</p>
            <p className="text-sm text-gray-600">Aktive Regionen</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-rose-600">24/7</p>
            <p className="text-sm text-gray-600">Support verfügbar</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
