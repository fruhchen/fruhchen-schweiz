'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    peerId: '1',
    peerName: 'Maria Keller',
    lastMessage: 'Das klingt wunderbar! Die Känguru-Pflege ist so wertvoll.',
    time: 'vor 2 Std.',
    unread: 1,
  },
];

const MOCK_CONVERSATION = [
  {
    id: 'c1',
    sender: 'Du',
    content: 'Hallo Maria, ich habe eine Frage zur Känguru-Pflege. Wie lange sollte ich mein Baby auf der Brust halten?',
    time: '14:20',
  },
  {
    id: 'c2',
    sender: 'Maria Keller',
    content: 'Hallo! Das ist eine tolle Frage. Am Anfang empfehle ich mindestens 60 Minuten am Stück. Je länger, desto besser für euer Baby. Meine Zwillinge haben es geliebt!',
    time: '14:25',
  },
  {
    id: 'c3',
    sender: 'Du',
    content: 'Wow, 60 Minuten! Und wie oft am Tag sollte man das machen?',
    time: '14:28',
  },
  {
    id: 'c4',
    sender: 'Maria Keller',
    content: 'So oft wie möglich! Ideal wäre mehrmals am Tag. Sprich am besten mit eurer Pflegekraft, die können euch helfen, das einzurichten. Bei uns auf der Neo war es möglich, das Baby fast den ganzen Tag auf der Brust zu haben.',
    time: '14:32',
  },
  {
    id: 'c5',
    sender: 'Du',
    content: 'Das beruhigt mich sehr. Danke für die Tipps!',
    time: '14:35',
  },
  {
    id: 'c6',
    sender: 'Maria Keller',
    content: 'Das klingt wunderbar! Die Känguru-Pflege ist so wertvoll. Ihr macht das grossartig. Meldet euch jederzeit, wenn ihr noch Fragen habt!',
    time: '14:38',
  },
];

const TOPICS = ['Alle', 'Frühgeburt', 'Stillen', 'Väter', 'Zwillinge', 'Nachsorge', 'Pränatal'];

// ---------------------------------------------------------------------------
// Conversation view
// ---------------------------------------------------------------------------

function ConversationView({
  peerName,
  onBack,
}: {
  peerName: string;
  onBack: () => void;
}) {
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState(MOCK_CONVERSATION);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sender: 'Du',
        content: trimmed,
        time: new Date().toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="-mx-4 -my-6 lg:-mx-8 lg:-my-8 flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <Avatar name={peerName} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{peerName}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {localMessages.map((msg) => {
          const isMe = msg.sender === 'Du';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'items-end gap-2'}`}
            >
              {!isMe && <Avatar name={msg.sender} size="sm" />}
              <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-md shadow-md shadow-brand-500/15'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-soft'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pb-3">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nachricht schreiben..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900
                         placeholder:text-gray-400 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            />
          </div>
          <motion.button
            type="submit"
            disabled={!newMessage.trim()}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white
                       flex items-center justify-center shadow-md shadow-brand-500/20
                       disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Icon name="ArrowUp" size={20} strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PeerPage() {
  const [selectedTopic, setSelectedTopic] = useState('Alle');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const filteredPeers =
    selectedTopic === 'Alle'
      ? PEERS
      : PEERS.filter((p) => p.topics.some((t) => t.toLowerCase().includes(selectedTopic.toLowerCase())));

  // Find active chat details
  const activeChat = ACTIVE_CHATS.find((c) => c.id === selectedChat);

  if (activeChat) {
    return (
      <ConversationView
        peerName={activeChat.peerName}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

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
            <Card key={chat.id} interactive onClick={() => setSelectedChat(chat.id)} className="flex items-center gap-4">
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
