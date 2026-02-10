'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';

interface Donation {
  id: string;
  donor: string;
  amount: number;
  method: string;
  date: string;
  recurring: boolean;
  receipt: boolean;
}

const DONATIONS: Donation[] = [
  { id: '1', donor: 'Familie Brunner', amount: 200, method: 'twint', date: '2026-02-08', recurring: true, receipt: true },
  { id: '2', donor: 'Anonym', amount: 50, method: 'online', date: '2026-02-07', recurring: false, receipt: false },
  { id: '3', donor: 'Stiftung Mercator', amount: 5000, method: 'bank', date: '2026-02-05', recurring: false, receipt: true },
  { id: '4', donor: 'M. Keller', amount: 100, method: 'twint', date: '2026-02-03', recurring: true, receipt: true },
  { id: '5', donor: 'Anonym', amount: 75, method: 'online', date: '2026-02-01', recurring: false, receipt: false },
  { id: '6', donor: 'Dr. K. Fischer', amount: 500, method: 'bank', date: '2026-01-28', recurring: false, receipt: true },
  { id: '7', donor: 'Familie Weber', amount: 150, method: 'twint', date: '2026-01-25', recurring: true, receipt: true },
  { id: '8', donor: 'Rotary Club Bern', amount: 3000, method: 'bank', date: '2026-01-20', recurring: false, receipt: true },
];

const MONTHLY_DATA = [
  { month: 'Sep', amount: 3200 },
  { month: 'Okt', amount: 4100 },
  { month: 'Nov', amount: 8500 },
  { month: 'Dez', amount: 12300 },
  { month: 'Jan', amount: 6800 },
  { month: 'Feb', amount: 3075 },
];

const methodIcons: Record<string, string> = {
  twint: 'Smartphone',
  bank: 'Landmark',
  online: 'Globe',
  other: 'CreditCard',
};

const methodLabels: Record<string, string> = {
  twint: 'Twint',
  bank: 'Banküberweisung',
  online: 'Online',
  other: 'Andere',
};

export default function DonationsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const totalYTD = DONATIONS.reduce((sum, d) => sum + d.amount, 0);
  const recurringCount = DONATIONS.filter((d) => d.recurring).length;
  const pendingReceipts = DONATIONS.filter((d) => !d.receipt).length;
  const maxMonthly = Math.max(...MONTHLY_DATA.map((m) => m.amount));

  const filtered = filter === 'all' ? DONATIONS : DONATIONS.filter((d) => d.method === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spenden & Gönner"
        subtitle="Donation management und Spendenbescheinigungen"
        action={<Button variant="primary" size="sm" icon="Plus">Spende erfassen</Button>}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total YTD', value: `CHF ${totalYTD.toLocaleString('de-CH')}`, icon: 'TrendingUp', color: 'brand' },
          { label: 'Gönner*innen', value: recurringCount.toString(), icon: 'Heart', color: 'rose' },
          { label: 'Offene Bescheinigungen', value: pendingReceipts.toString(), icon: 'FileText', color: 'violet' },
          { label: 'Spenden Feb.', value: DONATIONS.filter((d) => d.date.startsWith('2026-02')).length.toString(), icon: 'Calendar', color: 'teal' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center`}>
                  <Icon name={kpi.icon as any} size={18} className={`text-${kpi.color}-500`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500">{kpi.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Spendenverlauf</h3>
        <div className="flex items-end gap-3 h-40">
          {MONTHLY_DATA.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400 font-medium">
                {(m.amount / 1000).toFixed(1)}k
              </span>
              <div
                className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-lg transition-all duration-500"
                style={{ height: `${(m.amount / maxMonthly) * 120}px` }}
              />
              <span className="text-xs text-gray-500">{m.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'twint', 'bank', 'online'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f === 'all' ? 'Alle' : methodLabels[f]}
          </button>
        ))}
      </div>

      {/* Donations list */}
      <div className="space-y-3">
        {filtered.map((donation, i) => (
          <motion.div
            key={donation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
          >
            <Card interactive className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedDonation(donation)}>
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon name={methodIcons[donation.method] as any} size={18} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 text-sm">{donation.donor}</h3>
                  {donation.recurring && <Badge variant="violet">Gönner*in</Badge>}
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(donation.date).toLocaleDateString('de-CH')} · {methodLabels[donation.method]}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">CHF {donation.amount.toLocaleString('de-CH')}</p>
                {!donation.receipt && (
                  <Button variant="ghost" size="sm" className="text-xs text-brand-500 p-0 h-auto">
                    Bescheinigung
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Donation detail modal */}
      <Modal open={!!selectedDonation} onClose={() => setSelectedDonation(null)} title="Spendendetails" size="md">
        {selectedDonation && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon name={methodIcons[selectedDonation.method] as any} size={22} className="text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{selectedDonation.donor}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {selectedDonation.recurring && <Badge variant="violet">Gönner*in</Badge>}
                  {selectedDonation.receipt ? <Badge variant="green">Bescheinigung erstellt</Badge> : <Badge variant="yellow">Bescheinigung ausstehend</Badge>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Betrag</p>
                <p className="text-2xl font-bold text-gray-900">CHF {selectedDonation.amount.toLocaleString('de-CH')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedDonation.date).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Zahlungsmethode</p>
                <p className="text-sm text-gray-900">{methodLabels[selectedDonation.method]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Typ</p>
                <p className="text-sm text-gray-900">{selectedDonation.recurring ? 'Wiederkehrend' : 'Einmalig'}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              {!selectedDonation.receipt && (
                <Button variant="primary" size="sm" icon="FileText">Bescheinigung erstellen</Button>
              )}
              <Button variant="secondary" size="sm" icon="Mail">Dankesmail senden</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
