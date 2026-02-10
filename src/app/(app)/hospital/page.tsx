'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { PageHeader } from '@/components/layout/page-header';

const CARE_TEAM = [
  { name: 'Dr. med. K. Hofmann', role: 'Neonatologin', icon: 'Stethoscope', available: true },
  { name: 'L. Berger', role: 'Pflegefachfrau', icon: 'HeartPulse', available: true },
  { name: 'S. Gerber', role: 'Physiotherapeutin', icon: 'Activity', available: false },
  { name: 'A. Schmid', role: 'Stillberaterin (IBCLC)', icon: 'Baby', available: true },
  { name: 'M. Fischer', role: 'Sozialarbeiterin', icon: 'Users', available: false },
  { name: 'Dr. L. Schneider', role: 'Augenärztin', icon: 'Eye', available: false },
];

const HOSPITAL_INFO = [
  { label: 'Besuchszeiten', value: 'Eltern: 24/7 jederzeit\nGroßeltern: 14:00–17:00', icon: 'Clock' },
  { label: 'Station', value: 'Neonatologie, Ebene 4, Zimmer 412', icon: 'MapPin' },
  { label: 'Notfall-Telefon', value: '031 632 21 11', icon: 'Phone' },
  { label: 'Parkplätze', value: 'Parking Süd, Einfahrt Freiburgstrasse\nEltern-Tarif: CHF 10/Tag', icon: 'Car' },
  { label: 'Milchküche', value: 'Ebene 4, Raum 425\nAbpump-Raum: 424 (24/7)', icon: 'Droplets' },
  { label: 'Cafeteria', value: 'Ebene 1, Mo–Fr 7:00–18:00\nSa/So 8:00–16:00', icon: 'Coffee' },
];

export default function HospitalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Spital"
        subtitle="Inselspital Bern — Neonatologie"
      />

      {/* Hospital card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-blue-50 to-violet-50 border-blue-200/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center">
              <Icon name="Building2" size={24} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Inselspital Bern</h2>
              <p className="text-sm text-gray-600">Universitätsklinik für Kinderheilkunde</p>
              <p className="text-sm text-gray-500">Neonatologie, Ebene 4</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Care team */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Dein Betreuungsteam</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CARE_TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card interactive className="flex items-center gap-3" padding="sm">
                <Avatar name={member.name} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{member.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Icon name={member.icon as any} size={12} />
                    {member.role}
                  </p>
                </div>
                {member.available && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hospital info grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Wichtige Informationen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HOSPITAL_INFO.map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + 0.05 * i }}
            >
              <Card padding="sm">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon name={info.icon as any} size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{info.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-line">{info.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Role explanations */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-3">Wer macht was?</h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-2">
            <Badge variant="blue">Neonatologe/in</Badge>
            <span className="text-gray-600">Spezialist*in für Neugeborenen-Medizin, leitet die Behandlung</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="rose">Pflege</Badge>
            <span className="text-gray-600">Tägliche Betreuung, Monitoring, Unterstützung bei der Pflege</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="teal">Physio</Badge>
            <span className="text-gray-600">Motorische Förderung und Lagerungsberatung</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="violet">Stillberatung</Badge>
            <span className="text-gray-600">Unterstützung bei Stillen, Abpumpen und Ernährung</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="brand">Sozialdienst</Badge>
            <span className="text-gray-600">Finanzielle Beratung, Formulare, Versicherungsfragen</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
