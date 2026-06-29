import { prisma } from '../../lib/prisma.js';
import { bus } from '../bus/eventBus.js';
import { analyzeEmotion } from '../emotion/emotion.service.js';
import { classifyIntent } from '../decisions/decisions.service.js';
import { ensureConversation, generateReply, getMessages } from '../conversation/conversation.service.js';
import { recall, remember } from '../../modules/memory/memory.service.js';

/**
 * Orquestador: único punto de entrada del chat. Coordina emoción, decisiones,
 * memoria y conversación, y compone la respuesta. Todo lo demás se enchufa aquí.
 */
export async function handleChat(params: { userId: string; conversationId?: string; content: string; channel?: 'TEXT' | 'VOICE' }) {
  const { userId, content } = params;

  // 1) Conversación + persistir mensaje del usuario
  const conversation = await ensureConversation(userId, params.conversationId, params.channel ?? 'TEXT');
  await prisma.message.create({ data: { conversationId: conversation.id, role: 'USER', content } });
  bus.emit({ type: 'chat.message.created', userId, conversationId: conversation.id, content });

  // 2) Análisis emocional + 3) intención + 4) memoria (en paralelo)
  const [emotion, intent, memories, history] = await Promise.all([
    analyzeEmotion({ userId, text: content, source: params.channel === 'VOICE' ? 'VOICE' : 'CHAT' }),
    classifyIntent(userId, content),
    recall(userId, content, 5),
    getMessages(conversation.id),
  ]);

  // 5) Generar respuesta con el Motor de Conversación
  const reply = await generateReply({
    memories,
    history: history.map((m) => ({ role: m.role, content: m.content })),
    userMessage: content,
  });

  // 6) Persistir respuesta + evento
  await prisma.message.create({ data: { conversationId: conversation.id, role: 'ASSISTANT', content: reply } });
  bus.emit({ type: 'chat.reply.created', userId, conversationId: conversation.id, content: reply });

  // 7) Memoria oportunista: guarda lo que parece relevante
  if (intent.intent === 'set_goal' || content.length > 120) {
    await remember({ userId, kind: intent.intent === 'set_goal' ? 'GOAL' : 'CONVERSATION', content, source: 'chat', importance: 2 });
  }

  return {
    conversationId: conversation.id,
    reply,
    emotion: emotion.emotion,
    valence: emotion.valence,
    intent: intent.intent,
    action: intent.action,
    memoriesUsed: memories.length,
  };
}
