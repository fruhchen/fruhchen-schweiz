'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';

const BABYPHONE_URL = 'https://baby.contact';

const FEATURES = [
  {
    icon: 'Shield',
    title: 'Ende-zu-Ende verschlüsselt',
    description: 'WebRTC Peer-to-Peer — kein Server sieht dein Video',
  },
  {
    icon: 'Smartphone',
    title: 'Kein Extra-Gerät nötig',
    description: 'Nutze ein altes Smartphone als Kamera',
  },
  {
    icon: 'QrCode',
    title: 'Sofort verbinden',
    description: 'QR-Code scannen und los — kein Login nötig',
  },
  {
    icon: 'Users',
    title: 'Mehrere Zuschauer',
    description: 'Bis zu 10 Familienmitglieder gleichzeitig',
  },
  {
    icon: 'Activity',
    title: 'Geräuscherkennung',
    description: 'Werde benachrichtigt wenn dein Baby sich meldet',
  },
  {
    icon: 'Wifi',
    title: 'Spital-WLAN kompatibel',
    description: 'Funktioniert auch im Krankenhaus-Netzwerk',
  },
];

const STEPS = [
  {
    step: 1,
    title: 'Kamera aufstellen',
    description: 'Öffne baby.contact auf dem Zweitgerät und wähle "Babys Zimmer". Das Gerät wird zur Kamera.',
    icon: 'Camera',
  },
  {
    step: 2,
    title: 'QR-Code scannen',
    description: 'Scanne den QR-Code mit deinem Hauptgerät. Die Verbindung wird direkt und sicher hergestellt.',
    icon: 'ScanLine',
  },
  {
    step: 3,
    title: 'Live zusehen',
    description: 'Sieh dein Baby live — mit Ton, Geräuscherkennung und Videoanruf-Option.',
    icon: 'Eye',
  },
];

export default function BabyphonePage() {
  const [showHowTo, setShowHowTo] = useState(false);

  const openBabyphone = (role: 'monitor' | 'parent') => {
    window.open(BABYPHONE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Babyphone"
        subtitle="Dein Baby im Blick — sicher und verschlüsselt"
      />

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-center">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-brand-400/30 animate-pulse" />
              <div className="absolute top-12 right-12 w-3 h-3 rounded-full bg-violet-400/20 animate-pulse [animation-delay:1s]" />
              <div className="absolute bottom-8 left-16 w-2 h-2 rounded-full bg-teal-400/25 animate-pulse [animation-delay:2s]" />
            </div>

            <div className="relative space-y-5">
              {/* Logo */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-white font-display tracking-tight">baby</span>
                <span className="text-brand-400 text-2xl">♥</span>
                <span className="text-2xl font-bold text-white font-display tracking-tight">contact</span>
              </div>

              <p className="text-white/50 text-sm max-w-sm mx-auto">
                Sichere Peer-to-Peer Videoübertragung — powered by WebRTC.
                Kein Account nötig, keine Daten auf Servern.
              </p>

              {/* Role selection */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => openBabyphone('monitor')}
                  className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-400/30 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto group-hover:bg-brand-500/30 transition-colors">
                      <Icon name="Camera" size={26} className="text-brand-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Babys Zimmer</p>
                      <p className="text-white/40 text-xs mt-0.5">Gerät wird zur Kamera</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => openBabyphone('parent')}
                  className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/30 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto group-hover:bg-violet-500/30 transition-colors">
                      <Icon name="Eye" size={26} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Eltern-Ansicht</p>
                      <p className="text-white/40 text-xs mt-0.5">Baby live sehen</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <Icon name="Lock" size={10} />
                  E2E verschlüsselt
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Zap" size={10} />
                  P2P direkt
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Globe" size={10} />
                  Schweizer Server
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* How it works */}
      <div>
        <button
          type="button"
          onClick={() => setShowHowTo(!showHowTo)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
        >
          <Icon name={showHowTo ? 'ChevronDown' : 'ChevronRight'} size={16} />
          So funktioniert&apos;s
        </button>
        <AnimatePresence>
          {showHowTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Card className="text-center space-y-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm flex items-center justify-center mx-auto">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto">
                        <Icon name={step.icon as any} size={22} className="text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features grid */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Warum baby.contact?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card padding="sm" className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon name={feature.icon as any} size={16} className="text-brand-500" />
                </div>
                <p className="font-medium text-gray-900 text-sm leading-tight">{feature.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200/50">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Icon name="ShieldCheck" size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-900 text-sm">Deine Privatsphäre ist geschützt</p>
            <p className="text-xs text-green-700 mt-1 leading-relaxed">
              baby.contact nutzt WebRTC für direkte Peer-to-Peer Verbindungen. Kein Video oder Audio wird
              jemals auf einem Server gespeichert. Die Signalisierung läuft über Cloudflare Workers in der Schweiz.
              Pflegefachpersonen können den Stream bei Bedarf pausieren.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
