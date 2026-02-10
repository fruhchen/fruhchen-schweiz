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

interface GlossaryItem {
  id: string;
  term: string;
  subtitle: string;
  category: string;
  definition: string;
  simpleExplanation: string;
}

const categoryColors: Record<string, string> = {
  Atmung: 'brand',
  Ernährung: 'teal',
  Entwicklung: 'violet',
  Diagnostik: 'blue',
  Pflege: 'rose',
  Medikamente: 'green',
};

const initialTerms: GlossaryItem[] = [
  { id: '1', term: 'CPAP', subtitle: 'Continuous Positive Airway Pressure', category: 'Atmung', definition: 'Nicht-invasive Atemunterstützung mit kontinuierlichem positivem Druck.', simpleExplanation: 'Eine sanfte Atemhilfe über eine kleine Maske.' },
  { id: '2', term: 'Apnoe', subtitle: 'Atemaussetzer', category: 'Atmung', definition: 'Vorübergehender Atemstillstand von mehr als 20 Sekunden.', simpleExplanation: 'Manchmal vergisst Ihr Baby kurz zu atmen — das ist bei Frühchen normal.' },
  { id: '3', term: 'Inkubator', subtitle: 'Brutkasten', category: 'Pflege', definition: 'Geschlossenes Wärmebett mit regulierbarer Temperatur.', simpleExplanation: 'Ein warmes, geschütztes Bettchen für Ihr Baby.' },
  { id: '4', term: 'Känguru-Pflege', subtitle: 'Kangaroo Care', category: 'Pflege', definition: 'Haut-zu-Haut-Kontakt zwischen Elternteil und Frühgeborenem.', simpleExplanation: 'Ihr Baby liegt direkt auf Ihrer nackten Brust.' },
  { id: '5', term: 'Surfactant', subtitle: '', category: 'Medikamente', definition: 'Oberflächenaktive Substanz für die Lungenbläschen.', simpleExplanation: 'Eine Art Seife für die Lunge, damit die Bläschen nicht zusammenkleben.' },
  { id: '6', term: 'Bilirubin', subtitle: 'Gelbsucht-Wert', category: 'Diagnostik', definition: 'Abbauprodukt des roten Blutfarbstoffs.', simpleExplanation: 'Ein gelber Farbstoff im Blut, der bei Babys erhöht sein kann.' },
  { id: '7', term: 'Korrigiertes Alter', subtitle: '', category: 'Entwicklung', definition: 'Alter berechnet ab dem errechneten Geburtstermin.', simpleExplanation: 'Das Alter, als ob Ihr Baby zum Termin geboren worden wäre.' },
  { id: '8', term: 'Sonde', subtitle: 'Magensonde', category: 'Ernährung', definition: 'Dünner Schlauch zur Nahrungszufuhr.', simpleExplanation: 'Ein winzig dünner Schlauch, über den Ihr Baby Milch bekommt.' },
];

const emptyTerm: Omit<GlossaryItem, 'id'> = { term: '', subtitle: '', category: 'Atmung', definition: '', simpleExplanation: '' };

export default function AdminGlossaryPage() {
  const [terms, setTerms] = useState<GlossaryItem[]>(initialTerms);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Omit<GlossaryItem, 'id'>>(emptyTerm);
  const [search, setSearch] = useState('');

  const filtered = terms.filter((t) => !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!formData.term.trim()) return;
    setTerms((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    setShowAddModal(false);
    setFormData(emptyTerm);
    toast.success('Begriff hinzugefügt!');
  };

  const deleteTerm = (id: string) => {
    setTerms((prev) => prev.filter((t) => t.id !== id));
    setSelectedTerm(null);
    toast.success('Begriff gelöscht');
  };

  const categories = Array.from(new Set(terms.map((t) => t.category)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Glossar verwalten"
        subtitle="Medizinische Fachbegriffe pflegen"
        action={<Button icon="Plus" size="sm" onClick={() => setShowAddModal(true)}>Neuer Begriff</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-${categoryColors[cat] || 'gray'}-50 flex items-center justify-center`}>
                  <Icon name="BookOpen" size={16} className={`text-${categoryColors[cat] || 'gray'}-500`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{terms.filter((t) => t.category === cat).length}</p>
                  <p className="text-xs text-gray-500">{cat}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Begriffe suchen..." />

      <div className="space-y-2">
        {filtered.map((term, i) => (
          <motion.div key={term.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * i }}>
            <Card interactive className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedTerm(term)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{term.term}</h3>
                  <Badge variant={categoryColors[term.category] as any || 'gray'}>{term.category}</Badge>
                </div>
                <p className="text-xs text-gray-400 truncate">{term.subtitle || term.definition}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-gray-300" />
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={!!selectedTerm} onClose={() => setSelectedTerm(null)} title={selectedTerm?.term || ''} size="md">
        {selectedTerm && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={categoryColors[selectedTerm.category] as any || 'gray'}>{selectedTerm.category}</Badge>
              {selectedTerm.subtitle && <span className="text-sm text-gray-400">{selectedTerm.subtitle}</span>}
            </div>
            <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Definition</p><p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{selectedTerm.definition}</p></div>
            <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Einfach erklärt</p><p className="text-sm text-gray-700 bg-warm-50 rounded-xl p-4">{selectedTerm.simpleExplanation}</p></div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button variant="secondary" size="sm" icon="Pencil">Bearbeiten</Button>
              <Button variant="danger" size="sm" icon="Trash2" onClick={() => deleteTerm(selectedTerm.id)}>Löschen</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setFormData(emptyTerm); }} title="Neuer Begriff" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Begriff" value={formData.term} onChange={(e) => setFormData((p) => ({ ...p, term: e.target.value }))} placeholder="z.B. CPAP" />
            <Input label="Untertitel" value={formData.subtitle} onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))} placeholder="z.B. Continuous Positive Airway Pressure" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Kategorie</label>
            <select title="Kategorie" value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
              {Object.keys(categoryColors).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Textarea label="Definition" value={formData.definition} onChange={(e) => setFormData((p) => ({ ...p, definition: e.target.value }))} placeholder="Medizinische Definition..." />
          <Textarea label="Einfach erklärt" value={formData.simpleExplanation} onChange={(e) => setFormData((p) => ({ ...p, simpleExplanation: e.target.value }))} placeholder="Erklärung in einfacher Sprache..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowAddModal(false); setFormData(emptyTerm); }}>Abbrechen</Button>
            <Button icon="Plus" onClick={handleAdd} disabled={!formData.term.trim()}>Hinzufügen</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
