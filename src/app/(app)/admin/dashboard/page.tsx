'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PageHeader } from '@/components/layout/page-header';

/* -------------------------------------------------------------------------- */
/*  Animation helpers                                                         */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const kpis = [
  {
    label: 'Aktive Familien',
    value: '247',
    trend: '+12%',
    trendUp: true,
    icon: 'Users' as const,
    color: 'green' as const,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    trendColor: 'text-emerald-600',
  },
  {
    label: 'Spenden YTD',
    value: "CHF 48'320",
    trend: '+8%',
    trendUp: true,
    icon: 'Heart' as const,
    color: 'brand' as const,
    bg: 'bg-brand-50',
    iconColor: 'text-brand-500',
    trendColor: 'text-brand-600',
  },
  {
    label: 'Offene Antraege',
    value: '6',
    trend: '2 dringend',
    trendUp: false,
    icon: 'FileText' as const,
    color: 'yellow' as const,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    trendColor: 'text-amber-600',
  },
  {
    label: 'Peer Sessions',
    value: '89',
    trend: 'diesen Monat',
    trendUp: true,
    icon: 'MessageCircle' as const,
    color: 'teal' as const,
    bg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    trendColor: 'text-teal-600',
  },
];

const donationMonths = [
  { month: 'Jul', amount: 6200, max: 12000 },
  { month: 'Aug', amount: 5800, max: 12000 },
  { month: 'Sep', amount: 9400, max: 12000 },
  { month: 'Okt', amount: 7600, max: 12000 },
  { month: 'Nov', amount: 11200, max: 12000 },
  { month: 'Dez', amount: 8120, max: 12000 },
];

const activityFeed = [
  {
    icon: 'UserPlus' as const,
    text: 'Neue Familie registriert',
    detail: 'Familie Weber, Region Zuerich',
    time: 'vor 2 Std.',
    color: 'bg-emerald-50 text-emerald-500',
  },
  {
    icon: 'Heart' as const,
    text: 'Spende CHF 200 eingegangen',
    detail: 'Online-Spende, anonym',
    time: 'vor 4 Std.',
    color: 'bg-rose-50 text-rose-500',
  },
  {
    icon: 'Send' as const,
    text: 'Antrag bei Stiftung X eingereicht',
    detail: 'CHF 15\'000, Projekt Peer-Ausbau',
    time: 'gestern',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    icon: 'Mail' as const,
    text: 'Newsletter versandt',
    detail: '1\'247 Empfaenger, 42% geoeffnet',
    time: 'vor 2 Tagen',
    color: 'bg-violet-50 text-violet-500',
  },
  {
    icon: 'CheckCircle' as const,
    text: 'Peer-Session abgeschlossen',
    detail: 'Gruppe Bern, 8 Teilnehmende',
    time: 'vor 3 Tagen',
    color: 'bg-teal-50 text-teal-500',
  },
];

const grantsPipeline = [
  { stage: 'Recherche', count: 3, color: 'bg-gray-300' },
  { stage: 'Kontakt', count: 2, color: 'bg-blue-400' },
  { stage: 'Eingereicht', count: 4, color: 'bg-amber-400' },
  { stage: 'Bewilligt', count: 1, color: 'bg-emerald-400' },
];

const quickActions = [
  { label: 'Familie hinzufuegen', icon: 'UserPlus' as const, href: '/admin/families/new' },
  { label: 'Spende erfassen', icon: 'PiggyBank' as const, href: '/admin/donations/new' },
  { label: 'Grant verwalten', icon: 'Landmark' as const, href: '/admin/grants' },
  { label: 'Newsletter senden', icon: 'Send' as const, href: '/admin/newsletter' },
  { label: 'Event erstellen', icon: 'CalendarPlus' as const, href: '/admin/events/new' },
  { label: 'Bericht generieren', icon: 'BarChart3' as const, href: '/admin/reports' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Uebersicht und Kennzahlen auf einen Blick"
        action={
          <Button variant="secondary" icon="Download" size="sm">
            Bericht exportieren
          </Button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/*  KPI Cards                                                         */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} variants={fadeUp} custom={i}>
            <Card className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Icon
                      name={kpi.trendUp ? 'TrendingUp' : 'AlertCircle'}
                      size={14}
                      className={kpi.trendColor}
                    />
                    <span className={`text-xs font-medium ${kpi.trendColor}`}>
                      {kpi.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-11 h-11 rounded-2xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={kpi.icon} size={20} className={kpi.iconColor} />
                </div>
              </div>
              {/* Subtle decorative gradient */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${kpi.bg} opacity-40 blur-2xl`} />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/*  Revenue chart + Activity feed                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donation chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-heading text-gray-900">Spendeneingang</h3>
                <p className="text-sm text-gray-500 mt-0.5">Letzte 6 Monate</p>
              </div>
              <Badge variant="green">
                <Icon name="TrendingUp" size={12} />
                +8% vs. Vorjahr
              </Badge>
            </div>

            <div className="flex items-end gap-3 h-48">
              {donationMonths.map((m, i) => {
                const heightPercent = (m.amount / m.max) * 100;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 tabular-nums">
                      {(m.amount / 1000).toFixed(1)}k
                    </span>
                    <motion.div
                      className="w-full rounded-xl bg-gradient-to-t from-brand-500 to-brand-400 relative group cursor-default"
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.6, delay: 0.1 * i, ease: 'easeOut' }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        CHF {m.amount.toLocaleString('de-CH')}
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-400 font-medium">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-heading text-gray-900">Letzte Aktivitaeten</h3>
              <Icon name="Activity" size={18} className="text-gray-400" />
            </div>

            <div className="space-y-4">
              {activityFeed.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon name={item.icon} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {item.detail}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Grants pipeline + Quick actions                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grants pipeline */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-heading text-gray-900">Grants Pipeline</h3>
                <p className="text-sm text-gray-500 mt-0.5">10 aktive Antraege</p>
              </div>
              <Link href="/admin/grants">
                <Button variant="ghost" size="sm" iconRight="ArrowRight">
                  Alle anzeigen
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {grantsPipeline.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div className="flex items-center gap-2.5 w-28 flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="text-sm text-gray-700 font-medium">
                      {stage.stage}
                    </span>
                  </div>
                  <div className="flex-1">
                    <ProgressBar
                      value={stage.count}
                      max={10}
                      color={
                        stage.stage === 'Bewilligt'
                          ? 'green'
                          : stage.stage === 'Eingereicht'
                          ? 'brand'
                          : stage.stage === 'Kontakt'
                          ? 'teal'
                          : 'violet'
                      }
                      size="sm"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums w-6 text-right">
                    {stage.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Target" size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  Jahresziel: CHF 120&apos;000
                </span>
              </div>
              <ProgressBar value={48320} max={120000} color="brand" showLabel size="sm" className="w-32" />
            </div>
          </Card>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={7}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-heading text-gray-900">Schnellzugriff</h3>
              <Icon name="Zap" size={18} className="text-amber-400" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-brand-200 hover:shadow-soft transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center">
                      <Icon name={action.icon} size={18} className="text-brand-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
