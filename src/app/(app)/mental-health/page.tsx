'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';

const SELF_CHECK_QUESTIONS = [
  'Wie fühlst du dich heute insgesamt?',
  'Hast du in den letzten Tagen gut geschlafen?',
  'Fühlst du dich emotional unterstützt?',
  'Kannst du Momente der Ruhe finden?',
  'Hast du Freude an kleinen Dingen?',
];

const RESOURCES = [
  {
    title: 'Die Dargebotene Hand',
    phone: '143',
    description: 'Telefonseelsorge, 24/7 erreichbar, mehrsprachig',
    icon: 'Phone',
    color: 'rose',
    urgent: true,
  },
  {
    title: 'Pro Mente Sana',
    phone: '0848 800 858',
    description: 'Beratung zu psychischer Gesundheit',
    icon: 'Heart',
    color: 'violet',
    urgent: false,
  },
  {
    title: 'Elternnotruf',
    phone: '0848 35 45 55',
    description: 'Hilfe und Beratung für Eltern in Krisen, 24/7',
    icon: 'Users',
    color: 'brand',
    urgent: true,
  },
  {
    title: 'Postpartale Depression Schweiz',
    phone: null,
    description: 'Information und Selbsthilfe bei postpartaler Depression',
    icon: 'Flower2',
    color: 'teal',
    urgent: false,
  },
];

const ARTICLES = [
  {
    title: 'Gefühle zulassen auf der Neonatologie',
    description: 'Es ist normal, eine Achterbahn der Gefühle zu erleben. So gehst du damit um.',
    category: 'Verarbeitung',
    readTime: '5 Min.',
  },
  {
    title: 'Selbstfürsorge für Eltern auf der NICU',
    description: 'Du kannst nur für dein Kind da sein, wenn du auch für dich sorgst.',
    category: 'Selbstfürsorge',
    readTime: '4 Min.',
  },
  {
    title: 'Wenn der Partner anders trauert',
    description: 'Jeder verarbeitet die Situation anders. So bleibt ihr als Paar stark.',
    category: 'Partnerschaft',
    readTime: '6 Min.',
  },
  {
    title: 'Geschwister einbeziehen',
    description: 'Wie du älteren Geschwistern die Situation altersgerecht erklärst.',
    category: 'Familie',
    readTime: '4 Min.',
  },
];

export default function MentalHealthPage() {
  const [checkStarted, setCheckStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<(typeof ARTICLES)[number] | null>(null);
  const [selectedResource, setSelectedResource] = useState<(typeof RESOURCES)[number] | null>(null);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentQuestion < SELF_CHECK_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCheckStarted(false);
    }
  };

  const averageMood = answers.length > 0 ? answers.reduce((a, b) => a + b, 0) / answers.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wohlbefinden"
        subtitle="Dein seelisches Wohlbefinden ist genauso wichtig"
      />

      {/* Mood check or results */}
      {!checkStarted && answers.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-violet-50 to-rose-50 border-violet-200/50 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-soft flex items-center justify-center mx-auto">
              <Icon name="Brain" size={28} className="text-violet-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Wie geht es dir?</h2>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Ein kurzer Check-in hilft dir, dein Befinden einzuordnen.
              Das ist keine Diagnose — nur ein Moment für dich.
            </p>
            <Button variant="primary" onClick={() => setCheckStarted(true)}>
              Check-in starten
            </Button>
          </Card>
        </motion.div>
      )}

      {checkStarted && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="text-center space-y-6">
            <div className="flex justify-center gap-1 mb-2">
              {SELF_CHECK_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= currentQuestion ? 'bg-violet-500 w-8' : 'bg-gray-200 w-4'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">Frage {currentQuestion + 1} von {SELF_CHECK_QUESTIONS.length}</p>
            <h2 className="text-xl font-semibold text-gray-900">
              {SELF_CHECK_QUESTIONS[currentQuestion]}
            </h2>
            <div className="flex justify-center gap-3">
              {[
                { value: 1, emoji: '😢', label: 'Gar nicht' },
                { value: 2, emoji: '😔', label: 'Wenig' },
                { value: 3, emoji: '😐', label: 'Mittel' },
                { value: 4, emoji: '😊', label: 'Gut' },
                { value: 5, emoji: '😄', label: 'Sehr gut' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-xs text-gray-500">{option.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {!checkStarted && answers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50 text-center space-y-3">
            <span className="text-4xl">{averageMood >= 4 ? '😊' : averageMood >= 3 ? '😐' : '💛'}</span>
            <h3 className="font-semibold text-gray-900">Danke für dein Check-in</h3>
            <p className="text-sm text-gray-600">
              {averageMood >= 4
                ? 'Es scheint dir gut zu gehen. Das freut uns!'
                : averageMood >= 3
                ? 'Es klingt, als hättest du gute und schwierige Momente. Das ist völlig normal.'
                : 'Es klingt, als wäre es gerade besonders schwer. Du bist nicht allein.'}
            </p>
            {averageMood < 3 && (
              <Button variant="primary" icon="Phone" size="sm">
                Mit jemandem sprechen
              </Button>
            )}
          </Card>
        </motion.div>
      )}

      {/* Crisis resources */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Soforthilfe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RESOURCES.map((resource, i) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card
                interactive
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setSelectedResource(resource)}
              >
                <div className={`w-10 h-10 rounded-xl bg-${resource.color}-100 flex items-center justify-center flex-shrink-0`}>
                  <Icon name={resource.icon as any} size={20} className={`text-${resource.color}-500`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 text-sm">{resource.title}</h3>
                    {resource.urgent && <Badge variant="rose">24/7</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone.replace(/\s/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 mt-1"
                    >
                      <Icon name="Phone" size={14} />
                      {resource.phone}
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Wissenswertes</h2>
        <div className="space-y-3">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + 0.05 * i }}
            >
              <Card
                interactive
                className="cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="violet">{article.category}</Badge>
                  <span className="text-xs text-gray-400">{article.readTime}</span>
                </div>
                <h3 className="font-medium text-gray-900">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{article.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article detail modal */}
      <Modal
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title ?? ''}
        size="md"
      >
        {selectedArticle && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="violet">{selectedArticle.category}</Badge>
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Icon name="Clock" size={14} />
                {selectedArticle.readTime}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{selectedArticle.description}</p>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Dieser Artikel wird in Kürze vollständig verfügbar sein. Lesezeit: {selectedArticle.readTime}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Resource detail modal */}
      <Modal
        open={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        title={selectedResource?.title ?? ''}
        size="md"
      >
        {selectedResource && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-${selectedResource.color}-100 flex items-center justify-center`}>
                <Icon name={selectedResource.icon as any} size={24} className={`text-${selectedResource.color}-500`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedResource.title}</h3>
                {selectedResource.urgent && <Badge variant="rose">24/7 erreichbar</Badge>}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{selectedResource.description}</p>
            {selectedResource.phone && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Telefonnummer</p>
                <a
                  href={`tel:${selectedResource.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl font-semibold text-sm hover:bg-brand-100 transition-colors"
                >
                  <Icon name="Phone" size={16} />
                  {selectedResource.phone}
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
