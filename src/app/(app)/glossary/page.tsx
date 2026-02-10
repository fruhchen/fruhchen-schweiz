'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { PageHeader } from '@/components/layout/page-header';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = 'Atmung' | 'Ernaehrung' | 'Entwicklung' | 'Diagnostik' | 'Pflege' | 'Medikamente';

interface GlossaryTerm {
  id: string;
  term: string;
  subtitle?: string;
  category: Category;
  definition: string;
  simpleExplanation: string;
  relatedTerms: string[];
}

// ---------------------------------------------------------------------------
// Category colour mapping (matches Badge variants)
// ---------------------------------------------------------------------------

const categoryBadgeVariant: Record<Category, 'brand' | 'violet' | 'teal' | 'rose' | 'green' | 'blue'> = {
  Atmung: 'brand',
  Ernaehrung: 'teal',
  Entwicklung: 'violet',
  Diagnostik: 'blue',
  Pflege: 'rose',
  Medikamente: 'green',
};

const categoryLabel: Record<Category, string> = {
  Atmung: 'Atmung',
  Ernaehrung: 'Ernaehrung',
  Entwicklung: 'Entwicklung',
  Diagnostik: 'Diagnostik',
  Pflege: 'Pflege',
  Medikamente: 'Medikamente',
};

// ---------------------------------------------------------------------------
// Mock data -- 15 realistic NICU terms
// ---------------------------------------------------------------------------

