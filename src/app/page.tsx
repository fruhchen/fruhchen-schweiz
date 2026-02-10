'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

/* -------------------------------------------------------------------------- */
/*  Animation helpers                                                         */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const stats = [
  { value: "1'200+", label: 'Familien begleitet' },
  { value: '24/7', label: 'Peer Support' },
  { value: '8', label: 'Regionen' },
];

const features = [
  {
    icon: 'BookHeart' as const,
    title: 'Tagebuch',
    description: 'Halte Meilensteine, Gefühle und Fortschritte eures Kindes fest.',
    accent: 'rose',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    border: 'hover:border-rose-200',
  },
  {
    icon: 'BookOpen' as const,
    title: 'Glossar',
    description: 'Medizinische Begriffe einfach und verständlich erklärt.',
    accent: 'violet',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    border: 'hover:border-violet-200',
  },
  {
    icon: 'MessageCircle' as const,
    title: 'AI Chat',
    description: 'Sanfte, einfühlsame Antworten auf eure Fragen, rund um die Uhr.',
    accent: 'teal',
    bg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    border: 'hover:border-teal-200',
  },
  {
    icon: 'Calendar' as const,
    title: 'Events',
    description: 'Elterntreffen, Workshops und regionale Veranstaltungen entdecken.',
    accent: 'brand',
    bg: 'bg-brand-50',
    iconColor: 'text-brand-500',
    border: 'hover:border-brand-200',
  },
  {
    icon: 'Users' as const,
    title: 'Peer Support',
    description: 'Erfahrene Peer-Eltern stehen euch mit Rat und Empathie zur Seite.',
    accent: 'green',
    bg: 'bg-green-50',
    iconColor: 'text-green-500',
    border: 'hover:border-green-200',
  },
  {
    icon: 'Video' as const,
    title: 'Babyphone',
    description: 'Sicherer Video-Zugang zur Neonatologie, direkt auf dem Handy.',
    accent: 'blue',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    border: 'hover:border-blue-200',
  },
  {
    icon: 'ClipboardCheck' as const,
    title: 'Nachsorge',
    description: 'Checklisten und Termine für die Zeit nach dem Spitalaufenthalt.',
    accent: 'amber',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    border: 'hover:border-amber-200',
  },
  {
    icon: 'Package' as const,
    title: 'NEO Box',
    description: 'Die liebevoll zusammengestellte Willkommensbox für Frühchen-Familien.',
    accent: 'pink',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    border: 'hover:border-pink-200',
  },
];

