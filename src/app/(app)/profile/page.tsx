'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { PageHeader } from '@/components/layout/page-header';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-provider';
import { ROLE_LABELS } from '@/lib/constants';

const SETTINGS_SECTIONS = [
  {
    title: 'Benachrichtigungen',
    items: [
      { label: 'Termin-Erinnerungen', description: 'Erinnerung vor Terminen', enabled: true },
      { label: 'Peer-Nachrichten', description: 'Neue Nachrichten von Peer-Eltern', enabled: true },
      { label: 'Events in deiner Nähe', description: 'Benachrichtigung bei neuen Events', enabled: false },
      { label: 'Tipps & Artikel', description: 'Neue Inhalte basierend auf Linas Alter', enabled: true },
    ],
  },
  {
    title: 'Privatsphäre',
    items: [
      { label: 'Profil sichtbar für Peers', description: 'Peer-Eltern können dein Profil sehen', enabled: true },
      { label: 'Anonyme Nutzung', description: 'Keine Tracking-Daten erheben', enabled: false },
    ],
  },
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const { profile, user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profil" subtitle="Dein Profil und Einstellungen" />

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="text-center space-y-4 p-8">
          <Avatar name={profile?.full_name ?? ''} size="xl" className="mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{profile?.full_name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="brand">{profile?.role ? ROLE_LABELS[profile.role] : ''}</Badge>
              {profile?.region && <Badge variant="violet">{profile.region}</Badge>}
              <Badge variant="teal">{profile?.language === 'fr' ? 'Français' : profile?.language === 'it' ? 'Italiano' : 'Deutsch'}</Badge>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon="Pencil" onClick={() => setEditing(!editing)}>
            Profil bearbeiten
          </Button>
        </Card>
      </motion.div>

      {/* Edit form */}
      {editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card className="space-y-4">
            <h3 className="font-semibold text-gray-900">Profil bearbeiten</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Vorname" defaultValue="Sarah" />
              <Input label="Nachname" defaultValue="Müller" />
              <Input label="E-Mail" defaultValue="sarah.mueller@example.com" type="email" />
              <Input label="Spital" defaultValue="Inselspital Bern" />
              <Input label="Baby-Name" defaultValue="Lina" />
              <Input label="Geburtsdatum" defaultValue="2025-12-28" type="date" />
              <Input label="Gestationswochen (SSW)" defaultValue="29" type="number" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Sprache</label>
                <select
                  defaultValue={profile?.language || 'de'}
                  title="Sprache auswählen"
                  className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-200 text-gray-900 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 hover:border-gray-300"
                >
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="it">Italiano</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => { setEditing(false); toast.success('Profil gespeichert!'); }}>
                Speichern
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Abbrechen
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Baby info */}
      {profile?.baby_name && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
              <Icon name="Baby" size={24} className="text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{profile.baby_name}</h3>
              {profile.baby_birth_date && (
                <p className="text-sm text-gray-500">
                  Geboren am {new Date(profile.baby_birth_date).toLocaleDateString('de-CH')}
                  {profile.gestational_weeks ? ` (${profile.gestational_weeks} SSW)` : ''}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Settings */}
      {SETTINGS_SECTIONS.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + 0.05 * i }}
        >
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <button
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      item.enabled ? 'bg-brand-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        item.enabled ? 'translate-x-5.5 left-auto right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Account actions */}
      <Card className="space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
          <Icon name="HelpCircle" size={18} className="text-gray-400" />
          <span className="text-sm text-gray-700">Hilfe & Support</span>
          <Icon name="ChevronRight" size={16} className="text-gray-300 ml-auto" />
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
          <Icon name="Shield" size={18} className="text-gray-400" />
          <span className="text-sm text-gray-700">Datenschutz</span>
          <Icon name="ChevronRight" size={16} className="text-gray-300 ml-auto" />
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
          <Icon name="Download" size={18} className="text-gray-400" />
          <span className="text-sm text-gray-700">Meine Daten exportieren</span>
          <Icon name="ChevronRight" size={16} className="text-gray-300 ml-auto" />
        </button>
        <div className="border-t border-gray-100 pt-2 mt-2">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left">
            <Icon name="LogOut" size={18} className="text-red-400" />
            <span className="text-sm text-red-500">Abmelden</span>
          </button>
        </div>
      </Card>

      {/* App info */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Frühchen Schweiz v1.0.0</p>
        <p>Made with love in Switzerland</p>
      </div>
    </div>
  );
}
