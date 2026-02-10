'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Icon } from '@/components/ui/icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WORKER_URL = 'https://fruhchen-ai.fruhchen.workers.dev';

const SUGGESTION_CHIPS = [
  'Was bedeutet CPAP?',
  'Tipps für Känguru-Pflege',
  'Fragen für die nächste Visite',
  'Wie berechne ich das korrigierte Alter?',
] as const;

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AiAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-md"
      style={{ width: size, height: size }}
    >
      <Icon name="Sparkles" size={size * 0.45} className="text-white" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex items-end gap-2.5 max-w-[85%]"
    >
      <AiAvatar size={32} />
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-5 py-3.5 shadow-soft">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-2 h-2 rounded-full bg-brand-300"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function UserBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] flex flex-col items-end gap-1">
        <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-md shadow-brand-500/15">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-[10px] text-gray-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}

function AssistantBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex items-end gap-2.5 max-w-[85%]"
    >
      <AiAvatar size={32} />
      <div className="flex flex-col gap-2">
        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3.5 shadow-soft">
          <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
            {message.content}
          </div>
        </div>
        <span className="text-[10px] text-gray-400 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}

function WelcomeState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center flex-1 px-4 py-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-100 via-warm-100 to-violet-100 flex items-center justify-center shadow-soft">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center">
            <Icon name="Sparkles" size={28} className="text-white" />
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-300"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-0.5 -left-2 w-2.5 h-2.5 rounded-full bg-violet-300"
        />
      </motion.div>

      <h2 className="text-heading text-gray-900 mb-2">Hallo! Wie kann ich helfen?</h2>
      <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
        Ich beantworte deine Fragen rund ums Thema Frühgeburt — basierend auf verlässlichen
        Inhalten von Frühchen Schweiz.
      </p>

      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {SUGGESTION_CHIPS.map((chip, i) => (
          <motion.button
            key={chip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
            onClick={() => onSuggestionClick(chip)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700
                       hover:border-brand-300 hover:text-brand-600 hover:shadow-soft
                       transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {chip}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`);
      }

      const data = await res.json();

      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      toast.error('Antwort konnte nicht geladen werden. Bitte versuche es erneut.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="-mx-4 -my-6 lg:-mx-8 lg:-my-8 flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
      {/* Floating disclaimer bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-warm-50 border-b border-warm-200/50 px-4 py-2 text-center flex-shrink-0"
      >
        <p className="text-[11px] text-gray-500 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <Icon name="Sparkles" size={11} className="text-brand-400" />
            AI-gestützt
          </span>
          <span className="text-gray-300">|</span>
          <span>Basierend auf Inhalten von fruehchenschweiz.ch</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400">Keine medizinische Beratung</span>
        </p>
      </motion.div>

      {/* Chat header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <AiAvatar />
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-gray-900">Frühchen Assistent</h1>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Immer für dich da
          </p>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Chat-Informationen"
        >
          <Icon name="Info" size={18} />
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 scroll-smooth"
      >
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            <WelcomeState onSuggestionClick={handleSuggestionClick} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {messages.map((msg) =>
                msg.role === 'user' ? (
                  <UserBubble key={msg.id} message={msg} />
                ) : (
                  <AssistantBubble key={msg.id} message={msg} />
                )
              )}

              <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pb-3">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex items-center gap-2"
        >
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Sprachnachricht"
          >
            <Icon name="Mic" size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Stelle eine Frage..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900
                         placeholder:text-gray-400 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400
                         hover:border-gray-300"
              disabled={isTyping}
            />
          </div>

          <motion.button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white
                       flex items-center justify-center shadow-md shadow-brand-500/20
                       hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
            aria-label="Nachricht senden"
          >
            <Icon name="ArrowUp" size={20} strokeWidth={2} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
