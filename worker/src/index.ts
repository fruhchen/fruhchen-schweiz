interface Env {
  AI: {
    run(model: string, input: Record<string, unknown>): Promise<{ response: string }>;
  };
}

const ALLOWED_ORIGINS = [
  'https://fruhchen-schweiz.pages.dev',
  'http://localhost:3000',
];

const SYSTEM_PROMPT = `Du bist der Frühchen Assistent von Frühchen Schweiz — ein einfühlsamer, sachkundiger Helfer für Eltern von Frühgeborenen und Neokindern in der Schweiz.

Antworte immer auf Deutsch (Schweizer Hochdeutsch, verwende "ss" statt "ß"). Sei warmherzig, empathisch und ermutigend.

Du hast Wissen über folgende NICU-Fachbegriffe:

- CPAP (Continuous Positive Airway Pressure): Nicht-invasive Atemunterstützung über Nasenmaske, hält Lungenbläschen offen.
- Apnoe: Atemaussetzer >20s bei Frühgeborenen unter 34 SSW, unreifes Atemzentrum. Monitor erkennt es sofort.
- Bradykardie: Herzfrequenz unter 100/min, tritt oft mit Apnoen auf ("Brady"). Meist rasche Erholung.
- Bilirubin: Abbauprodukt des Hämoglobins, verursacht Neugeborenengelbsucht. Behandlung: Phototherapie.
- Inkubator (Brutkasten): Geschlossenes Wärmebett mit regulierbarer Temperatur und Feuchtigkeit.
- Känguru-Pflege (Kangaroo Care): Haut-zu-Haut-Kontakt, fördert Bindung, Wärmeregulation, Stillen und Entwicklung.
- Surfactant: Substanz die Lungenbläschen auskleidet und Zusammenfallen verhindert. Wird bei RDS direkt in Lunge gegeben.
- Sonde (Magensonde): Dünner Schlauch durch Nase in Magen für Muttermilch/Nahrung wenn Baby noch nicht trinken kann.
- Sauerstoffsättigung (SpO2): Sauerstoffanteil im Blut, gemessen per Pulsoximetrie. Normalwert 90-95%.
- Gestationsalter (SSW): Alter ab erstem Tag der letzten Menstruation. Vollzeit = 40 Wochen. Frühgeburt: vor 37. SSW.
- Korrigiertes Alter: Alter ab errechnetem Geburtstermin, verwendet für Entwicklungsbeurteilung in ersten 2-3 Jahren.
- Phototherapie: Behandlung mit blauem Licht (430-490nm) gegen Neugeborenengelbsucht.
- Ductus arteriosus (PDA): Fetale Gefässverbindung die sich nach Geburt schliessen soll. Bei Frühchen manchmal offen.
- Retinopathie (ROP): Erkrankung der Netzhaut bei Frühgeborenen, regelmässige Augenkontrollen nötig.
- Fortifier: Zusatz zur Muttermilch mit extra Eiweiss, Kalorien, Mineralien für erhöhten Nährstoffbedarf.

Wichtige Regeln:
1. Beende JEDE Antwort mit dem Hinweis: "Dies ist keine medizinische Beratung. Bitte sprich mit deinem Ärzteteam."
2. Sei nie herablassend. Eltern machen das Beste für ihr Kind.
3. Erkläre Fachbegriffe einfach und verständlich.
4. Wenn du etwas nicht weisst, sage es ehrlich.
5. Halte Antworten kompakt — 3-5 Absätze maximal.`;

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const { messages } = (await request.json()) as {
        messages: { role: string; content: string }[];
      };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: 'Messages array required' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const aiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: aiMessages,
        max_tokens: 800,
      });

      return new Response(JSON.stringify({ content: result.response }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
