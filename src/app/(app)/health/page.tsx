'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { PageHeader } from '@/components/layout/page-header';
import { Modal } from '@/components/ui/modal';

const CATEGORIES = [
  { id: 'all', label: 'Alle', icon: 'LayoutGrid', count: 18 },
  { id: 'breathing', label: 'Atmung', icon: 'Wind', count: 4 },
  { id: 'nutrition', label: 'Ernährung', icon: 'Droplets', count: 5 },
  { id: 'development', label: 'Entwicklung', icon: 'TrendingUp', count: 3 },
  { id: 'parents', label: 'Für Eltern', icon: 'Heart', count: 4 },
  { id: 'pregnancy', label: 'Schwangerschaft', icon: 'Baby', count: 2 },
];

const ARTICLES = [
  {
    id: '1',
    title: 'BPD — Bronchopulmonale Dysplasie',
    excerpt: 'Was BPD bedeutet, wie es behandelt wird und was Eltern wissen sollten.',
    category: 'breathing',
    readTime: '8 Min.',
    featured: true,
  },
  {
    id: '2',
    title: 'Stillen von Frühgeborenen',
    excerpt: 'Ein umfassender Leitfaden zum Stillen und Abpumpen für Frühchen-Mamas.',
    category: 'nutrition',
    readTime: '12 Min.',
    featured: true,
  },
  {
    id: '3',
    title: 'Das Schmerzkonzept in der Neonatologie',
    excerpt: 'Wie Schmerzen bei Neugeborenen erkannt und behandelt werden.',
    category: 'development',
    readTime: '6 Min.',
    featured: false,
  },
  {
    id: '4',
    title: 'Parenterale Ernährung',
    excerpt: 'Intravenöse Ernährung in den ersten Lebenstagen — was Eltern wissen sollten.',
    category: 'nutrition',
    readTime: '5 Min.',
    featured: false,
  },
  {
    id: '5',
    title: 'Verarbeitung der Neozeit',
    excerpt: 'Psychische Gesundheit nach einer Frühgeburt — Verarbeitung und Unterstützung.',
    category: 'parents',
    readTime: '10 Min.',
    featured: true,
  },
  {
    id: '6',
    title: 'Gesunde Schwangerschaft nach Frühgeburt',
    excerpt: 'Was du bei einer erneuten Schwangerschaft beachten solltest.',
    category: 'pregnancy',
    readTime: '7 Min.',
    featured: false,
  },
  {
    id: '7',
    title: 'Känguru-Pflege: Alles was du wissen musst',
    excerpt: 'Skin-to-Skin-Kontakt ist einer der wichtigsten Schritte für Frühgeborene.',
    category: 'development',
    readTime: '6 Min.',
    featured: false,
  },
  {
    id: '8',
    title: 'Sauerstofftherapie verstehen',
    excerpt: 'Warum dein Baby möglicherweise zusätzlichen Sauerstoff braucht.',
    category: 'breathing',
    readTime: '5 Min.',
    featured: false,
  },
  {
    id: '9',
    title: 'Fortifier und Zusatznahrung',
    excerpt: 'Warum Muttermilch manchmal angereichert wird und was das bedeutet.',
    category: 'nutrition',
    readTime: '4 Min.',
    featured: false,
  },
  {
    id: '10',
    title: 'Rechte als Eltern auf der Neonatologie',
    excerpt: 'Deine Rechte, dein Mitspracherecht und wichtige Anlaufstellen.',
    category: 'parents',
    readTime: '5 Min.',
    featured: false,
  },
];

const EXPERIENCE_REPORTS = [
  { title: 'Emma, geboren in der 25. SSW', weeks: 25, type: 'Einling' },
  { title: 'Liam & Noah, Zwillinge, 28. SSW', weeks: 28, type: 'Zwillinge' },
  { title: 'Mia, 32. SSW, pränatale Diagnose', weeks: 32, type: 'Pränatal' },
  { title: 'Ben, 30. SSW, VLBW', weeks: 30, type: 'Einling' },
];

export default function HealthPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<(typeof ARTICLES)[number] | null>(null);

  const filtered = ARTICLES.filter((a) => {
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredArticles = ARTICLES.filter((a) => a.featured);

  const getCategoryLabel = (categoryId: string) =>
    CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wissenswertes"
        subtitle="Verständliche Informationen rund um Frühgeburt und Neonatologie"
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Themen durchsuchen..." />

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            <Icon name={cat.icon as any} size={14} />
            {cat.label}
            <span className={`text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Featured (only when showing all) */}
      {activeCategory === 'all' && !search && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Empfohlen</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            {featuredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="min-w-[280px] max-w-[300px]"
              >
                <Card
                  interactive
                  className="h-full space-y-2 cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="h-24 -mx-6 -mt-6 rounded-t-3xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-brand-400" />
                  </div>
                  <Badge variant="brand">{article.readTime}</Badge>
                  <h3 className="font-semibold text-gray-900 text-sm">{article.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Articles list */}
      <div className="space-y-3">
        {activeCategory !== 'all' || search ? (
          <h2 className="text-lg font-semibold text-gray-900">
            {search ? `Ergebnisse für "${search}"` : CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </h2>
        ) : (
          <h2 className="text-lg font-semibold text-gray-900">Alle Artikel</h2>
        )}
        {filtered.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
          >
            <Card
              interactive
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="FileText" size={18} className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{article.excerpt}</p>
                <span className="text-xs text-gray-400 mt-1 inline-block">{article.readTime}</span>
              </div>
              <Icon name="ChevronRight" size={16} className="text-gray-300 flex-shrink-0 mt-3" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Experience reports */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Erfahrungsberichte</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXPERIENCE_REPORTS.map((report, i) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + 0.05 * i }}
            >
              <Card interactive className="flex items-center gap-3" padding="sm">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-rose-500">{report.weeks}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{report.title}</h3>
                  <Badge variant="violet" className="mt-1">{report.type}</Badge>
                </div>
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
              <Badge variant="brand">{getCategoryLabel(selectedArticle.category)}</Badge>
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Icon name="Clock" size={14} />
                {selectedArticle.readTime}
              </span>
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center">
              <Icon name="FileText" size={36} className="text-brand-400" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{selectedArticle.excerpt}</p>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Dieser Artikel wird in Kürze vollständig verfügbar sein. Lesezeit: {selectedArticle.readTime}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
