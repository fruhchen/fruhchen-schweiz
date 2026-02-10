'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Stage = 'recherche' | 'kontakt' | 'eingereicht' | 'bewilligt' | 'abgelehnt';

interface Grant {
  id: string;
  foundation: string;
  contactPerson: string;
  email: string;
  amount: number | null;
  deadline: string | null;
  nextAction: string;
  lastContact: string;
  notes: string;
  stage: Stage;
}

/* -------------------------------------------------------------------------- */
/*  Column config                                                             */
/* -------------------------------------------------------------------------- */

const columns: { key: Stage; label: string; color: string; dotColor: string; badgeVariant: 'gray' | 'blue' | 'yellow' | 'green' | 'red' }[] = [
  { key: 'recherche', label: 'Recherche', color: 'border-gray-300', dotColor: 'bg-gray-400', badgeVariant: 'gray' },
  { key: 'kontakt', label: 'Kontakt aufgenommen', color: 'border-blue-400', dotColor: 'bg-blue-400', badgeVariant: 'blue' },
  { key: 'eingereicht', label: 'Antrag eingereicht', color: 'border-amber-400', dotColor: 'bg-amber-400', badgeVariant: 'yellow' },
  { key: 'bewilligt', label: 'Bewilligt', color: 'border-emerald-400', dotColor: 'bg-emerald-400', badgeVariant: 'green' },
  { key: 'abgelehnt', label: 'Abgelehnt', color: 'border-red-400', dotColor: 'bg-red-400', badgeVariant: 'red' },
];

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const initialGrants: Grant[] = [
  {
    id: '1',
    foundation: 'Pro Juventute',
    contactPerson: 'Anna Meier',
    email: 'a.meier@projuventute.ch',
    amount: 15000,
    deadline: '2025-01-15',
    nextAction: 'Abschlussbericht einreichen',
    lastContact: '2025-01-02',
    notes: 'Foerderzusage fuer Peer-Support-Ausbau erhalten. Bericht bis Q1.',
    stage: 'bewilligt',
  },
  {
    id: '2',
    foundation: 'Glueckskette',
    contactPerson: 'Marc Dupont',
    email: 'm.dupont@glueckskette.ch',
    amount: 25000,
    deadline: '2025-02-15',
    nextAction: 'Rueckfragen beantworten',
    lastContact: '2025-01-20',
    notes: 'Antrag fuer regionale Elterngruppen eingereicht. Deadline fuer Antwort in 2 Wochen.',
    stage: 'eingereicht',
  },
  {
    id: '3',
    foundation: 'Ernst Goehner Stiftung',
    contactPerson: 'Dr. Lukas Baer',
    email: 'l.baer@goehner-stiftung.ch',
    amount: 10000,
    deadline: '2025-03-31',
    nextAction: 'Antrag fertigstellen und einreichen',
    lastContact: '2025-01-10',
    notes: 'Erstes Gespraech positiv verlaufen. Interesse an NEO-Box-Finanzierung.',
    stage: 'kontakt',
  },
  {
    id: '4',
    foundation: 'Migros Kulturprozent',
    contactPerson: '',
    email: '',
    amount: null,
    deadline: null,
    nextAction: 'Kontaktperson identifizieren',
    lastContact: '',
    notes: 'Foerdert Projekte im Bereich Gesundheitskompetenz. Recherche zu passenden Programmen.',
    stage: 'recherche',
  },
  {
    id: '5',
    foundation: 'UBS Optimus Foundation',
    contactPerson: 'Sarah Klein',
    email: 's.klein@ubs.com',
    amount: 50000,
    deadline: '2025-02-28',
    nextAction: 'Wirkungsbericht nachliefern',
    lastContact: '2025-01-18',
    notes: 'Grossantrag fuer digitale Plattform-Entwicklung. Positive Vorsignale.',
    stage: 'eingereicht',
  },
  {
    id: '6',
    foundation: 'Beisheim Stiftung',
    contactPerson: 'Thomas Roth',
    email: 't.roth@beisheim.ch',
    amount: 20000,
    deadline: '2025-04-15',
    nextAction: 'Detailkonzept senden',
    lastContact: '2025-01-05',
    notes: 'Interesse an Nachsorge-Programm geaeussert. Termin fuer Praesentaiton vereinbaren.',
    stage: 'kontakt',
  },
  {
    id: '7',
    foundation: 'Stiftung Mercator Schweiz',
    contactPerson: '',
    email: '',
    amount: null,
    deadline: null,
    nextAction: 'Foerderrichtlinien pruefen',
    lastContact: '',
    notes: 'Foerdert Bildungs- und Integrationsprojekte. Passung evaluieren.',
    stage: 'recherche',
  },
  {
    id: '8',
    foundation: 'Christoph Merian Stiftung',
    contactPerson: '',
    email: '',
    amount: null,
    deadline: null,
    nextAction: 'Erste Anfrage senden',
    lastContact: '',
    notes: 'Regional Basel. Pruefen ob Fruehchen-Projekt passt.',
    stage: 'recherche',
  },
  {
    id: '9',
    foundation: 'Stiftung fuer Kindergesundheit',
    contactPerson: 'Dr. Eva Brunner',
    email: 'e.brunner@kindergesundheit.ch',
    amount: 8000,
    deadline: '2025-03-01',
    nextAction: 'Antrag ueberarbeiten und erneut einreichen',
    lastContact: '2024-12-15',
    notes: 'Erstantrag abgelehnt wegen formaler Maengel. Feedback erhalten, Ueberarbeitung geplant.',
    stage: 'abgelehnt',
  },
  {
    id: '10',
    foundation: 'Avina Stiftung',
    contactPerson: 'Claudia Huber',
    email: 'c.huber@avina.ch',
    amount: 30000,
    deadline: '2025-03-15',
    nextAction: 'Praesentation vorbereiten',
    lastContact: '2025-01-22',
    notes: 'Einladung zur muendlichen Praesentation am 12.02. Gutes Zeichen.',
    stage: 'eingereicht',
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatAmount(amount: number | null): string {
  if (amount === null) return '--';
  return `CHF ${amount.toLocaleString('de-CH')}`;
}

function formatDate(date: string | null): string {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function daysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function deadlineUrgency(deadline: string | null): 'urgent' | 'warning' | 'ok' | null {
  const days = daysUntilDeadline(deadline);
  if (days === null) return null;
  if (days < 0) return 'urgent';
  if (days <= 14) return 'warning';
  return 'ok';
}

const urgencyStyles = {
  urgent: 'bg-red-50 text-red-700 border border-red-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  ok: 'bg-gray-50 text-gray-600 border border-gray-200',
};

/* -------------------------------------------------------------------------- */
/*  Empty form state                                                          */
/* -------------------------------------------------------------------------- */

const emptyGrant: Omit<Grant, 'id'> = {
  foundation: '',
  contactPerson: '',
  email: '',
  amount: null,
  deadline: null,
  nextAction: '',
  lastContact: '',
  notes: '',
  stage: 'recherche',
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>(initialGrants);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Grant, 'id'>>(emptyGrant);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Stage | null>(null);

  /* ------ Form helpers -------------------------------------------------- */

  function handleFormChange(field: keyof Omit<Grant, 'id'>, value: string | number | null) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddGrant() {
    if (!formData.foundation.trim()) return;
    const newGrant: Grant = {
      ...formData,
      id: Date.now().toString(),
      lastContact: new Date().toISOString().split('T')[0],
    };
    setGrants((prev) => [...prev, newGrant]);
    setShowAddModal(false);
    setFormData(emptyGrant);
  }

  /* ------ Drag handlers (simple HTML drag-and-drop) --------------------- */

  function handleDragStart(e: React.DragEvent, grantId: string) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', grantId);
    setDraggedId(grantId);
  }

  function handleDragOver(e: React.DragEvent, column: Stage) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  }

  function handleDragLeave() {
    setDragOverColumn(null);
  }

  function handleDrop(e: React.DragEvent, targetStage: Stage) {
    e.preventDefault();
    const grantId = e.dataTransfer.getData('text/plain');
    setGrants((prev) =>
      prev.map((g) => (g.id === grantId ? { ...g, stage: targetStage } : g))
    );
    setDraggedId(null);
    setDragOverColumn(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverColumn(null);
  }

  /* ------ Move card helper for detail modal ----------------------------- */

  function moveGrantToStage(grantId: string, stage: Stage) {
    setGrants((prev) =>
      prev.map((g) => (g.id === grantId ? { ...g, stage } : g))
    );
    setSelectedGrant((prev) => (prev ? { ...prev, stage } : null));
  }

  /* ------ Stats --------------------------------------------------------- */

  const totalPipeline = grants
    .filter((g) => g.stage !== 'abgelehnt')
    .reduce((sum, g) => sum + (g.amount || 0), 0);

  const totalBewilligt = grants
    .filter((g) => g.stage === 'bewilligt')
    .reduce((sum, g) => sum + (g.amount || 0), 0);

  /* ------ Render -------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grants & Stiftungen"
        subtitle="Kanban-Board fuer die Stiftungs-Pipeline"
        action={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 mr-2">
              <span>
                Pipeline:{' '}
                <span className="font-semibold text-gray-900">
                  {formatAmount(totalPipeline)}
                </span>
              </span>
              <span>
                Bewilligt:{' '}
                <span className="font-semibold text-emerald-600">
                  {formatAmount(totalBewilligt)}
                </span>
              </span>
            </div>
            <Button icon="Plus" size="sm" onClick={() => setShowAddModal(true)}>
              Neuer Grant
            </Button>
          </div>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/*  Kanban board                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:-mx-8 lg:px-8">
        {columns.map((col) => {
          const colGrants = grants.filter((g) => g.stage === col.key);
          const isOver = dragOverColumn === col.key;

          return (
            <div
              key={col.key}
              className="flex-shrink-0 w-72 lg:w-auto lg:flex-1 min-w-[280px]"
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              {/* Column header */}
              <div className={`flex items-center gap-2.5 mb-3 pb-2.5 border-b-2 ${col.color}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="text-sm font-semibold text-gray-700">{col.label}</h3>
                <Badge variant={col.badgeVariant} className="ml-auto text-[10px] px-2 py-0.5">
                  {colGrants.length}
                </Badge>
              </div>

              {/* Cards area */}
              <div
                className={`space-y-3 min-h-[200px] rounded-2xl p-2 transition-colors duration-200 ${
                  isOver ? 'bg-brand-50/60 ring-2 ring-brand-200 ring-inset' : 'bg-transparent'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {colGrants.map((grant) => {
                    const urgency = deadlineUrgency(grant.deadline);
                    const days = daysUntilDeadline(grant.deadline);
                    const isDragged = draggedId === grant.id;

                    return (
                      <motion.div
                        key={grant.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: isDragged ? 0.5 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, grant.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedGrant(grant)}
                        className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 cursor-grab active:cursor-grabbing hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200 group"
                      >
                        {/* Foundation name */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                            {grant.foundation}
                          </h4>
                          <Icon
                            name="GripVertical"
                            size={14}
                            className="text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-0.5"
                          />
                        </div>

                        {/* Amount */}
                        {grant.amount && (
                          <p className="text-lg font-bold text-gray-900 mb-2">
                            {formatAmount(grant.amount)}
                          </p>
                        )}

                        {/* Deadline */}
                        {grant.deadline && urgency && (
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mb-2.5 ${urgencyStyles[urgency]}`}
                          >
                            <Icon
                              name={urgency === 'urgent' ? 'AlertTriangle' : urgency === 'warning' ? 'Clock' : 'Calendar'}
                              size={12}
                            />
                            {days !== null && days < 0
                              ? `${Math.abs(days)} Tage ueberfaellig`
                              : days !== null && days === 0
                              ? 'Heute faellig'
                              : `${days} Tage verbleibend`}
                          </div>
                        )}

                        {/* Next action */}
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">
                          <span className="font-medium text-gray-600">Naechster Schritt:</span>{' '}
                          {grant.nextAction}
                        </p>

                        {/* Contact + last contact */}
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                          {grant.contactPerson ? (
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={11} />
                              {grant.contactPerson}
                            </span>
                          ) : (
                            <span className="italic">Kein Kontakt</span>
                          )}
                          {grant.lastContact && (
                            <span>{formatDate(grant.lastContact)}</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Empty column hint */}
                {colGrants.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                    <Icon name="Inbox" size={28} />
                    <p className="text-xs mt-2">Keine Grants</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Detail modal                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        open={!!selectedGrant}
        onClose={() => setSelectedGrant(null)}
        title={selectedGrant?.foundation || ''}
        size="lg"
      >
        {selectedGrant && (
          <div className="space-y-6">
            {/* Top summary */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant={
                  columns.find((c) => c.key === selectedGrant.stage)?.badgeVariant || 'gray'
                }
              >
                {columns.find((c) => c.key === selectedGrant.stage)?.label}
              </Badge>
              {selectedGrant.amount && (
                <span className="text-xl font-bold text-gray-900">
                  {formatAmount(selectedGrant.amount)}
                </span>
              )}
              {selectedGrant.deadline && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    urgencyStyles[deadlineUrgency(selectedGrant.deadline) || 'ok']
                  }`}
                >
                  <Icon name="Calendar" size={12} />
                  Deadline: {formatDate(selectedGrant.deadline)}
                </span>
              )}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Kontaktperson
                </p>
                <p className="text-sm text-gray-900">
                  {selectedGrant.contactPerson || '--'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  E-Mail
                </p>
                {selectedGrant.email ? (
                  <a
                    href={`mailto:${selectedGrant.email}`}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    {selectedGrant.email}
                  </a>
                ) : (
                  <p className="text-sm text-gray-900">--</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Letzter Kontakt
                </p>
                <p className="text-sm text-gray-900">
                  {formatDate(selectedGrant.lastContact)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Naechster Schritt
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {selectedGrant.nextAction}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Notizen
              </p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">
                {selectedGrant.notes || 'Keine Notizen vorhanden.'}
              </p>
            </div>

            {/* Stage move buttons */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Verschieben nach
              </p>
              <div className="flex flex-wrap gap-2">
                {columns
                  .filter((c) => c.key !== selectedGrant.stage)
                  .map((col) => (
                    <Button
                      key={col.key}
                      variant="secondary"
                      size="sm"
                      onClick={() => moveGrantToStage(selectedGrant.id, col.key)}
                    >
                      <span className={`w-2 h-2 rounded-full ${col.dotColor} mr-1.5`} />
                      {col.label}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------------ */}
      {/*  Add grant modal                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData(emptyGrant);
        }}
        title="Neuen Grant erfassen"
        size="lg"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Stiftungsname"
              placeholder="z.B. Pro Juventute"
              icon="Landmark"
              value={formData.foundation}
              onChange={(e) => handleFormChange('foundation', e.target.value)}
            />
            <Input
              label="Kontaktperson"
              placeholder="Vor- und Nachname"
              icon="User"
              value={formData.contactPerson}
              onChange={(e) => handleFormChange('contactPerson', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="E-Mail"
              placeholder="kontakt@stiftung.ch"
              icon="Mail"
              type="email"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
            />
            <Input
              label="Betrag (CHF)"
              placeholder="z.B. 15000"
              icon="Banknote"
              type="number"
              value={formData.amount?.toString() || ''}
              onChange={(e) =>
                handleFormChange('amount', e.target.value ? parseInt(e.target.value, 10) : null)
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Deadline"
              type="date"
              icon="Calendar"
              value={formData.deadline || ''}
              onChange={(e) => handleFormChange('deadline', e.target.value || null)}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Phase
              </label>
              <select
                value={formData.stage}
                onChange={(e) => handleFormChange('stage', e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 hover:border-gray-300"
              >
                {columns.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Naechster Schritt"
            placeholder="z.B. Erstanfrage senden"
            icon="ArrowRight"
            value={formData.nextAction}
            onChange={(e) => handleFormChange('nextAction', e.target.value)}
          />

          <Textarea
            label="Notizen"
            placeholder="Zusaetzliche Informationen, interne Bemerkungen..."
            value={formData.notes}
            onChange={(e) => handleFormChange('notes', e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setFormData(emptyGrant);
              }}
            >
              Abbrechen
            </Button>
            <Button
              icon="Plus"
              onClick={handleAddGrant}
              disabled={!formData.foundation.trim()}
            >
              Grant hinzufuegen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
