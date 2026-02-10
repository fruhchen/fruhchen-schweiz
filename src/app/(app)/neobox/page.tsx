'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { toast } from 'sonner';

const BOX_CONTENTS = [
  { name: 'Frühchen-Mütze', description: 'Wärmende Strickmütze für die kleinsten Köpfchen', icon: 'Shirt' },
  { name: 'Tagebuch', description: 'Zum Festhalten eurer Reise auf der Neonatologie', icon: 'BookHeart' },
  { name: 'Info-Broschüren', description: 'Wichtige Informationen zu Frühgeburt und Neonatologie', icon: 'FileText' },
  { name: 'Kontaktkarten', description: 'Adressen und Nummern von Beratungsstellen', icon: 'Phone' },
  { name: 'Andenken-Set', description: 'Hand- und Fussabdruck-Set für euer Baby', icon: 'Fingerprint' },
  { name: 'Gutschein', description: 'Gutschein für Stillberatung oder Tragberatung', icon: 'Gift' },
];

export default function NeoboxPage() {
  const [ordered, setOrdered] = useState(false);

  const handleOrder = () => {
    setOrdered(true);
    toast.success('NEO Box bestellt! Du erhältst eine Bestätigung per E-Mail.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="NEO Box"
        subtitle="Ein Willkommensgeschenk für deine Familie"
      />

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-br from-rose-50 via-brand-50 to-violet-50 border-brand-200/50 text-center space-y-4 p-8">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-soft-lg flex items-center justify-center mx-auto">
            <Icon name="Package" size={36} className="text-brand-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Baby-NEO Box</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            In Zusammenarbeit mit LetsFamily stellen wir eine liebevoll zusammengestellte Box
            für Familien mit Frühgeborenen bereit — kostenlos und direkt zu dir.
          </p>
          {!ordered && (
            <Button variant="primary" size="lg" icon="Package" onClick={handleOrder}>
              Kostenlos bestellen
            </Button>
          )}
          {ordered && (
            <div className="flex items-center gap-2 justify-center text-emerald-600">
              <Icon name="CheckCircle" size={20} />
              <span className="font-semibold">Bestellt! Lieferung in 5–7 Werktagen.</span>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Box contents */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Was ist in der Box?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOX_CONTENTS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="flex items-start gap-3" padding="sm">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon as any} size={18} className="text-brand-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Digital content */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Icon name="Smartphone" size={20} className="text-violet-500" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Digitale Box-Inhalte</h2>
            <p className="text-sm text-gray-500">Alle Ressourcen auch digital verfügbar</p>
          </div>
        </div>
        <div className="space-y-2">
          {['Checkliste für die Neonatologie', 'Ratgeber Stillen & Ernährung', 'Rechte als Eltern', 'Regionale Beratungsangebote'].map((item) => (
            <button
              key={item}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <Icon name="FileText" size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700">{item}</span>
              <Icon name="ChevronRight" size={16} className="text-gray-300 ml-auto" />
            </button>
          ))}
        </div>
      </Card>

      {/* Partner info */}
      <Card className="bg-gray-50 border-gray-200/50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icon name="Handshake" size={16} />
          <span>In Partnerschaft mit LetsFamily und unterstützt durch Spendengelder.</span>
        </div>
      </Card>
    </div>
  );
}
