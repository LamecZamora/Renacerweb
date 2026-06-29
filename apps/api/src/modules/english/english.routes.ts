import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { awardXp } from '../../core/rpg.js';
import { getAIProvider } from '../../lib/ai.js';

export const englishRouter = Router();
englishRouter.use(requireAuth);

englishRouter.get('/levels', async (_req, res) => {
  res.json({ data: await prisma.englishLevel.findMany({ orderBy: { order: 'asc' }, include: { courses: { include: { lessons: true } } } }) });
});

const submitSchema = z.object({
  exerciseId: z.string().optional(),
  type: z.enum(['SPEAKING', 'LISTENING', 'READING', 'WRITING', 'GRAMMAR', 'VOCAB', 'PRONUNCIATION']),
  payload: z.string().min(1), // texto o audioUrl
});

englishRouter.post('/submissions', async (req: AuthedRequest, res) => {
  const p = submitSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'type y payload requeridos' } });

  const ai = getAIProvider();
  const feedback = await ai.complete({
    system: 'Eres profesor de inglés CEFR. Corrige, califica de 1 a 100 y detecta áreas débiles. Responde en español.',
    user: `(${p.data.type}) ${p.data.payload}`,
  });
  // Score heurístico base (en producción lo fija la IA estructurada).
  const score = Math.min(100, 60 + Math.floor(p.data.payload.length / 20));

  const submission = await prisma.englishSubmission.create({
    data: {
      userId: req.userId!,
      exerciseId: p.data.exerciseId ?? null,
      type: p.data.type,
      payload: { content: p.data.payload },
      aiFeedback: { text: feedback },
      score,
      weakAreas: score < 70 ? [p.data.type] : [],
    },
  });
  await awardXp({ userId: req.userId!, source: 'ENGLISH', stat: 'ENGLISH', amount: 25, refId: submission.id });
  res.status(201).json({ data: submission });
});

englishRouter.get('/submissions', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.englishSubmission.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' }, take: 50 }) });
});
