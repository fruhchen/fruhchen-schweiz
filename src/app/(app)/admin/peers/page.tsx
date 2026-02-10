'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { SearchInput } from '@/components/ui/search-input';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';

interface PeerProfile {
  id: string;
  name: string;
  region: string;
  role: 'Peer' | 'Senior Peer' | 'Trainer';
  active: boolean;
  topics: string[];
  bio: string;
  sessionsTotal: number;
  joinedDate: string;
}

const roleColors: Record<string, string> = { Peer: 'violet', 'Senior Peer': 'brand', Trainer: 'teal' };

const initialPeers: PeerProfile[] = [
  { id: '1', name: 'Maria Keller', region: 'Bern', role: 'Senior Peer', active: true, topics: ['Frühgeburt < 28 SSW', 'Zwillinge'], bio: 'Mama von Zwillingen, geboren in der 26. SSW. Seit 3 Jahren als Peer-Mutter aktiv.', sessionsTotal: 156, joinedDate: '2023-03-15' },
  { id: '2', name: 'Thomas Brunner', region: 'Aarau', role: 'Peer', active: true, topics: ['CPAP/Beatmung', 'Väter'], bio: 'Papa von Leo, geboren in der 30. SSW.', sessionsTotal: 89, joinedDate: '2024-01-10' },
  { id: '3', name: 'Anna Schmid', region: 'St. Gallen', role: 'Peer', active: false, topics: ['Stillen', 'Nachsorge'], bio: 'Stillberaterin und Peer-Mutter.', sessionsTotal: 42, joinedDate: '2024-06-20' },
  { id: '4', name: 'Claudia Weber', region: 'Zürich', role: 'Trainer', active: true, topics: ['Pränatal', 'Verarbeitung'], bio: 'Psychologin und Peer-Mutter.', sessionsTotal: 210, joinedDate: '2022-09-01' },
  { id: '5', name: 'Peter Meier', region: 'Bern', role: 'Peer', active: false, topics: ['Nachsorge'], bio: 'Papa von Lina, in Ausbildung.', sessionsTotal: 12, joinedDate: '2025-08-15' },
  { id: '6', name: 'Laura Roth', region: 'Basel', role: 'Peer', active: true, topics: ['Ernährung', 'Stillen'], bio: 'Mama von zwei Frühchen aus Basel.', sessionsTotal: 67, joinedDate: '2024-04-01' },
];

const emptyPeer: Omit<PeerProfile, 'id'> = { name: '', region: '', role: 'Peer', active: true, topics: [], bio: '', sessionsTotal: 0, joinedDate: '' };

export default function AdminPeersPage() {
  const [peers, setPeers] = useState<PeerProfile[]>(initialPeers);
  const [selectedPeer, setSelectedPeer] = useState<PeerProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Omit<PeerProfile, 'id'>>(emptyPeer);
  const [topicsInput, setTopicsInput] = useState('');
  const [search, setSearch] = useState('');

  const filtered = peers.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  const activeCount = peers.filter((p) => p.active).length;

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    const topics = topicsInput.split(',').map((t) => t.trim()).filter(Boolean);
    setPeers((prev) => [...prev, { ...formData, topics, id: Date.now().toString(), joinedDate: new Date().toISOString().split('T')[0] }]);
    setShowAddModal(false);
    setFormData(emptyPeer);
    setTopicsInput('');
    toast.success('Peer hinzugefügt!');
  };

  const toggleActive = (id: string) => {
    setPeers((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
    setSelectedPeer((prev) => prev ? { ...prev, active: !prev.active } : null);
  };

  const deletePeer = (id: string) => {
    setPeers((prev) => prev.filter((p) => p.id !== id));
    setSelectedPeer(null);
    toast.success('Peer entfernt');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Peers verwalten"
        subtitle="Peer-Eltern und Trainer verwalten"
        action={<Button icon="UserPlus" size="sm" onClick={() => setShowAddModal(true)}>Neue*r Peer</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Peers', value: peers.length, icon: 'Users', color: 'brand' },
          { label: 'Aktiv', value: activeCount, icon: 'UserCheck', color: 'green' },
          { label: 'Inaktiv', value: peers.length - activeCount, icon: 'UserX', color: 'gray' },
          { label: 'Sessions gesamt', value: peers.reduce((s, p) => s + p.sessionsTotal, 0), icon: 'MessageCircle', color: 'violet' },
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

      <SearchInput value={search} onChange={setSearch} placeholder="Peers suchen..." />

      <div className="space-y-3">
        {filtered.map((peer, i) => (
          <motion.div key={peer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
            <Card interactive className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedPeer(peer)}>
              <Avatar name={peer.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{peer.name}</h3>
                  <Badge variant={roleColors[peer.role] as any}>{peer.role}</Badge>
                  {!peer.active && <Badge variant="gray">Inaktiv</Badge>}
                </div>
                <p className="text-xs text-gray-400">{peer.region} · {peer.sessionsTotal} Sessions · {peer.topics.join(', ')}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={!!selectedPeer} onClose={() => setSelectedPeer(null)} title={selectedPeer?.name || ''} size="lg">
        {selectedPeer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={selectedPeer.name} size="lg" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={roleColors[selectedPeer.role] as any}>{selectedPeer.role}</Badge>
                  {selectedPeer.active ? <Badge variant="green">Aktiv</Badge> : <Badge variant="gray">Inaktiv</Badge>}
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Icon name="MapPin" size={14} />{selectedPeer.region}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Sessions gesamt</p><p className="text-2xl font-bold text-gray-900">{selectedPeer.sessionsTotal}</p></div>
              <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Dabei seit</p><p className="text-sm text-gray-900">{new Date(selectedPeer.joinedDate).toLocaleDateString('de-CH', { month: 'long', year: 'numeric' })}</p></div>
            </div>
            <div className="space-y-1"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bio</p><p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{selectedPeer.bio}</p></div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Themen</p>
              <div className="flex flex-wrap gap-2">{selectedPeer.topics.map((t) => <Badge key={t} variant="violet">{t}</Badge>)}</div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button variant={selectedPeer.active ? 'secondary' : 'primary'} size="sm" icon={selectedPeer.active ? 'UserX' : 'UserCheck'} onClick={() => toggleActive(selectedPeer.id)}>
                {selectedPeer.active ? 'Deaktivieren' : 'Aktivieren'}
              </Button>
              <Button variant="secondary" size="sm" icon="Pencil">Bearbeiten</Button>
              <Button variant="danger" size="sm" icon="Trash2" onClick={() => deletePeer(selectedPeer.id)}>Entfernen</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setFormData(emptyPeer); setTopicsInput(''); }} title="Neue*r Peer" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="Vor- und Nachname" />
            <Input label="Region" value={formData.region} onChange={(e) => setFormData((p) => ({ ...p, region: e.target.value }))} placeholder="z.B. Bern, Zürich" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Rolle</label>
            <select title="Rolle" value={formData.role} onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value as any }))} className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
              <option value="Peer">Peer</option>
              <option value="Senior Peer">Senior Peer</option>
              <option value="Trainer">Trainer</option>
            </select>
          </div>
          <Input label="Themen (kommasepariert)" value={topicsInput} onChange={(e) => setTopicsInput(e.target.value)} placeholder="z.B. Stillen, Nachsorge, Väter" />
          <Textarea label="Bio" value={formData.bio} onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))} placeholder="Kurze Biografie..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowAddModal(false); setFormData(emptyPeer); setTopicsInput(''); }}>Abbrechen</Button>
            <Button icon="UserPlus" onClick={handleAdd} disabled={!formData.name.trim()}>Hinzufügen</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
