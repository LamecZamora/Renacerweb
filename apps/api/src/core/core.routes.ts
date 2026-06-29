import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { handleChat } from './orchestrator/orchestrator.service.js';
import { getMessages } from './conversation/conversation.service.js';
import { generateRecommendation, listRecommendations } from './recommendations/recommendations.service.js';

export const coreRouter = Router();
coreRouter.use(requireAuth);

const chatSchema = z.object({
  content: z.string().min(1),
  conversationId: z.string().optional(),
  channel: z.enum(['TEXT', 'VOICE']).optional(),
});

// Chat orquestado por Core IA
coreRouter.post('/chat', async (req: AuthedRequest, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'content requerido' } });
  const result = await handleChat({ userId: req.userId!, ...parsed.data });
  res.json({ data: result });
});

coreRouter.get('/conversations/:id/messages', async (req: AuthedRequest, res) => {
  res.json({ data: await getMessages(req.params.id) });
});

// Recomendaciones (Mentor)
coreRouter.get('/recommendations', async (req: AuthedRequest, res) => {
  res.json({ data: await listRecommendations(req.userId!) });
});

coreRouter.post('/recommendations/generate', async (req: AuthedRequest, res) => {
  res.json({ data: await generateRecommendation(req.userId!) });
});
