import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { awardXp } from '../../core/rpg.js';

export const financeRouter = Router();
financeRouter.use(requireAuth);

const txSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'SAVING']),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().optional(),
  note: z.string().optional(),
});

financeRouter.get('/transactions', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.transaction.findMany({ where: { userId: req.userId! }, orderBy: { date: 'desc' }, take: 200 }) });
});

financeRouter.post('/transactions', async (req: AuthedRequest, res) => {
  const p = txSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'Transacción inválida' } });
  const { date, ...rest } = p.data;
  const tx = await prisma.transaction.create({ data: { userId: req.userId!, date: date ? new Date(date) : new Date(), ...rest } });
  await awardXp({ userId: req.userId!, source: 'FINANCE', stat: 'DISCIPLINE', amount: 5, refId: tx.id });
  res.status(201).json({ data: tx });
});

financeRouter.get('/budgets', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.budget.findMany({ where: { userId: req.userId! } }) });
});

financeRouter.post('/budgets', async (req: AuthedRequest, res) => {
  const p = z.object({ category: z.string().min(1), monthlyLimit: z.number().positive() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'category y monthlyLimit requeridos' } });
  const budget = await prisma.budget.upsert({
    where: { userId_category: { userId: req.userId!, category: p.data.category } },
    create: { userId: req.userId!, ...p.data },
    update: { monthlyLimit: p.data.monthlyLimit },
  });
  res.status(201).json({ data: budget });
});

financeRouter.get('/summary', async (req: AuthedRequest, res) => {
  const txs = await prisma.transaction.findMany({ where: { userId: req.userId! } });
  const sum = (t: string) => txs.filter((x) => x.type === t).reduce((s, x) => s + x.amount, 0);
  const income = sum('INCOME'), expense = sum('EXPENSE'), saving = sum('SAVING');
  res.json({ data: { income, expense, saving, net: income - expense } });
});