const steps = [
  {
    number: '1',
    title: 'QR Code scannen',
    description: 'Im Spital oder auf unserer Website den QR Code scannen und die App sofort öffnen.',
    icon: 'ScanLine' as const,
  },
  {
    number: '2',
    title: 'Registrieren',
    description: 'Ein kurzes Profil erstellen, eure Region wählen und schon seid ihr dabei.',
    icon: 'UserPlus' as const,
  },
  {
    number: '3',
    title: 'Sofort loslegen',
    description: 'Tagebuch führen, Glossar entdecken, Peer-Eltern kennenlernen und vieles mehr.',
    icon: 'Rocket' as const,
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/*  Top nav with logo                                                  */}
      {/* ------------------------------------------------------------------ */}
      <nav className="absolute top-0 left-0 right-0 z-30 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <img src="/fruhchen_neokinder_logo.svg" alt="Frühchen & Neokinder Schweiz" className="h-10 md:h-14 w-auto" />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Anmelden</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Registrieren</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/*  Hero                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-gradient-hero min-h-[92vh] flex items-center overflow-hidden">
        {/* Decorative floating circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-brand-200/30 blur-3xl animate-float" />
          <div className="absolute top-1/3 -left-32 w-[340px] h-[340px] rounded-full bg-violet-200/25 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-12 right-1/4 w-[260px] h-[260px] rounded-full bg-teal-200/20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
          <div className="absolute top-16 left-1/3 w-[180px] h-[180px] rounded-full bg-rose-200/20 blur-2xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-lg border border-brand-200/60 px-5 py-2 shadow-soft"
          >
            <Icon name="Heart" size={16} className="text-rose-500" />
            <span className="text-sm font-medium text-gray-700">
              Für Frühchen-Familien in der Schweiz
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-display-lg md:text-[4.5rem] md:leading-[1.05] text-balance font-display"
          >
            <span className="text-gradient-warm">Gemeinsam stark</span>
            <br />
            <span className="text-gray-800">für die Kleinsten</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-500 leading-relaxed text-balance"
          >
            Die digitale Begleitung für Familien mit Frühgeborenen und Neokindern.
            Wissen, Austausch und Unterstützung — alles in einer App.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" icon="ArrowRight" className="text-base px-8 py-4">
                Jetzt starten
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" icon="ChevronDown" className="text-base px-8 py-4">
                Mehr erfahren
              </Button>
            </a>
          </motion.div>

          {/* Decorative element — floating app preview hint */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 inline-flex items-center gap-3 glass-card px-6 py-4 animate-float"
            style={{ animationDelay: '1s' }}
          >
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-brand-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">M</div>
              <div className="w-9 h-9 rounded-full bg-violet-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">S</div>
              <div className="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">A</div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Aktive Community</p>
              <p className="text-xs text-gray-500">Familien helfen Familien</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Stats bar                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative -mt-12 z-20 mx-auto max-w-4xl px-6">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="glass-card px-8 py-8"
        >
          <div className="grid grid-cols-3 divide-x divide-gray-200/60">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <p className="text-display-sm md:text-display text-gradient-brand font-display">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Features grid                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-16"
        >
          <span className="badge-brand mb-4 inline-block">Features</span>
          <h2 className="text-display-sm md:text-display text-gray-900 font-display text-balance">
            Alles, was eure Familie braucht
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-gray-500 leading-relaxed">
            Von medizinischem Wissen bis zum emotionalen Austausch — unsere App begleitet
            euch durch jede Phase.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i}
              className={`
                group bg-white rounded-3xl shadow-soft border border-gray-100/50 p-6
                transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1
                ${feature.border} cursor-default
              `}
            >
              {/* Icon circle */}
              <div
                className={`
                  w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4
                  transition-transform duration-300 group-hover:scale-110
                `}
              >
                <Icon name={feature.icon} size={22} className={feature.iconColor} />
              </div>

              <h3 className="text-subheading text-gray-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  How it works                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-gradient-warm py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-16"
          >
            <span className="badge-violet mb-4 inline-block">So funktioniert&apos;s</span>
            <h2 className="text-display-sm md:text-display text-gray-900 font-display text-balance">
              In drei Schritten dabei
            </h2>
            <p className="mt-4 mx-auto max-w-lg text-gray-500">
              Kein App Store nötig. Einfach öffnen, registrieren und loslegen.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-brand-200 via-violet-200 to-teal-200 rounded-full" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid md:grid-cols-3 gap-10 md:gap-8"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  custom={i}
                  className="relative text-center"
                >
                  {/* Number circle */}
                  <div className="relative z-10 mx-auto mb-6 w-14 h-14 rounded-full bg-white shadow-soft-lg border-2 border-brand-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gradient-brand">{step.number}</span>
                  </div>

                  <div className="glass-card p-6">
                    <div className="mx-auto mb-4 w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
                      <Icon name={step.icon} size={20} className="text-brand-500" />
                    </div>
                    <h3 className="text-subheading text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Testimonial                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="relative text-center"
          >
            {/* Decorative quote mark */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-8xl leading-none text-brand-200/50 font-display select-none">
              &ldquo;
            </div>

            <div className="glass-card p-10 md:p-14">
              <Icon name="Quote" size={32} className="mx-auto mb-6 text-brand-300" />

              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium text-balance">
                Als unser Sohn in der 28. Woche kam, waren wir völlig überwältigt.
                Diese App hat uns Halt gegeben — das Tagebuch, die Peer-Eltern, einfach
                zu wissen, dass wir nicht allein sind. Dafür sind wir unendlich dankbar.
              </blockquote>

              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg ring-4 ring-white shadow-soft">
                  S
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Sandra M.</p>
                  <p className="text-sm text-gray-500">Mama, Region Bern</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  CTA section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full bg-brand-200/25 blur-3xl" />
          <div className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full bg-violet-200/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center">
              <Icon name="HeartHandshake" size={32} className="text-brand-500" />
            </div>

            <h2 className="text-display-sm md:text-display text-gray-900 font-display text-balance">
              Bereit für den nächsten Schritt?
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Tretet unserer Community bei und erfahrt, wie wir Frühchen-Familien
              in der ganzen Schweiz begleiten.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" icon="ArrowRight" className="text-base px-8 py-4">
                  Kostenlos registrieren
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" icon="Mail" className="text-base px-8 py-4">
                  Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Footer                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-gray-100 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <img src="/fruhchen_neokinder_logo.svg" alt="Frühchen & Neokinder Schweiz" className="h-12 w-auto" />
            </div>

            {/* Links */}
            <nav className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/about" className="hover:text-brand-500 transition-colors">
                Über uns
              </Link>
              <Link href="/privacy" className="hover:text-brand-500 transition-colors">
                Datenschutz
              </Link>
              <Link href="/imprint" className="hover:text-brand-500 transition-colors">
                Impressum
              </Link>
              <Link href="/contact" className="hover:text-brand-500 transition-colors">
                Kontakt
              </Link>
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Frühchen &amp; Neokinder Schweiz. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
