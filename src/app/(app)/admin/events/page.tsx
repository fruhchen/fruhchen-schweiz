'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Workshop' | 'Webinar' | 'Treffen' | 'Conference';
  region: string;
  location: string;
  description: string;
  participants: number;
  maxParticipants: number;
  isOnline: boolean;
  published: boolean;
}

const typeColors: Record<string, string> = {
  Workshop: 'brand',
  Webinar: 'violet',
  Treffen: 'teal',
  Conference: 'rose',
};

const initialEvents: EventItem[] = [
  { id: '1', title: 'Eltern-Treff Bern', date: '2026-03-14', time: '10:00 - 12:00', type: 'Treffen', region: 'Bern', location: 'Familienzentrum Bern', description: 'Gemütliches Zusammenkommen für Frühchen-Eltern.', participants: 8, maxParticipants: 15, isOnline: false, published: true },
  { id: '2', title: 'Webinar: Stillen von Frühgeborenen', date: '2026-03-21', time: '19:00 - 20:30', type: 'Webinar', region: 'Online', location: 'Zoom', description: 'Praktische Tipps zum Thema Stillen bei Frühgeborenen.', participants: 24, maxParticipants: 50, isOnline: true, published: true },
  { id: '3', title: 'Känguru-Pflege Workshop', date: '2026-04-04', time: '14:00 - 16:30', type: 'Workshop', region: 'Aarau', location: 'Kantonsspital Aarau', description: 'Hands-on Workshop zur Känguru-Methode.', participants: 6, maxParticipants: 12, isOnline: false, published: true },
  { id: '4', title: 'Geschwister-Workshop', date: '2026-05-09', time: '10:00 - 12:00', type: 'Workshop', region: 'Zürich', location: 'Elternzentrum Zürich', description: 'Workshop für Geschwisterkinder.', participants: 12, maxParticipants: 20, isOnline: false, published: false },
  { id: '5', title: 'Weltfrühgeborenentag 2026', date: '2026-11-17', time: '10:00 - 18:00', type: 'Conference', region: 'National', location: 'Kursaal Bern', description: 'Nationaler Event zum Weltfrühgeborenentag.', participants: 120, maxParticipants: 500, isOnline: false, published: true },
];

const emptyEvent: Omit<EventItem, 'id'> = {
  title: '', date: '', time: '', type: 'Workshop', region: '', location: '', description: '', participants: 0, maxParticipants: 20, isOnline: false, published: false,
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Omit<EventItem, 'id'>>(emptyEvent);

  const handleAdd = () => {
    if (!formData.title.trim()) return;
    setEvents((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    setShowAddModal(false);
    setFormData(emptyEvent);
    toast.success('Event erstellt!');
  };

  const togglePublish = (id: string) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, published: !e.published } : e));
    setSelectedEvent((prev) => prev ? { ...prev, published: !prev.published } : null);
    toast.success('Status aktualisiert');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedEvent(null);
    toast.success('Event gelöscht');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events verwalten"
        subtitle="Events erstellen, bearbeiten und veröffentlichen"
        action={<Button icon="Plus" size="sm" onClick={() => setShowAddModal(true)}>Neuer Event</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, icon: 'Calendar', color: 'brand' },
          { label: 'Veröffentlicht', value: events.filter((e) => e.published).length, icon: 'Eye', color: 'green' },
          { label: 'Entwürfe', value: events.filter((e) => !e.published).length, icon: 'EyeOff', color: 'yellow' },
          { label: 'Anmeldungen', value: events.reduce((s, e) => s + e.participants, 0), icon: 'Users', color: 'violet' },
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

      <div className="space-y-3">
        {events.map((event, i) => (
          <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
            <Card interactive className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedEvent(event)}>
              <div className={`w-12 h-12 rounded-xl bg-${typeColors[event.type]}-50 flex items-center justify-center flex-shrink-0`}>
                <Icon name="Calendar" size={20} className={`text-${typeColors[event.type]}-500`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h3>
                  <Badge variant={typeColors[event.type] as any}>{event.type}</Badge>
                  {!event.published && <Badge variant="yellow">Entwurf</Badge>}
                </div>
                <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString('de-CH')} · {event.time} · {event.location}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium text-gray-900">{event.participants}/{event.maxParticipants}</p>
                <p className="text-xs text-gray-400">Plätze</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title || ''} size="lg">
        {selectedEvent && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={typeColors[selectedEvent.type] as any}>{selectedEvent.type}</Badge>
              {selectedEvent.published ? <Badge variant="green">Veröffentlicht</Badge> : <Badge variant="yellow">Entwurf</Badge>}
              {selectedEvent.isOnline && <Badge variant="blue">Online</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</p><p className="text-sm text-gray-900">{new Date(selectedEvent.date).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Zeit</p><p className="text-sm text-gray-900">{selectedEvent.time}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Ort</p><p className="text-sm text-gray-900">{selectedEvent.location}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Region</p><p className="text-sm text-gray-900">{selectedEvent.region}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Anmeldungen</p><p className="text-sm text-gray-900">{selectedEvent.participants}/{selectedEvent.maxParticipants} Plätze</p></div>
            </div>
            <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Beschreibung</p><p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{selectedEvent.description}</p></div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button variant={selectedEvent.published ? 'secondary' : 'primary'} size="sm" icon={selectedEvent.published ? 'EyeOff' : 'Eye'} onClick={() => togglePublish(selectedEvent.id)}>
                {selectedEvent.published ? 'Entwurf' : 'Veröffentlichen'}
              </Button>
              <Button variant="danger" size="sm" icon="Trash2" onClick={() => deleteEvent(selectedEvent.id)}>Löschen</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setFormData(emptyEvent); }} title="Neuer Event" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Titel" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder="Event-Titel" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Typ</label>
              <select title="Event-Typ" value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as any }))} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="Workshop">Workshop</option>
                <option value="Webinar">Webinar</option>
                <option value="Treffen">Treffen</option>
                <option value="Conference">Conference</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Datum" type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} />
            <Input label="Zeit" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} placeholder="z.B. 10:00 - 12:00" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ort" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} placeholder="Veranstaltungsort" />
            <Input label="Region" value={formData.region} onChange={(e) => setFormData((p) => ({ ...p, region: e.target.value }))} placeholder="z.B. Bern, Online" />
          </div>
          <Input label="Max. Teilnehmer" type="number" value={formData.maxParticipants.toString()} onChange={(e) => setFormData((p) => ({ ...p, maxParticipants: parseInt(e.target.value) || 0 }))} />
          <Textarea label="Beschreibung" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} placeholder="Eventbeschreibung..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowAddModal(false); setFormData(emptyEvent); }}>Abbrechen</Button>
            <Button icon="Plus" onClick={handleAdd} disabled={!formData.title.trim()}>Event erstellen</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