const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'cpap',
    term: 'CPAP',
    subtitle: 'Continuous Positive Airway Pressure',
    category: 'Atmung',
    definition:
      'Eine nicht-invasive Atemunterstuetzung, bei der ein kontinuierlicher positiver Druck ueber eine Nasenmaske oder -brille auf die Atemwege des Babys ausgeubt wird, um die Lungen offen zu halten.',
    simpleExplanation:
      'Eine sanfte Atemhilfe: Ueber eine kleine Maske oder Nasenstuecke wird leichter Luftdruck in die Lunge Ihres Babys geblasen. Das hilft, die winzigen Lungenblaeschen offen zu halten, damit Ihr Baby leichter atmen kann. Ihr Baby atmet dabei selbst -- die Maschine hilft nur mit.',
    relatedTerms: ['Surfactant', 'Sauerstoffsaettigung (SpO2)', 'Apnoe'],
  },
  {
    id: 'apnoe',
    term: 'Apnoe',
    subtitle: 'Atemaussetzer',
    category: 'Atmung',
    definition:
      'Ein voruebergehender Atemstillstand von mehr als 20 Sekunden oder kuerzer mit begleitender Bradykardie oder Zyanose. Haeufig bei Fruehgeborenen unter 34 SSW aufgrund der Unreife des Atemzentrums.',
    simpleExplanation:
      'Manchmal vergisst Ihr Baby kurz zu atmen -- das ist bei Fruehchen ganz normal und liegt daran, dass das Gehirn noch lernt, die Atmung zu steuern. Die Monitore auf der Station erkennen das sofort und die Pflegekraefte reagieren schnell. Meistens reicht eine sanfte Beruehrung und Ihr Baby atmet von selbst wieder.',
    relatedTerms: ['Bradykardie', 'CPAP', 'Sauerstoffsaettigung (SpO2)'],
  },
  {
    id: 'bradykardie',
    term: 'Bradykardie',
    subtitle: 'Verlangsamter Herzschlag',
    category: 'Atmung',
    definition:
      'Eine Verlangsamung der Herzfrequenz unter 100 Schlaege pro Minute beim Neugeborenen. Tritt haeufig zusammen mit Apnoen auf und wird als "Brady" bezeichnet.',
    simpleExplanation:
      'Wenn das Herz Ihres Babys kurzzeitig etwas langsamer schlaegt als normal. Das passiert oft zusammen mit Atempausen. Die Schwestern nennen das liebevoll "Brady". Der Monitor piepst dann, aber meistens erholt sich Ihr Baby ganz schnell von allein oder mit einer sanften Beruehrung.',
    relatedTerms: ['Apnoe', 'Sauerstoffsaettigung (SpO2)'],
  },
  {
    id: 'bilirubin',
    term: 'Bilirubin',
    subtitle: 'Gelbsucht-Wert',
    category: 'Diagnostik',
    definition:
      'Ein Abbauprodukt des roten Blutfarbstoffs Haemoglobin. Erhoehte Werte fuehren zur Neugeborenengelbsucht (Ikterus neonatorum) mit gelblicher Verfaerbung der Haut.',
    simpleExplanation:
      'Wenn rote Blutkoerperchen abgebaut werden, entsteht ein gelber Farbstoff. Bei Babys kann die Leber diesen Stoff noch nicht so gut verarbeiten, deshalb kann die Haut gelblich werden. Das ist sehr haeufig und wird mit speziellem Licht (Phototherapie) behandelt.',
    relatedTerms: ['Phototherapie'],
  },
  {
    id: 'inkubator',
    term: 'Inkubator',
    subtitle: 'Brutkasten',
    category: 'Pflege',
    definition:
      'Ein geschlossenes Waermebett mit regulierbarer Temperatur, Luftfeuchtigkeit und Sauerstoffzufuhr. Schuetzt das Fruehgeborene vor Waermeverlust, Infektionen und aeusseren Reizen.',
    simpleExplanation:
      'Ein warmes, geschuetztes Bettchen aus durchsichtigem Kunststoff -- wie ein kleines Gewaechshaus fuer Ihr Baby. Darin ist es immer schoen warm und feucht, so wie es im Bauch war. Sie koennen Ihr Baby durch Oeffnungen an der Seite beruehren und streicheln.',
    relatedTerms: ['Kaenguru-Pflege'],
  },
  {
    id: 'kaenguru-pflege',
    term: 'Kaenguru-Pflege',
    subtitle: 'Kangaroo Care',
    category: 'Pflege',
    definition:
      'Haut-zu-Haut-Kontakt zwischen Elternteil und Fruehgeborenem. Das Baby liegt nur mit Windel bekleidet auf der nackten Brust. Foerdert Bindung, Waermeregulation, Stillen und Entwicklung.',
    simpleExplanation:
      'Ihr Baby liegt nur mit Windel direkt auf Ihrer nackten Brust, Haut an Haut. Das ist eines der besten Dinge, die Sie fuer Ihr Fruehchen tun koennen! Ihr Baby hoert Ihren Herzschlag, riecht Sie und fuehlt sich sicher. Es hilft bei der Entwicklung, beim Wachstum und staerkt eure Bindung.',
    relatedTerms: ['Inkubator'],
  },
  {
    id: 'surfactant',
    term: 'Surfactant',
    category: 'Medikamente',
    definition:
      'Eine oberflaechenaktive Substanz, die die Alveolen (Lungenblaeschen) auskleidet und deren Zusammenfallen verhindert. Wird bei Atemnotsyndrom (RDS) direkt in die Lunge verabreicht.',
    simpleExplanation:
      'Eine Art "Seife" fuer die Lunge: Normalerweise stellt die Lunge diesen Stoff selbst her, damit die winzigen Lungenblaeschen nicht zusammenkleben. Fruehchen haben davon oft noch zu wenig. Das Medikament wird ueber einen kleinen Schlauch direkt in die Lunge gegeben und hilft Ihrem Baby sofort besser zu atmen.',
    relatedTerms: ['CPAP', 'Sauerstoffsaettigung (SpO2)'],
  },
  {
    id: 'sonde',
    term: 'Sonde',
    subtitle: 'Magensonde / Ernaehrungssonde',
    category: 'Ernaehrung',
    definition:
      'Ein duenner, flexibler Schlauch, der durch Nase oder Mund in den Magen gefuehrt wird, um Muttermilch oder Spezialnahrung direkt zuzufuehren, wenn das Baby noch nicht selbst trinken kann.',
    simpleExplanation:
      'Ein winzig duenner, weicher Schlauch, der ueber die Nase in den Magen Ihres Babys fuehrt. Darueber bekommt Ihr Baby Ihre Muttermilch oder spezielle Nahrung, weil es noch zu klein ist, um selbst zu trinken. Das sieht vielleicht beaengstigend aus, tut Ihrem Baby aber nicht weh.',
    relatedTerms: ['Fortifier', 'Kaenguru-Pflege'],
  },
  {
    id: 'spo2',
    term: 'Sauerstoffsaettigung',
    subtitle: 'SpO2',
    category: 'Diagnostik',
    definition:
      'Der Anteil des mit Sauerstoff beladenen Haemoglobins im Blut, gemessen per Pulsoximetrie. Normalwert bei Fruehgeborenen: 90-95%. Wird kontinuierlich ueberwacht.',
    simpleExplanation:
      'Zeigt an, wie viel Sauerstoff im Blut Ihres Babys ist. Gemessen wird das mit einem kleinen Licht-Sensor, der am Fuss oder an der Hand Ihres Babys befestigt ist -- wie ein kleines Pflaesterchen mit rotem Licht. Die Zahl auf dem Monitor sollte meist zwischen 90 und 95 sein.',
    relatedTerms: ['CPAP', 'Apnoe', 'Bradykardie'],
  },
  {
    id: 'gestationsalter',
    term: 'Gestationsalter',
    subtitle: 'Schwangerschaftswochen (SSW)',
    category: 'Entwicklung',
    definition:
      'Das Alter des Kindes berechnet ab dem ersten Tag der letzten Menstruation. Ein Vollzeitalter entspricht 40 Wochen. Fruehgeburt: vor vollendeter 37. SSW.',
    simpleExplanation:
      'Wie viele Wochen Ihr Baby insgesamt im Bauch war. Eine normale Schwangerschaft dauert 40 Wochen. Wenn Aerzte sagen, Ihr Baby wurde in der 28. Woche geboren, war es 12 Wochen zu frueh. Diese Zahl ist wichtig, weil sie den Aerzten sagt, welche Organe schon wie weit entwickelt sind.',
    relatedTerms: ['Korrigiertes Alter'],
  },
  {
    id: 'korrigiertes-alter',
    term: 'Korrigiertes Alter',
    category: 'Entwicklung',
    definition:
      'Das Alter des Kindes, berechnet ab dem errechneten Geburtstermin (nicht dem tatsaechlichen Geburtsdatum). Wird fuer Entwicklungsbeurteilungen in den ersten 2-3 Lebensjahren verwendet.',
    simpleExplanation:
      'Stellen Sie sich vor, Ihr Baby waere zum errechneten Termin geboren worden -- das korrigierte Alter zaehlt ab diesem Datum. Wenn Ihr Baby 4 Monate alt ist, aber 2 Monate zu frueh kam, ist sein korrigiertes Alter 2 Monate. Das ist wichtig, weil man Entwicklungsschritte danach beurteilt.',
    relatedTerms: ['Gestationsalter'],
  },
  {
    id: 'phototherapie',
    term: 'Phototherapie',
    subtitle: 'Lichttherapie',
    category: 'Diagnostik',
    definition:
      'Behandlung der Neugeborenengelbsucht durch Bestrahlung mit blauem Licht (Wellenlaenge 430-490 nm). Das Licht wandelt das Bilirubin in der Haut in eine wasserloesliche Form um, die ausgeschieden werden kann.',
    simpleExplanation:
      'Ihr Baby liegt unter einer speziellen blauen Lampe (manchmal auch auf einer leuchtenden Matte). Das blaue Licht hilft, den gelben Farbstoff in der Haut abzubauen. Ihr Baby traegt dabei eine kleine Augenmaske zum Schutz. Die Behandlung tut nicht weh und dauert meist nur wenige Tage.',
    relatedTerms: ['Bilirubin'],
  },
  {
    id: 'ductus-arteriosus',
    term: 'Ductus arteriosus',
    subtitle: 'PDA (Persistierender Ductus arteriosus)',
    category: 'Diagnostik',
    definition:
      'Eine fetale Gefaessverbindung zwischen Aorta und Lungenarterie, die sich normalerweise nach der Geburt schliesst. Bei Fruehgeborenen kann sie offen bleiben (PDA) und muss ggf. medikamentoes oder chirurgisch verschlossen werden.',
    simpleExplanation:
      'Im Mutterleib gibt es eine kleine Verbindung zwischen zwei grossen Blutgefaessen, weil das Baby dort noch nicht ueber die Lunge atmet. Nach der Geburt schliesst sich diese Verbindung normalerweise von selbst. Bei Fruehchen bleibt sie manchmal offen. Dann kann ein Medikament helfen, sie zu schliessen.',
    relatedTerms: ['Gestationsalter'],
  },
  {
    id: 'retinopathie',
    term: 'Retinopathie',
    subtitle: 'ROP (Retinopathy of Prematurity)',
    category: 'Diagnostik',
    definition:
      'Eine Erkrankung der Netzhaut bei Fruehgeborenen, bei der die Blutgefaesse der Netzhaut nicht normal ausreifen. Regelmaessige augenarztliche Kontrollen sind bei Fruehgeborenen unter 32 SSW oder unter 1500g erforderlich.',
    simpleExplanation:
      'Die Blutgefaesse im Auge Ihres Babys sind noch nicht fertig gewachsen. Ein Augenarzt schaut regelmaessig nach, ob sich alles normal entwickelt. In den meisten Faellen heilt es von allein. Selten braucht es eine Behandlung. Die Untersuchung ist kurz und Ihr Baby wird gut betreut.',
    relatedTerms: ['Gestationsalter', 'Sauerstoffsaettigung'],
  },
  {
    id: 'fortifier',
    term: 'Fortifier',
    subtitle: 'Muttermilchverstaerker',
    category: 'Ernaehrung',
    definition:
      'Ein Zusatz zur Muttermilch, der zusaetzliches Eiweiss, Kalorien, Mineralien und Vitamine liefert, um den erhoehten Naehrstoffbedarf von Fruehgeborenen zu decken.',
    simpleExplanation:
      'Ein Pulver, das der Muttermilch beigemischt wird, um sie nahrhafter zu machen. Fruehchen brauchen extra viel Energie und Naehrstoffe zum Wachsen. Ihre Muttermilch ist schon das Beste fuer Ihr Baby -- der Fortifier macht sie sozusagen zu "Supermilch".',
    relatedTerms: ['Sonde'],
  },
];

