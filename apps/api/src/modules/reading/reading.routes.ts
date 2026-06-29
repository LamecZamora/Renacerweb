import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { awardXp } from '../../core/rpg.js';

export const readingRouter = Router();
readingRouter.use(requireAuth);

readingRouter.get('/books', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.book.findMany({ where: { userId: req.userId! }, include: { sessions: { orderBy: { date: 'desc' } }, summary: true }, orderBy: { id: 'desc' } }) });
});

readingRouter.post('/books', async (req: AuthedRequest, res) => {
  const p = z.object({ title: z.string().min(1), author: z.string().optional(), totalPages: z.number().int().optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'title requerido' } });
  res.status(201).json({ data: await prisma.book.create({ data: { userId: req.userId!, ...p.data } }) });
});

readingRouter.post('/books/:id/sessions', async (req: AuthedRequest, res) => {
  const p = z.object({ pagesRead: z.number().int().min(1), minutes: z.number().int().default(0) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'pagesRead requerido' } });
  const book = await prisma.book.findFirst({ where: { id: req.params.id, userId: req.userId! } });
  if (!book) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Libro no encontrado' } });
  const session = await prisma.readingSession.create({ data: { bookId: book.id, pagesRead: p.data.pagesRead, minutes: p.data.minutes } });
  await awardXp({ userId: req.userId!, source: 'READING', stat: 'KNOWLEDGE', amount: 20, refId: session.id });
  res.status(201).json({ data: session });
});
