import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { awardXp } from '../../core/rpg.js';

export const projectsRouter = Router();
projectsRouter.use(requireAuth);

projectsRouter.get('/', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.project.findMany({ where: { userId: req.userId! }, include: { tasks: { orderBy: { order: 'asc' } }, logs: { orderBy: { date: 'desc' } } }, orderBy: { createdAt: 'desc' } }) });
});

projectsRouter.post('/', async (req: AuthedRequest, res) => {
  const p = z.object({ title: z.string().min(1), type: z.string().default('General'), difficulty: z.number().int().min(1).max(5).default(1) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'title requerido' } });
  res.status(201).json({ data: await prisma.project.create({ data: { userId: req.userId!, ...p.data } }) });
});

projectsRouter.post('/:id/tasks', async (req: AuthedRequest, res) => {
  const p = z.object({ title: z.string().min(1), order: z.number().int().default(0) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'title requerido' } });
  const project = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.userId! } });
  if (!project) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Proyecto no encontrado' } });
  res.status(201).json({ data: await prisma.projectTask.create({ data: { projectId: project.id, ...p.data } }) });
});

projectsRouter.patch('/tasks/:taskId', async (req: AuthedRequest, res) => {
  const p = z.object({ done: z.boolean() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'done requerido' } });
  res.json({ data: await prisma.projectTask.update({ where: { id: req.params.taskId }, data: { done: p.data.done } }) });
});

projectsRouter.post('/:id/logs', async (req: AuthedRequest, res) => {
  const p = z.object({ note: z.string().min(1), minutesSpent: z.number().int().default(0) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'note requerido' } });
  const project = await prisma.project.findFirst({ where: { id: req.params.id, userId: req.userId! } });
  if (!project) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Proyecto no encontrado' } });
  const log = await prisma.projectLog.create({ data: { projectId: project.id, ...p.data } });
  await prisma.project.update({ where: { id: project.id }, data: { totalTimeMin: { increment: p.data.minutesSpent } } });
  await awardXp({ userId: req.userId!, source: 'PROJECT', stat: 'CREATIVITY', amount: 15, refId: log.id });
  res.status(201).json({ data: log });
});
