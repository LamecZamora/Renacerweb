import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { awardXp } from '../../core/rpg.js';
import { analyzeEmotion } from '../../core/emotion/emotion.service.js';
import { getAIProvider } from '../../lib/ai.js';

export const journalRouter = Router();
journalRouter.use(requireAuth);

const entrySchema = z.object({
  feeling: z.string().optional(),
  didToday: z.string().optional(),
  learned: z.string().optional(),
  worries: z.string().optional(),
  happy: z.string().optional(),
  improve: z.string().optional(),
});

journalRouter.get('/', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.journalEntry.findMany({ where: { userId: req.userId! }, orderBy: { date: 'desc' }, take: 60, include: { analysis: true } }) });
});

journalRouter.get('/:id', async (req: AuthedRequest, res) => {
  const entry = await prisma.journalEntry.findFirst({ where: { id: req.params.id, userId: req.userId! }, include: { analysis: true } });
  if (!entry) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Entrada no encontrada' } });
  res.json({ data: entry });
});

journalRouter.post('/', async (req: AuthedRequest, res) => {
  const p = entrySchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'Datos del diario inválidos' } });

  const entry = await prisma.journalEntry.create({ data: { userId: req.userId!, ...p.data } });

  // Core IA: análisis emocional + respuesta personalizada (no genérica).
  const text = Object.values(p.data).filter(Boolean).join('. ');
  const emo = await analyzeEmotion({ userId: req.userId!, text, source: 'JOURNAL' });
  const ai = getAIProvider();
  const aiResponse = await ai.complete({
    system: 'Eres MENTOR de RENACER AI. Responde SIEMPRE refiriéndote a lo que el usuario escribió; nunca genérico. Da una observación empática, un consejo y una reflexión breve.',
    user: text || 'Entrada sin texto',
  });

  const analysis = await prisma.journalAnalysis.create({
    data: {
      entryId: entry.id,
      emotions: emo.emotions,
      stress: emo.emotions.stress,
      anxiety: emo.emotions.anxiety,
      frustration: emo.emotions.frustration,
      motivation: emo.emotions.motivation,
      aiResponse,
      advice: 'Empieza por la acción más pequeña que te acerque a tu objetivo de hoy.',
      reflection: emo.valence >= 0 ? 'Vas en buena dirección, sostén el impulso.' : 'Un día difícil no define tu rumbo; mañana sigues.',
    },
  });

  await awardXp({ userId: req.userId!, source: 'JOURNAL', stat: 'DISCIPLINE', amount: 15, refId: entry.id });
  res.status(201).json({ data: { entry, analysis, emotion: emo.emotion } });
});
