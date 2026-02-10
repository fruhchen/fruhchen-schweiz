'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { PageHeader } from '@/components/layout/page-header';

type MediaType = 'all' | 'video' | 'podcast' | 'webinar' | 'article';

const MEDIA_ITEMS = [
  {
    id: '1',
    title: 'Känguru-Pflege: Schritt für Schritt',
    type: 'video' as const,
    duration: '12:34',
    thumbnail: null,
    description: 'Ein sanfter Leitfaden für die ersten Känguru-Momente mit deinem Frühgeborenen.',
    category: 'Pflege',
    date: '2026-01-15',
    featured: true,
  },
  {
    id: '2',
    title: 'Podcast: Mein Weg als Frühchen-Mama',
    type: 'podcast' as const,
    duration: '45:00',
    thumbnail: null,
    description: 'Sandra erzählt von ihren Erfahrungen mit Zwillingen in der 27. SSW.',
    category: 'Erfahrungsberichte',
    date: '2026-01-28',
    featured: false,
  },
  {
    id: '3',
    title: 'Webinar: Entwicklungsförderung im 1. Lebensjahr',
    type: 'webinar' as const,
    duration: '60:00',
    thumbnail: null,
    description: 'Dr. med. Petra Huber erklärt Meilensteine und Fördermöglichkeiten.',
    category: 'Entwicklung',
    date: '2026-02-10',
    featured: false,
  },
  {
    id: '4',
    title: 'Stillen von Frühgeborenen — Was du wissen solltest',
    type: 'video' as const,
    duration: '18:22',
    thumbnail: null,
    description: 'Stillberaterin Anna Schmid erklärt Techniken und gibt praktische Tipps.',
    category: 'Stillen',
    date: '2026-02-01',
    featured: false,
  },
  {
    id: '5',
    title: 'Podcast: Väter in der Neonatologie',
    type: 'podcast' as const,
    duration: '38:15',
    thumbnail: null,
    description: 'Drei Väter sprechen über ihre Rolle und Erfahrungen auf der Neostation.',
    category: 'Erfahrungsberichte',
    date: '2026-01-20',
    featured: false,
  },
  {
    id: '6',
    title: 'Abpumpen: Routine und Tipps',
    type: 'video' as const,
    duration: '09:45',
    thumbnail: null,
    description: 'Praktische Anleitung für das Abpumpen in den ersten Wochen.',
    category: 'Stillen',
    date: '2026-02-05',
    featured: false,
  },
];

const TYPES: { value: MediaType; label: string; icon: string }[] = [
  { value: 'all', label: 'Alle', icon: 'LayoutGrid' },
  { value: 'video', label: 'Videos', icon: 'Play' },
  { value: 'podcast', label: 'Podcasts', icon: 'Headphones' },
  { value: 'webinar', label: 'Webinare', icon: 'Presentation' },
];

const typeColors = {
  video: 'rose',
  podcast: 'violet',
  webinar: 'teal',
  article: 'brand',
} as const;

const typeIcons = {
  video: 'Play',
  podcast: 'Headphones',
  webinar: 'Presentation',
  article: 'FileText',
} as const;

export default function MediaPage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<MediaType>('all');

  const filtered = MEDIA_ITEMS.filter((item) => {
    const matchesType = activeType === 'all' || item.type === activeType;
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const featuredItem = MEDIA_ITEMS.find((m) => m.featured);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medien & Wissen"
        subtitle="Videos, Podcasts, Webinare und Artikel"
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Medien durchsuchen..." />

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setActiveType(type.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeType === type.value
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
            }`}
          >
            <Icon name={type.icon as any} size={16} />
            {type.label}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featuredItem && activeType === 'all' && !search && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden p-0">
            <div className="relative h-48 bg-gradient-to-br from-rose-400 to-brand-500 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Icon name="Play" size={32} className="text-white ml-1" />
              </div>
              <Badge variant="brand" className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white border-0">
                Empfohlen
              </Badge>
              <span className="absolute bottom-4 right-4 text-white/80 text-sm bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                {featuredItem.duration}
              </span>
            </div>
            <div className="p-5">
              <Badge variant={typeColors[featuredItem.type]}>{featuredItem.type}</Badge>
              <h3 className="font-semibold text-gray-900 mt-2">{featuredItem.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{featuredItem.description}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Media grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered
          .filter((m) => !m.featured || activeType !== 'all' || search)
          .map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card interactive className="space-y-3">
                <div className="relative h-32 -mx-6 -mt-6 rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/80 shadow-soft flex items-center justify-center">
                    <Icon
                      name={typeIcons[item.type] as any}
                      size={20}
                      className={`text-${typeColors[item.type]}-500`}
                    />
                  </div>
                  <span className="absolute bottom-2 right-2 text-gray-600 text-xs bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
                    {item.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={typeColors[item.type]}>{item.type}</Badge>
                  <Badge variant="gray">{item.category}</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
