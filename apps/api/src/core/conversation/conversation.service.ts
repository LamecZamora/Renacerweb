import type { Memory } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { getAIProvider } from '../../lib/ai.js';

const PERSONA = `Eres MENTOR, el núcleo de RENACER AI: un acompañante de transformación personal
(físico, mental, académico y profesional). Hablas en español, cercano y motivador, pero directo.
SIEMPRE usas el contexto y la memoria del usuario; nunca respondes de forma genérica.`;

/** Construye el prompt de sistema con la memoria recuperada del usuario. */
function buildSystemPrompt(memories: Memory[]): string {
  if (!memories.length) return PERSONA;
  const ctx = memories.map((m) => `- (${m.kind}) ${m.content}`).join('\n');
  return `${PERSONA}\n\nMemoria relevante del usuario:\n${ctx}`;
}

/**
 * Motor de Conversación: compone la respuesta usando el AIProvider existente
 * (lib/ai.ts) + la memoria recuperada. No modifica lib/ai.ts.
 */
export async function generateReply(params: {
  memories: Memory[];
  history: { role: 'USER' | 'ASSISTANT' | 'SYSTEM'; content: string }[];
  userMessage: string;
}): Promise<string> {
  const ai = getAIProvider();
  const system = buildSystemPrompt(params.memories);
  const transcript = params.history
    .slice(-6)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');
  const user = `${transcript ? transcript + '\n' : ''}USER: ${params.userMessage}`;
  return ai.complete({ system, user });
}

/** Asegura una conversación (crea una nueva si no se pasa id). */
export async function ensureConversation(userId: string, conversationId?: string, channel: 'TEXT' | 'VOICE' = 'TEXT') {
  if (conversationId) {
    const existing = await prisma.conversation.findFirst({ where: { id: conversationId, userId } });
    if (existing) return existing;
  }
  return prisma.conversation.create({ data: { userId, channel } });
}

export const getMessages = (conversationId: string) =>
  prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' } });
