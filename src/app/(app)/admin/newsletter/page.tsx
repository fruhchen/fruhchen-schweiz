'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
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

type NewsletterItem = (typeof ITEMS)[number];

export default function NewsletterPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedItem, setSelectedItem] = useState<NewsletterItem | null>(null);

  const getStageIndex = (stage: Stage) => STAGES.findIndex((s) => s.id === stage);

  const canMoveForward = (item: NewsletterItem) => {
    const idx = getStageIndex(item.stage);
    return idx < STAGES.length - 1;
  };

  const canMoveBack = (item: NewsletterItem) => {
    const idx = getStageIndex(item.stage);
    return idx > 0;
  };

  const getNextStage = (stage: Stage): Stage | null => {
    const idx = getStageIndex(stage);
    return idx < STAGES.length - 1 ? STAGES[idx + 1].id : null;
  };

  const getPrevStage = (stage: Stage): Stage | null => {
    const idx = getStageIndex(stage);
    return idx > 0 ? STAGES[idx - 1].id : null;
  };

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
                      <Card
                        interactive
                        padding="sm"
                        className="space-y-2 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
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
              <Card
                interactive
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
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

      {/* Newsletter detail modal */}
      <Modal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Newsletter Details"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-5">
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedItem.title}</h3>
            </div>

            {/* Detail fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Status</p>
                <Badge variant={STAGES.find((s) => s.id === selectedItem.stage)?.color as any}>
                  {STAGES.find((s) => s.id === selectedItem.stage)?.label}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Autorin</p>
                <p className="text-sm font-medium text-gray-900">{selectedItem.author}</p>
              </div>
              {selectedItem.date && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Erstellt am</p>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedItem.date).toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              )}
              {'scheduledFor' in selectedItem && selectedItem.scheduledFor && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Geplant für</p>
                  <div className="flex items-center gap-1.5">
                    <Icon name="Calendar" size={14} className="text-brand-500" />
                    <p className="text-sm text-gray-700">
                      {new Date(selectedItem.scheduledFor).toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
              {'sentDate' in selectedItem && selectedItem.sentDate && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Versandt am</p>
                  <div className="flex items-center gap-1.5">
                    <Icon name="Send" size={14} className="text-green-500" />
                    <p className="text-sm text-gray-700">
                      {new Date(selectedItem.sentDate).toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Performance stats for sent newsletters */}
            {'opens' in selectedItem && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Performance</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-600">{selectedItem.opens}</p>
                    <p className="text-xs text-gray-500">Opens</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{selectedItem.clicks}</p>
                    <p className="text-xs text-gray-500">Clicks</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stage action buttons */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              {canMoveBack(selectedItem) && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon="ArrowLeft"
                  onClick={() => {
                    const prev = getPrevStage(selectedItem.stage);
                    if (prev) {
                      setSelectedItem({ ...selectedItem, stage: prev });
                    }
                  }}
                >
                  {STAGES.find((s) => s.id === getPrevStage(selectedItem.stage))?.label}
                </Button>
              )}
              <div className="flex-1" />
              {canMoveForward(selectedItem) && (
                <Button
                  variant="primary"
                  size="sm"
                  icon="ArrowRight"
                  onClick={() => {
                    const next = getNextStage(selectedItem.stage);
                    if (next) {
                      setSelectedItem({ ...selectedItem, stage: next });
                    }
                  }}
                >
                  {STAGES.find((s) => s.id === getNextStage(selectedItem.stage))?.label}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