// ---------------------------------------------------------------------------
// Category pill list (including "Alle")
// ---------------------------------------------------------------------------

const allCategories: Array<Category | 'Alle'> = [
  'Alle',
  'Atmung',
  'Ernaehrung',
  'Entwicklung',
  'Diagnostik',
  'Pflege',
  'Medikamente',
];

const categoryDisplayLabel: Record<Category | 'Alle', string> = {
  Alle: 'Alle',
  Atmung: 'Atmung',
  Ernaehrung: 'Ernaehrung',
  Entwicklung: 'Entwicklung',
  Diagnostik: 'Diagnostik',
  Pflege: 'Pflege',
  Medikamente: 'Medikamente',
};

// ---------------------------------------------------------------------------
// AI Mock responses
// ---------------------------------------------------------------------------

const aiMockResponses: Record<string, string> = {
  cpap: 'CPAP ist eine Atemhilfe, die wie ein sanfter Wind funktioniert. Stellen Sie sich vor, Sie pusten leicht in einen Luftballon, damit er nicht zusammenfaellt -- genauso haelt CPAP die kleinen Lungenblaeschen Ihres Babys offen. Ihr Baby atmet selbstaendig, bekommt aber Unterstuetzung dabei. Die meisten Fruehchen brauchen das nur fuer eine begrenzte Zeit.',
  apnoe: 'Atempausen klingen beaengstigend, sind aber bei Fruehchen sehr haeufig. Das Atemzentrum im Gehirn ist einfach noch unreif -- wie ein Anfaenger, der noch ueben muss. Die Monitore erkennen jede Pause sofort. Mit der Zeit wird das immer seltener, versprochen!',
  bradykardie: 'Ein "Brady" bedeutet, dass das Herz kurz langsamer schlaegt. Das passiert oft, wenn das Baby auch kurz aufhoert zu atmen. Es klingt der Alarm, aber bleiben Sie ruhig: Meistens erholt sich Ihr Baby innerhalb weniger Sekunden. Die Pflegekraefte kennen das gut.',
};

