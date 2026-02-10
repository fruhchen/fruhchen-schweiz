'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { REGIONS, LANGUAGES } from '@/lib/constants';
import { getSupabase } from '@/lib/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type Role = 'parent' | 'peer' | 'fachperson';

interface RoleOption {
  id: Role;
  label: string;
  description: string;
  icon: keyof typeof icons;
  gradient: string;
  glow: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'parent',
    label: 'Elternteil',
    description: 'Mutter oder Vater eines Frühgeborenen oder Neokindes',
    icon: 'Heart',
    gradient: 'from-brand-400 to-brand-600',
    glow: 'shadow-glow-brand',
  },
  {
    id: 'peer',
    label: 'Peer-Eltern',
    description: 'Erfahrene Eltern, die andere Familien begleiten',
    icon: 'Users',
    gradient: 'from-violet-400 to-violet-600',
    glow: 'shadow-glow-violet',
  },
  {
    id: 'fachperson',
    label: 'Fachperson',
    description: 'Medizinische oder therapeutische Fachkraft',
    icon: 'Stethoscope',
    gradient: 'from-teal-400 to-teal-600',
    glow: 'shadow-glow-teal',
  },
];

const STEP_LABELS = ['Über dich', 'Dein Baby', 'Einstellungen'];

/* ------------------------------------------------------------------ */
/*  Slide animation variants                                           */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role | null>(null);

  // Step 2
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gestationalWeeks, setGestationalWeeks] = useState('');
  const [hospital, setHospital] = useState('');
  const [region, setRegion] = useState('');

  // Step 3
  const [language, setLanguage] = useState('de');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  /* ---- Navigation ---- */

  const goNext = () => {
    if (step === 1 && (!name || !email || !password || !role)) {
      toast.error('Bitte fülle alle Pflichtfelder aus und wähle eine Rolle.');
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!privacyConsent) {
      toast.error('Bitte akzeptiere die Datenschutzerklärung.');
      return;
    }
    setLoading(true);
    const { error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role || 'parent',
          baby_name: babyName || undefined,
          baby_birth_date: birthDate || undefined,
          region: region || undefined,
          language,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Willkommen bei Frühchen Schweiz!');
      router.push('/dashboard');
    }
  };

  /* ---- Progress indicator ---- */

  const ProgressBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex-1 flex items-center gap-2">
          {/* Dot */}
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
              transition-all duration-300 shrink-0
              ${
                s < step
                  ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/20'
                  : s === step
                    ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/20 ring-4 ring-brand-200/50'
                    : 'bg-gray-100 text-gray-400'
              }
            `}
          >
            {s < step ? (
              <Icon name="Check" size={14} strokeWidth={2.5} />
            ) : (
              s
            )}
          </div>
          {/* Label (hidden on very small screens) */}
          <span
            className={`hidden sm:block text-xs font-medium transition-colors ${
              s <= step ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {STEP_LABELS[s - 1]}
          </span>
          {/* Line */}
          {s < 3 && (
            <div className="flex-1 h-0.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
                initial={false}
                animate={{ width: s < step ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 1 — About You                                               */
  /* ---------------------------------------------------------------- */

  const Step1 = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-heading text-gray-900 mb-1">Erzähl uns von dir</h2>
        <p className="text-sm text-gray-400">
          Diese Informationen helfen uns, die App für dich zu personalisieren.
        </p>
      </div>

      <Input
        label="Name"
        placeholder="Dein Vor- und Nachname"
        icon="User"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        type="email"
        label="E-Mail-Adresse"
        placeholder="name@beispiel.ch"
        icon="Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        label="Passwort"
        placeholder="Mindestens 8 Zeichen"
        icon="Lock"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Role selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Deine Rolle
        </label>
        <div className="grid gap-3">
          {ROLE_OPTIONS.map((opt) => {
            const selected = role === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRole(opt.id)}
                className={`
                  relative flex items-center gap-4 p-4 rounded-2xl border-2
                  text-left transition-all duration-300
                  ${
                    selected
                      ? `border-brand-400 bg-brand-50/60 ${opt.glow}`
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-soft'
                  }
                `}
              >
                <div
                  className={`
                    w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                    transition-all duration-300
                    ${
                      selected
                        ? `bg-gradient-to-br ${opt.gradient} text-white shadow-md`
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}
                >
                  <Icon name={opt.icon} size={20} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      selected ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
                {/* Check indicator */}
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"
                  >
                    <Icon
                      name="Check"
                      size={12}
                      className="text-white"
                      strokeWidth={3}
                    />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 2 — Baby Details (optional)                                 */
  /* ---------------------------------------------------------------- */

  const Step2 = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-heading text-gray-900 mb-1">Dein Baby</h2>
        <p className="text-sm text-gray-400">
          Diese Angaben sind optional und helfen uns, passende Inhalte
          anzuzeigen.
        </p>
      </div>

      <Input
        label="Name des Babys"
        placeholder="z.B. Mia"
        icon="Baby"
        value={babyName}
        onChange={(e) => setBabyName(e.target.value)}
        helperText="Optional"
      />

      <Input
        type="date"
        label="Geburtsdatum"
        icon="Calendar"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        helperText="Optional"
      />

      <Input
        type="number"
        label="Schwangerschaftswoche bei Geburt"
        placeholder="z.B. 28"
        icon="Clock"
        value={gestationalWeeks}
        onChange={(e) => setGestationalWeeks(e.target.value)}
        helperText="Optional — Gestationsalter in Wochen"
        min="22"
        max="42"
      />

      <Input
        label="Spital / Klinik"
        placeholder="z.B. Inselspital Bern"
        icon="Building2"
        value={hospital}
        onChange={(e) => setHospital(e.target.value)}
        helperText="Optional"
      />

      {/* Region dropdown */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Region
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Icon name="MapPin" size={18} />
          </div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200
                       text-gray-900 transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400
                       hover:border-gray-300 appearance-none cursor-pointer"
          >
            <option value="">Bitte wählen (optional)</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.emoji} {r.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
            <Icon name="ChevronDown" size={16} />
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Optional — Für regionale Angebote und Events
        </p>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 3 — Language, Privacy & Submit                              */
  /* ---------------------------------------------------------------- */

  const Step3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading text-gray-900 mb-1">Fast geschafft!</h2>
        <p className="text-sm text-gray-400">
          Wähle deine Sprache und bestätige die Datenschutzerklärung.
        </p>
      </div>

      {/* Language cards */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Bevorzugte Sprache
        </label>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => {
            const selected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`
                  p-3 rounded-2xl border-2 text-center transition-all duration-300
                  ${
                    selected
                      ? 'border-brand-400 bg-brand-50/60 shadow-md shadow-brand-500/10'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-soft'
                  }
                `}
              >
                <p
                  className={`text-sm font-semibold ${
                    selected ? 'text-brand-700' : 'text-gray-700'
                  }`}
                >
                  {lang.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy consent */}
      <div className="bg-warm-50 rounded-2xl p-5 border border-warm-200/60">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="pt-0.5">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className={`
                w-5 h-5 rounded-lg border-2 flex items-center justify-center
                transition-all duration-200
                ${
                  privacyConsent
                    ? 'bg-brand-500 border-brand-500'
                    : 'border-gray-300 group-hover:border-brand-300'
                }
              `}
            >
              {privacyConsent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Icon
                    name="Check"
                    size={12}
                    className="text-white"
                    strokeWidth={3}
                  />
                </motion.div>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            Ich habe die{' '}
            <span className="text-brand-600 font-medium hover:underline">
              Datenschutzerklärung
            </span>{' '}
            und die{' '}
            <span className="text-brand-600 font-medium hover:underline">
              Nutzungsbedingungen
            </span>{' '}
            gelesen und stimme diesen zu.
          </div>
        </label>
      </div>

      {/* Summary hint */}
      <div className="flex items-center gap-3 bg-teal-50 rounded-2xl p-4 border border-teal-200/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
          <Icon name="ShieldCheck" size={18} className="text-white" />
        </div>
        <p className="text-sm text-teal-700 leading-relaxed">
          Deine Daten werden sicher gespeichert und niemals an Dritte
          weitergegeben.
        </p>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-200/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo + App Name */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand mb-4"
          >
            <Icon name="Heart" size={28} className="text-white" strokeWidth={2} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-display-sm text-gray-900 mb-1"
          >
            Konto erstellen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-gray-500 text-sm"
          >
            In wenigen Schritten bist du dabei
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-soft-lg p-8"
        >
          {/* Progress */}
          <ProgressBar />

          {/* Step Content with AnimatePresence */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                icon="ArrowLeft"
                onClick={goBack}
                size="lg"
              >
                Zurück
              </Button>
            )}

            <div className="flex-1" />

            {step < 3 ? (
              <Button
                type="button"
                variant="primary"
                iconRight="ArrowRight"
                onClick={goNext}
                size="lg"
              >
                Weiter
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                icon="Sparkles"
                onClick={handleSubmit}
                size="lg"
              >
                Registrieren
              </Button>
            )}
          </div>
        </motion.div>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          Bereits ein Konto?{' '}
          <Link
            href="/login"
            className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            Jetzt anmelden
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
