'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';

type Stage = 'idea' | 'draft' | 'review' | 'scheduled' | 'sent';

const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: 'idea', label: 'Ideen', color: 'gray' },
  { id: 'draft', label: 'Entwurf', color: 'blue' },
  { id: 'review', label: 'Review', color: 'violet' },
  { id: 'scheduled', label: 'Geplant', color: 'brand' },
  { id: 'sent', label: 'Versandt', color: 'green' },
];

const ITEMS = [
  { id: '1', title: 'Weltfrühgeborenentag 2026 — Save the Date', stage: 'idea' as Stage, author: 'Dina', date: '2026-02-08' },
  { id: '2', title: 'Neue Peer-Gruppe in Zürich', stage: 'idea' as Stage, author: 'Sandra', date: '2026-02-06' },
  { id: '3', title: 'Interview: 5 Jahre Frühchen Schweiz', stage: 'draft' as Stage, author: 'Désirée', date: '2026-02-05' },
  { id: '4', title: 'Frühling und Frühgeborene — Tipps', stage: 'draft' as Stage, author: 'Nadine', date: '2026-02-03' },
  { id: '5', title: 'Jahresbericht 2025', stage: 'review' as Stage, author: 'Dina', date: '2026-02-01' },
  { id: '6', title: 'Workshop-Rückblick Januar', stage: 'scheduled' as Stage, author: 'Sandra', scheduledFor: '2026-02-15' },
  { id: '7', title: 'Newsletter Januar 2026', stage: 'sent' as Stage, author: 'Dina', sentDate: '2026-01-20', opens: 342, clicks: 87 },
  { id: '8', title: 'Spendenaufruf Weihnachten', stage: 'sent' as Stage, author: 'Désirée', sentDate: '2025-12-15', opens: 489, clicks: 156 },
];

export default function NewsletterPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter Pipeline"
        subtitle="Ideen, Entwürfe und versandte Newsletter"
        action={
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setView('kanban')}
                className={`p-1.5 rounded-lg transition-all ${view === 'kanban' ? 'bg-white shadow-sm' : ''}`}
              >
                <Icon name="LayoutGrid" size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>
            <Button variant="primary" size="sm" icon="Plus">Neue Idee</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900">831</p>
          <p className="text-xs text-gray-500">Abonnenten</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-brand-600">42%</p>
          <p className="text-xs text-gray-500">Ø Öffnungsrate</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-teal-600">18%</p>
          <p className="text-xs text-gray-500">Ø Klickrate</p>
        </Card>
      </div>

      {/* Kanban view */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {STAGES.map((stage) => {
            const stageItems = ITEMS.filter((item) => item.stage === stage.id);
            return (
              <div key={stage.id} className="min-w-[260px] flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={stage.color as any}>{stage.label}</Badge>
                  <span className="text-xs text-gray-400">{stageItems.length}</span>
                </div>
                <div className="space-y-3">
                  {stageItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Card interactive padding="sm" className="space-y-2">
                        <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{item.author}</span>
                          {'scheduledFor' in item && (
                            <Badge variant="brand" className="text-[10px]">
                              <Icon name="Calendar" size={10} className="mr-1" />
                              {new Date(item.scheduledFor!).toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })}
                            </Badge>
                          )}
                          {'opens' in item && (
                            <span className="text-xs text-gray-400">
                              {item.opens} Opens · {item.clicks} Clicks
                            </span>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  {stageItems.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center text-sm text-gray-400">
                      Leer
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}
            >
              <Card interactive className="flex items-center gap-4">
                <Badge variant={STAGES.find((s) => s.id === item.stage)?.color as any}>
                  {STAGES.find((s) => s.id === item.stage)?.label}
                </Badge>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.author} · {item.date ? new Date(item.date).toLocaleDateString('de-CH') : ''}</p>
                </div>
                {'opens' in item && (
                  <div className="text-right text-xs text-gray-400">
                    <p>{item.opens} Opens</p>
                    <p>{item.clicks} Clicks</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