const defaultAiResponse =
  'Das ist ein wichtiger medizinischer Begriff auf der Neonatologie. Sprechen Sie gerne mit Ihrem Aerzteteam darueber -- sie erklaeren Ihnen alles in Ruhe und beantworten Ihre Fragen. Sie sind nicht allein!';

// ---------------------------------------------------------------------------
// Framer Motion variants
// ---------------------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.97 },
};

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Alle'>('Alle');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const [aiOpenFor, setAiOpenFor] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  // ---- Filtering logic ----
  const filteredTerms = glossaryTerms.filter((t) => {
    const matchesCategory = activeCategory === 'Alle' || t.category === activeCategory;
    if (!search.trim()) return matchesCategory;
    const q = search.toLowerCase();
    return (
      matchesCategory &&
      (t.term.toLowerCase().includes(q) ||
        (t.subtitle?.toLowerCase().includes(q) ?? false) ||
        t.definition.toLowerCase().includes(q) ||
        t.simpleExplanation.toLowerCase().includes(q))
    );
  });

  // Group by first letter
  const grouped = filteredTerms.reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});
  const sortedLetters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'de'));

  // ---- Handlers ----
  const toggleExpand = (id: string) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAi = (id: string) => {
    setAiOpenFor((prev) => (prev === id ? null : id));
  };

  const showAudioToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const scrollToTerm = (termName: string) => {
    const target = glossaryTerms.find(
      (t) => t.term.toLowerCase() === termName.toLowerCase()
    );
    if (!target) return;
    // Make sure the category and search don't hide it
    setActiveCategory('Alle');
    setSearch('');
    // Wait for re-render, then scroll
    setTimeout(() => {
      const el = document.getElementById(`term-${target.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Briefly highlight
        el.classList.add('ring-2', 'ring-brand-400', 'ring-offset-2');
        setTimeout(() => el.classList.remove('ring-2', 'ring-brand-400', 'ring-offset-2'), 2000);
      }
    }, 100);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* ---- Header ---- */}
      <PageHeader
        title="Glossar"
        subtitle="Medizinische Fachbegriffe einfach erklaert"
      />

      {/* ---- AI Explain banner ---- */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-violet-50 via-brand-50 to-teal-50 border-violet-200/40">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-brand-400 flex items-center justify-center shadow-md">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">Frag die AI</p>
              <p className="text-xs text-gray-500">
                Tippen Sie bei einem Begriff auf das Sternsymbol fuer eine einfache Erklaerung
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ---- Search ---- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Begriff suchen..."
        />
      </motion.div>

      {/* ---- Category pills ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
      >
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {categoryDisplayLabel[cat]}
          </button>
        ))}
      </motion.div>

      {/* ---- Results count ---- */}
      <p className="text-sm text-gray-400">
        {filteredTerms.length} {filteredTerms.length === 1 ? 'Begriff' : 'Begriffe'} gefunden
      </p>

      {/* ---- Empty state ---- */}
      <AnimatePresence mode="wait">
        {filteredTerms.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Icon name="SearchX" size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Kein Begriff gefunden</p>
            <p className="text-sm text-gray-400 mt-1">
              Versuchen Sie einen anderen Suchbegriff oder waehlen Sie eine andere Kategorie
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Alphabetical sections ---- */}
      <div className="space-y-8">
        {sortedLetters.map((letter) => (
          <motion.section
            key={letter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Letter header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                <span className="text-brand-700 font-bold text-sm">{letter}</span>
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>

            {/* Term cards */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {grouped[letter].map((term, idx) => (
                  <motion.div
                    key={term.id}
                    id={`term-${term.id}`}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.04,
                      layout: { duration: 0.3 },
                    }}
                  >
                    <Card className="transition-all duration-300">
                      {/* Top row: term name, badge, action buttons */}
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-base">
                              {term.term}
                            </h3>
                            <Badge variant={categoryBadgeVariant[term.category]}>
                              {categoryLabel[term.category]}
                            </Badge>
                          </div>
                          {term.subtitle && (
                            <p className="text-sm text-gray-400 mb-2">{term.subtitle}</p>
                          )}
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {term.definition}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => showAudioToast()}
                            className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            title="Aussprache anhoeren"
                          >
                            <Icon name="Volume2" size={15} />
                          </button>
                          <button
                            onClick={() => toggleAi(term.id)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              aiOpenFor === term.id
                                ? 'bg-violet-100 text-violet-600'
                                : 'bg-gray-50 hover:bg-violet-50 text-gray-400 hover:text-violet-500'
                            }`}
                            title="Frag die AI"
                          >
                            <Icon name="Sparkles" size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Einfach erklaert toggle */}
                      <div className="mt-3">
                        <button
                          onClick={() => toggleExpand(term.id)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                        >
                          <motion.span
                            animate={{ rotate: expandedTerms.has(term.id) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center"
                          >
                            <Icon name="ChevronRight" size={16} />
                          </motion.span>
                          Einfach erklaert
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedTerms.has(term.id) && (
                            <motion.div
                              key={`simple-${term.id}`}
                              variants={expandVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 p-4 bg-warm-50 rounded-2xl border border-warm-200">
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 mt-0.5">
                                    <Icon name="Heart" size={16} className="text-rose-400" />
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {term.simpleExplanation}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* AI response bubble */}
                      <AnimatePresence initial={false}>
                        {aiOpenFor === term.id && (
                          <motion.div
                            key={`ai-${term.id}`}
                            variants={expandVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-4 bg-gradient-to-br from-violet-50 to-brand-50 rounded-2xl border border-violet-200/50">
                              <div className="flex items-start gap-2.5">
                                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-brand-400 flex items-center justify-center">
                                  <Icon name="Sparkles" size={14} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-violet-600 mb-1">
                                    AI-Erklaerung
                                  </p>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {aiMockResponses[term.id] ?? defaultAiResponse}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Related terms */}
                      {term.relatedTerms.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="text-xs text-gray-400 mr-1 self-center">Verwandt:</span>
                          {term.relatedTerms.map((rt) => (
                            <button
                              key={rt}
                              onClick={() => scrollToTerm(rt)}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                         bg-gray-50 text-gray-500 border border-gray-100
                                         hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200
                                         transition-all duration-200"
                            >
                              {rt}
                            </button>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        ))}
      </div>

      {/* ---- Audio toast ---- */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl shadow-lg text-sm font-medium">
              <Icon name="Volume2" size={16} />
              Audio kommt bald
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
