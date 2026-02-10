'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

const PARTNERS = [
  {
    name: 'Kinderspital Zürich',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/02/Kinderspital%20LOGO.png',
    category: 'Spitäler',
  },
  {
    name: 'Inselspital Bern',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/03/Inselspital.png',
    category: 'Spitäler',
  },
  {
    name: 'UKBB',
    logo: 'https://www.fruehchenschweiz.ch/images/2024/08/Logo_UKBB_Descripto_4C_D_sRGB%20002.png',
    category: 'Spitäler',
  },
  {
    name: 'Universitätsspital Zürich',
    logo: 'https://www.fruehchenschweiz.ch/images/2024/01/University_Hospital_of_Zurich_logo.svg.png',
    category: 'Spitäler',
  },
  {
    name: 'KSA Kinderspital Aarau',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/02/KSA_Kinderspital_Aarau_quer_RGB_KS_Blau.jpg',
    category: 'Spitäler',
  },
  {
    name: 'KSB',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/07/KSB.png',
    category: 'Spitäler',
  },
  {
    name: 'Frauenklinik Bern',
    logo: 'https://www.fruehchenschweiz.ch/images/2024/06/Frauenklinik%20Bern.png',
    category: 'Spitäler',
  },
  {
    name: 'EOC',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/10/EOC.png',
    category: 'Spitäler',
  },
  {
    name: 'OKS',
    logo: 'https://www.fruehchenschweiz.ch/images/2024/11/oks_logo_2017_rgb.jpg',
    category: 'Spitäler',
  },
  {
    name: 'EFCNI',
    logo: 'https://www.fruehchenschweiz.ch/images/2025/09/GFCNI_RGB.jpg',
    category: 'Organisationen',
  },
  {
    name: 'Stillförderung Schweiz',
    logo: 'https://www.fruehchenschweiz.ch/images/2024/09/Logo_stillfoerderung24_Hi_transparent.png',
    category: 'Organisationen',
  },
  {
    name: 'SSN NeoNurse',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/07/SSN.png',
    category: 'Organisationen',
  },
  {
    name: 'GGG Basel',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/02/GGG_Basel_Logo_black.png',
    category: 'Organisationen',
  },
  {
    name: 'NeTropTot',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/03/NeTropTot.png',
    category: 'Organisationen',
  },
  {
    name: 'Kinderuni Zürich',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/07/kinderuni-zurich.ebadad9b.jpg',
    category: 'Bildung',
  },
  {
    name: 'Medela',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/05/Medela_logo_with_tagline_web.jpeg%205.jpg',
    category: 'Unternehmen',
  },
  {
    name: 'MAM',
    logo: 'https://www.fruehchenschweiz.ch/images/2024/01/MAM2.png',
    category: 'Unternehmen',
  },
  {
    name: 'Amamah',
    logo: 'https://www.fruehchenschweiz.ch/images/2022/12/am_claim_logo_v01_am_logo_01c.png',
    category: 'Unternehmen',
  },
  {
    name: 'Swissmom',
    logo: 'https://www.fruehchenschweiz.ch/images/2023/03/Logo-Swissmom-CMYK.png',
    category: 'Medien',
  },
];

const CATEGORIES = ['Alle', 'Spitäler', 'Organisationen', 'Unternehmen', 'Bildung', 'Medien'] as const;

export default function PartnersPage() {
  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Unsere Partner"
        subtitle="Gemeinsam für Frühgeborene und ihre Familien"
      />

      {/* Intro card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-brand-50 via-violet-50 to-teal-50 border-brand-200/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
              <Icon name="Handshake" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Starkes Netzwerk</p>
              <p className="text-sm text-gray-600 mt-1">
                Frühchen Schweiz arbeitet eng mit Spitälern, Organisationen und Unternehmen
                zusammen, um Familien von Frühgeborenen bestmöglich zu unterstützen.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Partner grid by category */}
      {CATEGORIES.filter((c) => c !== 'Alle').map((category, catIdx) => {
        const partners = PARTNERS.filter((p) => p.category === category);
        if (partners.length === 0) return null;

        return (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * catIdx }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * catIdx + 0.05 * i }}
                >
                  <Card className="flex flex-col items-center text-center p-4 h-full">
                    <div className="w-full h-16 flex items-center justify-center mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-700 leading-tight">{partner.name}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        );
      })}

      {/* CTA */}
      <Card className="bg-warm-50 border-warm-200/50">
        <div className="flex gap-3">
          <Icon name="Heart" size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Partner werden?</p>
            <p className="text-sm text-gray-600 mt-1">
              Möchtest du oder dein Unternehmen Frühchen Schweiz unterstützen? Wir freuen uns
              über jede Partnerschaft. Kontaktiere uns unter{' '}
              <a href="mailto:info@fruehchenschweiz.ch" className="text-brand-600 font-medium hover:underline">
                info@fruehchenschweiz.ch
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
