'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';
// ── Types ────────────────────────────────────────────────────────────────────

type MoodLevel = 1 | 2 | 3 | 4 | 5;
type Step = 'mood' | 'write' | 'milestone' | 'save';

interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
}

interface MilestoneOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

// ── Configuration ────────────────────────────────────────────────────────────

const MOODS: MoodOption[] = [
  {
    level: 1,
    emoji: '\uD83D\uDE22',
    label: 'Sehr schwer',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    glow: 'shadow-rose-200/50',
  },
  {
    level: 2,
    emoji: '\uD83D\uDE14',
    label: 'Schwer',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    glow: 'shadow-orange-200/50',
  },
  {
    level: 3,
    emoji: '\uD83D\uDE10',
    label: 'Geht so',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    glow: 'shadow-amber-200/50',
  },
  {
    level: 4,
    emoji: '\uD83D\uDE0A',
    label: 'Gut',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    glow: 'shadow-emerald-200/50',
  },
  {
    level: 5,
    emoji: '\uD83D\uDE04',
    label: 'Wunderbar',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-300',
    glow: 'shadow-teal-200/50',
  },
];

const MILESTONES: MilestoneOption[] = [
  {
    id: 'weight',
    label: 'Gewichtszunahme',
    icon: 'TrendingUp',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 'kangaroo',
    label: 'Erstes Känguru',
    icon: 'Heart',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    id: 'bottle',
    label: 'Erste Flasche',
    icon: 'Baby',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    id: 'breathing',
    label: 'Selbstständig atmen',
    icon: 'Wind',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    id: 'home',
    label: 'Nach Hause!',
    icon: 'Home',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    id: 'custom',
    label: 'Eigener',
    icon: 'Sparkles',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
];

const STEPS: Step[] = ['mood', 'write', 'milestone', 'save'];

const PROMPTS = [
  'Was ist heute passiert?',
  'Wofür bist du dankbar?',
  'Was möchtest du festhalten?',
];

// ── Animation variants ───────────────────────────────────────────────────────

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

// ── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i <= currentStep
              ? 'bg-gradient-to-r from-brand-400 to-brand-500'
              : 'bg-gray-200'
          }`}
          animate={{ width: i === currentStep ? 32 : 12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

// ── Success animation ────────────────────────────────────────────────────────

function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6"
      >
        <Icon name="Check" size={48} className="text-white" strokeWidth={2.5} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-heading text-gray-900 mb-2"
      >
        Eintrag gespeichert
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="text-gray-500 mb-8"
      >
        Du machst das grossartig. Jeder Tag zählt.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <Link href="/journal">
          <Button variant="secondary" icon="ArrowLeft">
            Zurück zum Tagebuch
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function NewJournalEntryPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasMilestone, setHasMilestone] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentStep = STEPS[stepIndex];

  const canProceed = () => {
    if (currentStep === 'mood') return selectedMood !== null;
    if (currentStep === 'write') return content.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      toast.success('Eintrag gespeichert \u2764\uFE0F');
    }, 1200);
  };

  if (isSaved) {
    return <SuccessAnimation />;
  }

  return (
    <div className="max-w-lg mx-auto pb-24 lg:pb-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        {stepIndex > 0 ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="ChevronLeft" size={18} />
            Zurück
          </button>
        ) : (
          <Link
            href="/journal"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="X" size={18} />
            Abbrechen
          </Link>
        )}

        <span className="text-xs text-gray-400 font-medium">
          Schritt {stepIndex + 1} von {STEPS.length}
        </span>
      </div>

      <StepIndicator currentStep={stepIndex} />

      {/* Step content */}
      <AnimatePresence mode="wait">
        {/* ── Step 1: Mood ─────────────────────────────────────────────── */}
        {currentStep === 'mood' && (
          <motion.div
            key="mood"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
          >
            <div className="text-center mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-display-sm text-gray-900 mb-2"
              >
                Wie geht es dir heute?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-gray-400 text-sm"
              >
                Es gibt kein richtig oder falsch
              </motion.p>
            </div>

            <div className="flex flex-col gap-3">
              {MOODS.map((mood, i) => (
                <motion.button
                  key={mood.level}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedMood(mood.level)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedMood === mood.level
                      ? `${mood.bg} ${mood.border} shadow-lg ${mood.glow}`
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-soft'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span
                    className={`text-base font-medium transition-colors duration-300 ${
                      selectedMood === mood.level ? mood.color : 'text-gray-600'
                    }`}
                  >
                    {mood.label}
                  </span>
                  {selectedMood === mood.level && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Icon name="Check" size={20} className={mood.color} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Write ────────────────────────────────────────────── */}
        {currentStep === 'write' && (
          <motion.div
            key="write"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
          >
            <div className="text-center mb-8">
              <h2 className="text-display-sm text-gray-900 mb-2">Dein Eintrag</h2>
              <p className="text-gray-400 text-sm">Schreib so viel oder wenig wie du möchtest</p>
            </div>

            <div className="space-y-5">
              <Input
                label="Titel (optional)"
                placeholder="z.B. Ein guter Tag"
                icon="Type"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label="Was bewegt dich?"
                placeholder="Erzähl von deinem Tag..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[160px]"
              />

              {/* Photo upload area */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-brand-300 hover:bg-brand-50/30 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                  <Icon
                    name="Camera"
                    size={22}
                    className="text-gray-400 group-hover:text-brand-500 transition-colors duration-300"
                  />
                </div>
                <p className="text-sm text-gray-500 group-hover:text-brand-600 font-medium transition-colors duration-300">
                  Fotos hinzufügen
                </p>
                <p className="text-xs text-gray-400 mt-1">Tippe zum Hochladen</p>
              </div>

              {/* Guided prompts */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Inspiration
                </p>
                {PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      if (!content.includes(prompt)) {
                        setContent((prev) =>
                          prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`
                        );
                      }
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl bg-warm-50 border border-warm-200/50 text-sm text-gray-600 hover:bg-warm-100 hover:border-warm-300/50 transition-all duration-200"
                  >
                    <Icon
                      name="Lightbulb"
                      size={14}
                      className="text-amber-400 inline-block mr-2 -mt-0.5"
                    />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Milestone ────────────────────────────────────────── */}
        {currentStep === 'milestone' && (
          <motion.div
            key="milestone"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
          >
            <div className="text-center mb-8">
              <h2 className="text-display-sm text-gray-900 mb-2">Gab es einen Meilenstein?</h2>
              <p className="text-gray-400 text-sm">Jeder kleine Fortschritt zählt</p>
            </div>

            {/* Toggle */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => {
                  setHasMilestone(!hasMilestone);
                  if (hasMilestone) setSelectedMilestone(null);
                }}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                  hasMilestone
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-lg shadow-amber-200/30'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Icon name="Star" size={18} className={hasMilestone ? 'text-amber-500' : 'text-gray-400'} />
                <span className="font-medium text-sm">
                  {hasMilestone ? 'Ja, es gab einen!' : 'Meilenstein hinzufügen'}
                </span>
                <div
                  className={`w-10 h-6 rounded-full transition-all duration-300 relative ${
                    hasMilestone ? 'bg-amber-400' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ left: hasMilestone ? 20 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>

            {/* Milestone type selector */}
            <AnimatePresence>
              {hasMilestone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {MILESTONES.map((ms, i) => (
                      <motion.div
                        key={ms.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                      >
                        <Card
                          interactive
                          padding="sm"
                          onClick={() =>
                            setSelectedMilestone(selectedMilestone === ms.id ? null : ms.id)
                          }
                          className={`text-center transition-all duration-300 ${
                            selectedMilestone === ms.id
                              ? `${ms.bg} border-2 ring-2 ring-offset-2 ring-amber-200`
                              : 'border-2 border-transparent'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl ${ms.bg} flex items-center justify-center mx-auto mb-2`}
                          >
                            <Icon name={ms.icon} size={20} className={ms.color} />
                          </div>
                          <p className="text-xs font-medium text-gray-700">{ms.label}</p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Step 4: Privacy & Save ───────────────────────────────────── */}
        {currentStep === 'save' && (
          <motion.div
            key="save"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
          >
            <div className="text-center mb-8">
              <h2 className="text-display-sm text-gray-900 mb-2">Fast geschafft</h2>
              <p className="text-gray-400 text-sm">Wähle, wer deinen Eintrag sehen darf</p>
            </div>

            {/* Summary */}
            <Card className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {selectedMood && (
                  <span className="text-2xl">{MOODS[selectedMood - 1].emoji}</span>
                )}
                <div>
                  {title && <p className="text-sm font-semibold text-gray-900">{title}</p>}
                  <p className="text-xs text-gray-400">
                    {content.length} Zeichen
                    {selectedMilestone && ' \u00B7 Meilenstein'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-3">{content}</p>
            </Card>

            {/* Privacy toggle */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => setIsPrivate(true)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                  isPrivate
                    ? 'bg-violet-50 border-violet-300 shadow-lg shadow-violet-200/30'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isPrivate ? 'bg-violet-100' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    name="Lock"
                    size={20}
                    className={isPrivate ? 'text-violet-500' : 'text-gray-400'}
                  />
                </div>
                <div className="text-left flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isPrivate ? 'text-violet-700' : 'text-gray-600'
                    }`}
                  >
                    Nur für mich
                  </p>
                  <p className="text-xs text-gray-400">Dein privater Eintrag</p>
                </div>
                {isPrivate && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Icon name="Check" size={20} className="text-violet-500" strokeWidth={2.5} />
                  </motion.div>
                )}
              </button>

              <button
                onClick={() => setIsPrivate(false)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                  !isPrivate
                    ? 'bg-brand-50 border-brand-300 shadow-lg shadow-brand-200/30'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    !isPrivate ? 'bg-brand-100' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    name="Users"
                    size={20}
                    className={!isPrivate ? 'text-brand-500' : 'text-gray-400'}
                  />
                </div>
                <div className="text-left flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      !isPrivate ? 'text-brand-700' : 'text-gray-600'
                    }`}
                  >
                    Mit Partner teilen
                  </p>
                  <p className="text-xs text-gray-400">Zusammen durch diese Zeit</p>
                </div>
                {!isPrivate && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Icon name="Check" size={20} className="text-brand-500" strokeWidth={2.5} />
                  </motion.div>
                )}
              </button>
            </div>

            {/* Save button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon="Heart"
              loading={isSaving}
              onClick={handleSave}
            >
              Eintrag speichern
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation (not on save step) */}
      {currentStep !== 'save' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="fixed bottom-24 lg:bottom-8 left-0 right-0 px-4 z-30"
        >
          <div className="max-w-lg mx-auto">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              iconRight="ChevronRight"
              disabled={!canProceed()}
              onClick={handleNext}
            >
              {currentStep === 'milestone' ? 'Weiter zur Zusammenfassung' : 'Weiter'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
