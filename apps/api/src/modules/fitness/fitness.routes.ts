import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { awardXp } from '../../core/rpg.js';

export const fitnessRouter = Router();
fitnessRouter.use(requireAuth);

const metricSchema = z.object({
  date: z.string().optional(),
  weight: z.number().optional(),
  waist: z.number().optional(),
  neck: z.number().optional(),
  chest: z.number().optional(),
  arms: z.number().optional(),
  legs: z.number().optional(),
  bodyFatPct: z.number().optional(),
  sleepHours: z.number().optional(),
  waterMl: z.number().int().optional(),
  calories: z.number().int().optional(),
});

fitnessRouter.get('/metrics', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.bodyMetric.findMany({ where: { userId: req.userId! }, orderBy: { date: 'desc' }, take: 90 }) });
});

fitnessRouter.post('/metrics', async (req: AuthedRequest, res) => {
  const p = metricSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'Datos de métrica inválidos' } });
  const { date, ...rest } = p.data;
  const metric = await prisma.bodyMetric.create({ data: { userId: req.userId!, date: date ? new Date(date) : new Date(), ...rest } });
  await awardXp({ userId: req.userId!, source: 'FITNESS', stat: 'HEALTH', amount: 10, refId: metric.id });
  res.status(201).json({ data: metric });
});

const workoutSchema = z.object({
  dayType: z.enum(['CHEST_BACK', 'LEG', 'SHOULDER_ARM', 'CARDIO_ABS', 'FULL_BODY', 'CARDIO', 'REVIEW']),
  durationMin: z.number().int().default(0),
  notes: z.string().optional(),
  exercises: z.array(z.object({ name: z.string(), sets: z.number().int(), reps: z.number().int(), weight: z.number().optional() })).optional(),
});

fitnessRouter.get('/workouts', async (req: AuthedRequest, res) => {
  res.json({ data: await prisma.workout.findMany({ where: { userId: req.userId! }, orderBy: { date: 'desc' }, take: 60, include: { exercises: true } }) });
});

fitnessRouter.post('/workouts', async (req: AuthedRequest, res) => {
  const p = workoutSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'Datos de entrenamiento inválidos' } });
  const workout = await prisma.workout.create({
    data: {
      userId: req.userId!, date: new Date(), dayType: p.data.dayType, durationMin: p.data.durationMin, notes: p.data.notes,
      exercises: p.data.exercises ? { create: p.data.exercises } : undefined,
    },
    include: { exercises: true },
  });
  const stat = p.data.dayType === 'CARDIO' || p.data.dayType === 'CARDIO_ABS' ? 'STAMINA' : 'STRENGTH';
  await awardXp({ userId: req.userId!, source: 'FITNESS', stat, amount: 30, refId: workout.id });
  res.status(201).json({ data: workout });
});

fitnessRouter.get('/trends', async (req: AuthedRequest, res) => {
  const metrics = await prisma.bodyMetric.findMany({ where: { userId: req.userId!, weight: { not: null } }, orderBy: { date: 'asc' }, take: 90 });
  res.json({ data: { weight: metrics.map((m) => ({ date: m.date, weight: m.weight, bodyFatPct: m.bodyFatPct })) } });
});
