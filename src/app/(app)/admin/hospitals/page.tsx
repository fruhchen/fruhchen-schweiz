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

interface Hospital {
  id: string;
  name: string;
  city: string;
  canton: string;
  level: 'Level I' | 'Level II' | 'Level III';
  neoCapacity: number;
  phone: string;
  website: string;
  notes: string;
  active: boolean;
}

const levelColors: Record<string, string> = { 'Level I': 'green', 'Level II': 'blue', 'Level III': 'brand' };

const initialHospitals: Hospital[] = [
  { id: '1', name: 'Inselspital Bern', city: 'Bern', canton: 'BE', level: 'Level III', neoCapacity: 24, phone: '+41 31 632 21 11', website: 'insel.ch', notes: 'Universitätsspital mit grosser Neonatologie. Referenzzentrum für extreme Frühgeburten.', active: true },
  { id: '2', name: 'Universitätsspital Zürich (USZ)', city: 'Zürich', canton: 'ZH', level: 'Level III', neoCapacity: 28, phone: '+41 44 255 11 11', website: 'usz.ch', notes: 'Grösstes Perinatalzentrum der Schweiz.', active: true },
  { id: '3', name: 'Kantonsspital Aarau', city: 'Aarau', canton: 'AG', level: 'Level II', neoCapacity: 12, phone: '+41 62 838 41 41', website: 'ksa.ch', notes: 'Neonatologie für Frühgeborene ab 32 SSW.', active: true },
  { id: '4', name: 'Ostschweizer Kinderspital', city: 'St. Gallen', canton: 'SG', level: 'Level III', neoCapacity: 18, phone: '+41 71 243 71 11', website: 'kispisg.ch', notes: 'Spezialisiert auf Kinder- und Neugeborenen-Medizin.', active: true },
  { id: '5', name: 'Universitäts-Kinderspital (UKBB)', city: 'Basel', canton: 'BS', level: 'Level III', neoCapacity: 20, phone: '+41 61 704 12 12', website: 'ukbb.ch', notes: 'Neonatologie und Kinderintensivstation.', active: true },
  { id: '6', name: 'CHUV Lausanne', city: 'Lausanne', canton: 'VD', level: 'Level III', neoCapacity: 22, phone: '+41 21 314 11 11', website: 'chuv.ch', notes: 'Centre hospitalier universitaire vaudois. Neonatologie francophone.', active: true },
];

const emptyHospital: Omit<Hospital, 'id'> = { name: '', city: '', canton: '', level: 'Level II', neoCapacity: 0, phone: '', website: '', notes: '', active: true };

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Hospital, 'id'>>(emptyHospital);
  const [search, setSearch] = useState('');

  const filtered = hospitals.filter((h) => !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    setHospitals((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    setShowAddModal(false);
    setFormData(emptyHospital);
    toast.success('Spital hinzugefügt!');
  };

  const deleteHospital = (id: string) => {
    setHospitals((prev) => prev.filter((h) => h.id !== id));
    setSelectedHospital(null);
    toast.success('Spital entfernt');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spitäler verwalten"
        subtitle="Neonatologie-Stationen und Kontakte"
        action={<Button icon="Plus" size="sm" onClick={() => setShowAddModal(true)}>Neues Spital</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Spitäler', value: hospitals.length, icon: 'Building2', color: 'brand' },
          { label: 'Level III', value: hospitals.filter((h) => h.level === 'Level III').length, icon: 'Shield', color: 'violet' },
          { label: 'Level II', value: hospitals.filter((h) => h.level === 'Level II').length, icon: 'Shield', color: 'blue' },
          { label: 'Neo-Plätze', value: hospitals.reduce((s, h) => s + h.neoCapacity, 0), icon: 'Baby', color: 'rose' },
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

      <SearchInput value={search} onChange={setSearch} placeholder="Spital suchen..." />

      <div className="space-y-3">
        {filtered.map((hospital, i) => (
          <motion.div key={hospital.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
            <Card interactive className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedHospital(hospital)}>
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Icon name="Building2" size={18} className="text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{hospital.name}</h3>
                  <Badge variant={levelColors[hospital.level] as any}>{hospital.level}</Badge>
                </div>
                <p className="text-xs text-gray-400">{hospital.city}, {hospital.canton} · {hospital.neoCapacity} Neo-Plätze</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={!!selectedHospital} onClose={() => setSelectedHospital(null)} title={selectedHospital?.name || ''} size="lg">
        {selectedHospital && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Badge variant={levelColors[selectedHospital.level] as any}>{selectedHospital.level}</Badge>
              <span className="text-sm text-gray-500">{selectedHospital.city}, {selectedHospital.canton}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Neo-Kapazität</p><p className="text-2xl font-bold text-gray-900">{selectedHospital.neoCapacity} Plätze</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Telefon</p><p className="text-sm text-gray-900">{selectedHospital.phone}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Website</p><p className="text-sm text-brand-600">{selectedHospital.website}</p></div>
            </div>
            <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notizen</p><p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{selectedHospital.notes}</p></div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button variant="secondary" size="sm" icon="Pencil">Bearbeiten</Button>
              <Button variant="danger" size="sm" icon="Trash2" onClick={() => deleteHospital(selectedHospital.id)}>Entfernen</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setFormData(emptyHospital); }} title="Neues Spital" size="lg">
        <div className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="Spitalname" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Stadt" value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} placeholder="Stadt" />
            <Input label="Kanton" value={formData.canton} onChange={(e) => setFormData((p) => ({ ...p, canton: e.target.value }))} placeholder="z.B. BE, ZH" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select title="Spital-Level" value={formData.level} onChange={(e) => setFormData((p) => ({ ...p, level: e.target.value as any }))} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="Level I">Level I</option>
                <option value="Level II">Level II</option>
                <option value="Level III">Level III</option>
              </select>
            </div>
            <Input label="Neo-Kapazität" type="number" value={formData.neoCapacity.toString()} onChange={(e) => setFormData((p) => ({ ...p, neoCapacity: parseInt(e.target.value) || 0 }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Telefon" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} placeholder="+41..." />
            <Input label="Website" value={formData.website} onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))} placeholder="www..." />
          </div>
          <Textarea label="Notizen" value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} placeholder="Zusätzliche Informationen..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowAddModal(false); setFormData(emptyHospital); }}>Abbrechen</Button>
            <Button icon="Plus" onClick={handleAdd} disabled={!formData.name.trim()}>Hinzufügen</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
