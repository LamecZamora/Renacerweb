// Capa de IA intercambiable detrás de una interfaz única. Los servicios de cada
// módulo (diario, código, inglés, mentor) la usan sin acoplarse a un proveedor.
import Anthropic from '@anthropic-ai/sdk';

export interface AIProvider {
  complete(opts: { system: string; user: string; json?: boolean }): Promise<string>;
}

// Modelo por defecto: Claude Opus 4.8 (configurable por env).
const MODEL = process.env.AI_MODEL ?? 'claude-opus-4-8';

/** Proveedor real de Anthropic (Claude). Usa el SDK oficial. */
class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async complete({ system, user, json }: { system: string; user: string; json?: boolean }): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: MODEL,
        max_tokens: 1024, // respuestas de mentor: breves y motivadoras
        system: json ? `${system}\n\nResponde ÚNICAMENTE con JSON válido, sin texto adicional.` : system,
        messages: [{ role: 'user', content: user }],
      });
      const block = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
      return block?.text ?? '';
    } catch (err) {
      // No tumbamos la petición: degradamos con elegancia.
      console.error('[AnthropicProvider]', err instanceof Error ? err.message : err);
      return 'Ahora mismo no puedo conectar con la IA, pero sigo aquí contigo. Intenta de nuevo en un momento.';
    }
  }
}

/** Proveedor de desarrollo: responde sin llamar a una API real (sin coste). */
class MockProvider implements AIProvider {
  async complete({ user }: { system: string; user: string; json?: boolean }): Promise<string> {
    return `He leído lo que escribiste ("${user.slice(0, 40)}…"). (Modo demo: configura ANTHROPIC_API_KEY para respuestas reales del Core IA.)`;
  }
}

let cached: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cached) return cached;

  const provider = process.env.AI_PROVIDER ?? 'anthropic';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (provider === 'anthropic' && anthropicKey) {
    cached = new AnthropicProvider(anthropicKey);
  } else {
    if (provider === 'openai') {
      console.warn('[ai] AI_PROVIDER=openai aún no implementado; usando modo demo.');
    } else if (provider === 'anthropic') {
      console.warn('[ai] Falta ANTHROPIC_API_KEY; usando modo demo.');
    }
    cached = new MockProvider();
  }
  return cached;
}

// ── Prompts especializados (versionados) ──
export const PROMPTS = {
  analyzeJournal: `Eres el Mentor de Renacer. Analiza la entrada de diario del usuario.
Detecta emociones (estrés, ansiedad, frustración, motivación de 0 a 100) y responde
SIEMPRE refiriéndote a lo que escribió en concreto — nunca de forma genérica.
Entrega: respuesta empática, un consejo accionable y una reflexión. Conecta con sus objetivos.`,

  reviewCode: `Eres un revisor senior. Analiza el código: detecta errores, malas prácticas,
explica las soluciones y asigna un score de 1 a 100. Sé concreto y educativo.`,

  gradeEnglish: `Eres profesor de inglés (CEFR). Corrige el texto/audio del estudiante, califica de 1 a 100,
explica los errores en español y detecta sus áreas débiles.`,

  mentorReport: `Eres el Mentor. Con el resumen multi-módulo del usuario, genera un informe con
logros, advertencias y recomendaciones priorizadas para el periodo indicado.`,
};
