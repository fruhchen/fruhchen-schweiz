'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { PageHeader } from '@/components/layout/page-header';

const PEERS = [
  {
    id: '1',
    name: 'Maria Keller',
    region: 'Bern',
    topics: ['Frühgeburt < 28 SSW', 'Zwillinge'],
    available: true,
    avatar: null,
    bio: 'Mama von Zwillingen, geboren in der 26. SSW. Seit 3 Jahren als Peer-Mutter aktiv.',
  },
  {
    id: '2',
    name: 'Thomas Brunner',
    region: 'Aarau',
    topics: ['CPAP/Beatmung', 'Väter'],
    available: true,
    avatar: null,
    bio: 'Papa von Leo, geboren in der 30. SSW. Ich unterstütze besonders Väter in der Neozeit.',
  },
  {
    id: '3',
    name: 'Anna Schmid',
    region: 'St. Gallen',
    topics: ['Stillen', 'Nachsorge'],
    available: false,
    avatar: null,
    bio: 'Stillberaterin und Peer-Mutter. Meine Tochter kam in der 32. SSW zur Welt.',
  },
  {
    id: '4',
    name: 'Claudia Weber',
    region: 'Zürich',
    topics: ['Pränatal', 'Verarbeitung'],
    available: true,
    avatar: null,
    bio: 'Psychologin und Peer-Mutter. Ich begleite Familien vor und nach der Geburt.',
  },
];

const ACTIVE_CHATS = [
  {
    id: '1',
    peerName: 'Maria Keller',
    lastMessage: 'Das klingt wunderbar! Die Känguru-Pflege ist so wertvoll.',
    time: 'vor 2 Std.',
    unread: 1,
  },
];

const TOPICS = ['Alle', 'Frühgeburt', 'Stillen', 'Väter', 'Zwillinge', 'Nachsorge', 'Pränatal'];

export default function PeerPage() {
  const [selectedTopic, setSelectedTopic] = useState('Alle');

  const filteredPeers =
    selectedTopic === 'Alle'
      ? PEERS
      : PEERS.filter((p) => p.topics.some((t) => t.toLowerCase().includes(selectedTopic.toLowerCase())));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Peer Support"
        subtitle="Du bist nicht allein — erfahrene Eltern sind für dich da"
      />

      {/* Availability banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <div className="relative">
                <Icon name="Users" size={24} className="text-emerald-600" />
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-50 animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-emerald-900">Jemand ist für dich da</p>
              <p className="text-sm text-emerald-700">3 Peer-Eltern sind gerade erreichbar</p>
            </div>
            <Button variant="primary" size="sm" icon="MessageCircle">
              Chat starten
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Active chats */}
      {ACTIVE_CHATS.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Aktive Gespräche</h2>
          {ACTIVE_CHATS.map((chat) => (
            <Card key={chat.id} interactive className="flex items-center gap-4">
              <Avatar name={chat.peerName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{chat.peerName}</p>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-400">{chat.time}</span>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Topic filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedTopic === topic
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Peer cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Peer-Eltern finden</h2>
        {filteredPeers.map((peer, i) => (
          <motion.div
            key={peer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Card className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar name={peer.name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{peer.name}</h3>
                    {peer.available ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Online
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Offline</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Icon name="MapPin" size={12} />
                    {peer.region}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{peer.bio}</p>
              <div className="flex flex-wrap gap-2">
                {peer.topics.map((topic) => (
                  <Badge key={topic} variant="violet">{topic}</Badge>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="primary" size="sm" icon="MessageCircle" fullWidth disabled={!peer.available}>
                  Nachricht senden
                </Button>
                <Button variant="secondary" size="sm" icon="User">
                  Profil
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info card */}
      <Card className="bg-violet-50 border-violet-200/50">
        <div className="flex gap-3">
          <Icon name="Info" size={20} className="text-violet-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-violet-900">Über Peer Support</p>
            <p className="text-sm text-violet-700 mt-1">
              Unsere Peer-Eltern haben selbst ein Frühgeborenes oder Neokind. Sie sind ausgebildet
              und begleiten dich auf Augenhöhe — 24/7, kostenlos und vertraulich.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
