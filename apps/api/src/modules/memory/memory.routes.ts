import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import {
  remember, recall, listGoals, createGoal, listHabits, createHabit, logHabit,
} from './memory.service.js';

export const memoryRouter = Router();
memoryRouter.use(requireAuth);

// Memoria semántica
memoryRouter.get('/', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.memory.findMany({ where: { userId: req.userId! }, orderBy: { createdAt: 'desc' }, take: 50 }) });
});

const memSchema = z.object({
  kind: z.enum(['GOAL', 'HABIT', 'FACT', 'PREFERENCE', 'EVENT', 'CONVERSATION']),
  content: z.string().min(1),
  importance: z.number().int().min(1).max(5).optional(),
});
memoryRouter.post('/', async (req: AuthedRequest, res) => {
  const p = memSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'kind y content requeridos' } });
  res.status(201).json({ data: await remember({ userId: req.userId!, ...p.data }) });
});

memoryRouter.post('/search', async (req: AuthedRequest, res) => {
  const q = z.object({ query: z.string().min(1), k: z.number().optional() }).safeParse(req.body);
  if (!q.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'query requerido' } });
  res.json({ data: await recall(req.userId!, q.data.query, q.data.k ?? 5) });
});

// Objetivos
memoryRouter.get('/goals', async (req: AuthedRequest, res) => res.json({ data: await listGoals(req.userId!) }));
memoryRouter.post('/goals', async (req: AuthedRequest, res) => {
  const p = z.object({ title: z.string().min(1), description: z.string().optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'title requerido' } });
  res.status(201).json({ data: await createGoal(req.userId!, p.data) });
});

// Hábitos
memoryRouter.get('/habits', async (req: AuthedRequest, res) => res.json({ data: await listHabits(req.userId!) }));
memoryRouter.post('/habits', async (req: AuthedRequest, res) => {
  const p = z.object({ title: z.string().min(1), cadence: z.enum(['DAILY', 'WEEKLY']).optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'title requerido' } });
  res.status(201).json({ data: await createHabit(req.userId!, p.data) });
});
memoryRouter.post('/habits/:id/log', async (req: AuthedRequest, res) => {
  res.status(201).json({ data: await logHabit(req.params.id) });
});
