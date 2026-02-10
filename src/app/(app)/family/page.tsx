'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';

const PAST_UPDATES = [
  {
    id: '1',
    date: '2026-02-08',
    content: 'Lina hatte heute einen tollen Tag! Sie hat 20g zugenommen und wir haben lange Känguru gemacht. Die Ärzte sind sehr zufrieden mit ihrer Entwicklung.',
    sharedWith: ['Oma Karin', 'Opa Hans', 'Tante Julia'],
  },
  {
    id: '2',
    date: '2026-02-05',
    content: 'Heute hat Lina zum ersten Mal an der Brust getrunken! Es war nur kurz, aber ein riesiger Meilenstein. Wir sind so stolz auf unser kleines Kämpfermädchen.',
    sharedWith: ['Oma Karin', 'Opa Hans', 'Tante Julia', 'Onkel Marc'],
  },
];

const FAMILY_MEMBERS = [
  { name: 'Oma Karin', relation: 'Großmutter', active: true },
  { name: 'Opa Hans', relation: 'Großvater', active: true },
  { name: 'Tante Julia', relation: 'Tante', active: true },
  { name: 'Onkel Marc', relation: 'Onkel', active: false },
];

const QUICK_TEMPLATES = [
  'hatte einen guten Tag',
  'hat gut getrunken',
  'hat zugenommen',
  'schläft viel',
  'wir haben Känguru gemacht',
];

export default function FamilyPage() {
  const [updateText, setUpdateText] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    FAMILY_MEMBERS.filter((m) => m.active).map((m) => m.name)
  );
  const [selectedUpdate, setSelectedUpdate] = useState<(typeof PAST_UPDATES)[number] | null>(null);

  const toggleMember = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const sendUpdate = () => {
    if (!updateText.trim()) return;
    toast.success(`Update an ${selectedMembers.length} Familienmitglieder gesendet!`);
    setUpdateText('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Familie updaten"
        subtitle="Halte deine Liebsten auf dem Laufenden — mit einem Tipp"
      />

      {/* New update */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="space-y-4">
          <h2 className="font-semibold text-gray-900">Neues Update</h2>

          {/* Quick templates */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Schnellauswahl — Lina...</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((template) => (
                <button
                  key={template}
                  onClick={() => setUpdateText((prev) => (prev ? `${prev} ${template}` : `Lina ${template}`))}
                  className="px-3 py-1.5 text-xs bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Schreibe ein Update für deine Familie..."
            className="min-h-[100px]"
          />

          {/* Share with */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Teilen mit:</p>
            <div className="flex flex-wrap gap-2">
              {FAMILY_MEMBERS.map((member) => (
                <button
                  key={member.name}
                  onClick={() => toggleMember(member.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedMembers.includes(member.name)
                      ? 'bg-brand-100 text-brand-700 border border-brand-300'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {selectedMembers.includes(member.name) && <Icon name="Check" size={14} />}
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" fullWidth onClick={sendUpdate} disabled={!updateText.trim()} icon="Send">
              Update senden
            </Button>
            <Button variant="secondary" icon="FileText">
              PDF
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Family members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Familie</h2>
          <Button variant="ghost" size="sm" icon="UserPlus">Hinzufügen</Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FAMILY_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="text-center" padding="sm">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-violet-400 flex items-center justify-center text-white font-semibold mx-auto mb-2">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-gray-400">{member.relation}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Past updates */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Letzte Updates</h2>
        <div className="space-y-3">
          {PAST_UPDATES.map((update, i) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + 0.05 * i }}
            >
              <Card
                className="cursor-pointer"
                onClick={() => setSelectedUpdate(update)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {new Date(update.date).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <Badge variant="green">Gesendet</Badge>
                </div>
                <p className="text-sm text-gray-700">{update.content}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <Icon name="Users" size={12} />
                  <span>Geteilt mit {update.sharedWith.join(', ')}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Update detail modal */}
      <Modal
        open={!!selectedUpdate}
        onClose={() => setSelectedUpdate(null)}
        title="Update Details"
        size="md"
      >
        {selectedUpdate && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon name="Calendar" size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {new Date(selectedUpdate.date).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <Badge variant="green">Gesendet</Badge>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{selectedUpdate.content}</p>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">Geteilt mit</p>
              <div className="flex flex-wrap gap-2">
                {selectedUpdate.sharedWith.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-full"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-400 to-violet-400 flex items-center justify-center text-white text-[10px] font-semibold">
                      {name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs text-brand-700 font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
