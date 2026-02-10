'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SearchInput } from '@/components/ui/search-input';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'article' | 'webinar';
  category: string;
  description: string;
  duration: string;
  date: string;
  published: boolean;
}

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  video: { icon: 'Play', color: 'brand', label: 'Video' },
  podcast: { icon: 'Headphones', color: 'violet', label: 'Podcast' },
  article: { icon: 'FileText', color: 'teal', label: 'Artikel' },
  webinar: { icon: 'Video', color: 'rose', label: 'Webinar' },
};

const initialMedia: MediaItem[] = [
  { id: '1', title: 'Was ist CPAP? Einfach erklärt', type: 'video', category: 'Medizin', description: 'Kurzes Erklärvideo über die CPAP-Atemhilfe für Eltern auf der Neonatologie.', duration: '4:30', date: '2026-02-01', published: true },
  { id: '2', title: 'Podcast: Frühchen-Eltern erzählen', type: 'podcast', category: 'Erfahrungen', description: 'Drei Familien erzählen ihre Geschichte — von der Geburt bis nach Hause.', duration: '28:00', date: '2026-01-20', published: true },
  { id: '3', title: 'Känguru-Pflege: Schritt für Schritt', type: 'video', category: 'Pflege', description: 'Anleitung zur Känguru-Pflege mit einer Neonatologie-Pflegefachfrau.', duration: '8:15', date: '2026-01-15', published: true },
  { id: '4', title: 'Webinar: Stillen nach der Neo', type: 'webinar', category: 'Ernährung', description: 'Aufzeichnung des Webinars vom 12. Januar 2026 mit Stillberaterin Maria Bürgi.', duration: '45:00', date: '2026-01-12', published: true },
  { id: '5', title: 'Korrigiertes Alter berechnen', type: 'article', category: 'Entwicklung', description: 'Was bedeutet das korrigierte Alter und warum ist es wichtig für die Entwicklung?', duration: '5 Min. Lesezeit', date: '2026-01-08', published: false },
  { id: '6', title: 'Podcast: Väter auf der Neo', type: 'podcast', category: 'Erfahrungen', description: 'Wie erleben Väter die Neozeit? Drei Papas sprechen offen über ihre Gefühle.', duration: '32:00', date: '2026-01-05', published: true },
];

const emptyMedia: Omit<MediaItem, 'id'> = { title: '', type: 'video', category: '', description: '', duration: '', date: '', published: false };

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Omit<MediaItem, 'id'>>(emptyMedia);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = media.filter((m) => {
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || m.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleAdd = () => {
    if (!formData.title.trim()) return;
    setMedia((prev) => [...prev, { ...formData, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] }]);
    setShowAddModal(false);
    setFormData(emptyMedia);
    toast.success('Medium erstellt!');
  };

  const togglePublish = (id: string) => {
    setMedia((prev) => prev.map((m) => m.id === id ? { ...m, published: !m.published } : m));
    setSelectedMedia((prev) => prev ? { ...prev, published: !prev.published } : null);
  };

  const deleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    setSelectedMedia(null);
    toast.success('Medium gelöscht');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medien verwalten"
        subtitle="Videos, Podcasts, Artikel und Webinare"
        action={<Button icon="Plus" size="sm" onClick={() => setShowAddModal(true)}>Neues Medium</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(typeConfig).map(([key, conf], i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-${conf.color}-50 flex items-center justify-center`}>
                  <Icon name={conf.icon as any} size={16} className={`text-${conf.color}-500`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{media.filter((m) => m.type === key).length}</p>
                  <p className="text-xs text-gray-500">{conf.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Medien suchen..." className="flex-1" />
        <div className="flex gap-2">
          {['all', 'video', 'podcast', 'article', 'webinar'].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${typeFilter === t ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {t === 'all' ? 'Alle' : typeConfig[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item, i) => {
          const conf = typeConfig[item.type];
          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
              <Card interactive className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedMedia(item)}>
                <div className={`w-10 h-10 rounded-xl bg-${conf.color}-50 flex items-center justify-center flex-shrink-0`}>
                  <Icon name={conf.icon as any} size={18} className={`text-${conf.color}-500`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{item.title}</h3>
                    <Badge variant={conf.color as any}>{conf.label}</Badge>
                    {!item.published && <Badge variant="yellow">Entwurf</Badge>}
                  </div>
                  <p className="text-xs text-gray-400">{item.category} · {item.duration} · {new Date(item.date).toLocaleDateString('de-CH')}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Modal open={!!selectedMedia} onClose={() => setSelectedMedia(null)} title={selectedMedia?.title || ''} size="md">
        {selectedMedia && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Badge variant={typeConfig[selectedMedia.type].color as any}>{typeConfig[selectedMedia.type].label}</Badge>
              {selectedMedia.published ? <Badge variant="green">Veröffentlicht</Badge> : <Badge variant="yellow">Entwurf</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Kategorie</p><p className="text-sm text-gray-900">{selectedMedia.category}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Dauer</p><p className="text-sm text-gray-900">{selectedMedia.duration}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Datum</p><p className="text-sm text-gray-900">{new Date(selectedMedia.date).toLocaleDateString('de-CH')}</p></div>
            </div>
            <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Beschreibung</p><p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{selectedMedia.description}</p></div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button variant={selectedMedia.published ? 'secondary' : 'primary'} size="sm" icon={selectedMedia.published ? 'EyeOff' : 'Eye'} onClick={() => togglePublish(selectedMedia.id)}>
                {selectedMedia.published ? 'Entwurf' : 'Veröffentlichen'}
              </Button>
              <Button variant="danger" size="sm" icon="Trash2" onClick={() => deleteMedia(selectedMedia.id)}>Löschen</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setFormData(emptyMedia); }} title="Neues Medium" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Titel" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder="Titel" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Typ</label>
              <select title="Medientyp" value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as any }))} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                {Object.entries(typeConfig).map(([key, conf]) => <option key={key} value={key}>{conf.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Kategorie" value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} placeholder="z.B. Pflege, Ernährung" />
            <Input label="Dauer" value={formData.duration} onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))} placeholder="z.B. 4:30, 5 Min. Lesezeit" />
          </div>
          <Textarea label="Beschreibung" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} placeholder="Beschreibung..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowAddModal(false); setFormData(emptyMedia); }}>Abbrechen</Button>
            <Button icon="Plus" onClick={handleAdd} disabled={!formData.title.trim()}>Erstellen</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
