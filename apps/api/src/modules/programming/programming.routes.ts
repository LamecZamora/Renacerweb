import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { awardXp } from '../../core/rpg.js';
import { getAIProvider } from '../../lib/ai.js';

export const programmingRouter = Router();
programmingRouter.use(requireAuth);

programmingRouter.get('/languages', async (_req, res) => {
  res.json({ data: await prisma.language.findMany({ orderBy: { name: 'asc' } }) });
});

programmingRouter.get('/tracks', async (_req, res) => {
  res.json({ data: await prisma.track.findMany({ orderBy: { name: 'asc' } }) });
});

const submitSchema = z.object({
  challengeId: z.string().optional(),
  language: z.string().min(1),
  code: z.string().min(1),
});

programmingRouter.post('/submissions', async (req: AuthedRequest, res) => {
  const p = submitSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'language y code requeridos' } });

  const ai = getAIProvider();
  const review = await ai.complete({
    system: 'Eres un revisor senior. Detecta errores y malas prácticas, explica la solución y califica de 1 a 100. Responde en español.',
    user: `Lenguaje: ${p.data.language}\n\n${p.data.code}`,
  });
  const score = Math.min(100, 50 + Math.floor(p.data.code.length / 15));

  const submission = await prisma.codeSubmission.create({
    data: {
      userId: req.userId!,
      challengeId: p.data.challengeId ?? null,
      language: p.data.language,
      code: p.data.code,
      aiReview: { text: review },
      score,
      xpAwarded: 40,
    },
  });
  await awardXp({ userId: req.userId!, source: 'CODE', stat: 'PROGRAMMING', amount: 40, refId: submission.id });
  res.status(201).json({ data: submission });
});

programmingRouter.get('/submissions', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.codeSubmission.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' }, take: 50 }) });
});
