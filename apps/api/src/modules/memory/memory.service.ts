import type { MemoryKind } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { embed, cosine } from '../../core/conversation/embeddings.js';

/** Guarda un recuerdo con su embedding. */
export async function remember(params: {
  userId: string;
  kind: MemoryKind;
  content: string;
  importance?: number;
  source?: string;
}) {
  const { userId, kind, content, importance = 1, source } = params;
  return prisma.memory.create({
    data: { userId, kind, content, importance, source, embedding: embed(content) },
  });
}

/**
 * Recupera los k recuerdos más relevantes combinando similitud semántica,
 * importancia y recencia. (En producción → consulta pgvector con índice IVFFlat.)
 */
export async function recall(userId: string, query: string, k = 5) {
  const qv = embed(query);
  const memories = await prisma.memory.findMany({ where: { userId } });
  const now = Date.now();

  const scored = memories.map((m) => {
    const sim = cosine(qv, m.embedding as number[]);
    const ageDays = (now - new Date(m.createdAt).getTime()) / 86_400_000;
    const recency = 1 / (1 + ageDays / 30);
    const score = sim * 0.7 + recency * 0.2 + Math.min(m.importance, 5) * 0.02;
    return { memory: m, score };
  });

  const top = scored.sort((a, b) => b.score - a.score).slice(0, k).filter((s) => s.score > 0);

  if (top.length) {
    await prisma.memory.updateMany({
      where: { id: { in: top.map((t) => t.memory.id) } },
      data: { lastUsedAt: new Date() },
    });
  }
  return top.map((t) => t.memory);
}

// ── Memoria estructurada: objetivos y hábitos ──
export const listGoals = (userId: string) =>
  prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

export const createGoal = (userId: string, data: { title: string; description?: string; targetDate?: Date }) =>
  prisma.goal.create({ data: { userId, ...data } });

export const listHabits = (userId: string) =>
  prisma.habit.findMany({ where: { userId }, include: { logs: { take: 30, orderBy: { date: 'desc' } } } });

export const createHabit = (userId: string, data: { title: string; cadence?: 'DAILY' | 'WEEKLY' }) =>
  prisma.habit.create({ data: { userId, title: data.title, cadence: data.cadence ?? 'DAILY' } });

export const logHabit = (habitId: string, done = true) =>
  prisma.habitLog.create({ data: { habitId, done } });
