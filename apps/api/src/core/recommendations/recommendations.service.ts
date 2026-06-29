import { prisma } from '../../lib/prisma.js';
import { bus } from '../bus/eventBus.js';
import { getStats } from '../rpg.js';

/**
 * Genera una recomendación contextual a partir de datos multi-módulo
 * (stats RPG, emoción reciente, objetivos). Es la formalización del "Mentor".
 */
export async function generateRecommendation(userId: string) {
  const [stats, lastEmotion, goals] = await Promise.all([
    getStats(userId),
    prisma.emotionLog.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.goal.findMany({ where: { userId, status: 'active' }, take: 3 }),
  ]);

  const weakest = [...stats.stats].sort((a, b) => a.level - b.level)[0];
  const parts: string[] = [];

  if (weakest) parts.push(`Tu estadística más baja es ${weakest.stat} (nivel ${weakest.level}); dale foco hoy.`);
  if (lastEmotion && lastEmotion.valence < 0) parts.push('Noté ánimo bajo recientemente: empieza con una tarea pequeña para recuperar impulso.');
  if (goals.length) parts.push(`Acércate a tu objetivo "${goals[0].title}" con un paso concreto.`);
  if (!parts.length) parts.push('Mantén tu racha: una acción medible en cada módulo hoy.');

  const content = parts.join(' ');
  const rec = await prisma.recommendation.create({
    data: { userId, type: 'daily', content, source: 'mentor' },
  });
  bus.emit({ type: 'recommendation.created', userId, content });
  return rec;
}

export const listRecommendations = (userId: string) =>
  prisma.recommendation.findMany({ where: { userId, status: 'active' }, orderBy: { createdAt: 'desc' }, take: 20 });
