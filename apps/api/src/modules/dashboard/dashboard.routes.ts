import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../../middleware/auth.js';
import { getStats, levelFromXp } from '../../core/rpg.js';

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

/** Dashboard agregado REAL (lee de la base de datos). Vive en /me/dashboard
 *  para no tocar el endpoint mock /dashboard existente. */
dashboardRouter.get('/dashboard', async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const [stats, profile, lastMetric, weightHistory, streak, missionsDone, lastEmotion, recentXp] = await Promise.all([
    getStats(userId),
    prisma.profile.findUnique({ where: { userId } }),
    prisma.bodyMetric.findFirst({ where: { userId, weight: { not: null } }, orderBy: { date: 'desc' } }),
    prisma.bodyMetric.findMany({ where: { userId, weight: { not: null } }, orderBy: { date: 'asc' }, take: 30 }),
    prisma.streak.findFirst({ where: { userId, type: 'daily' } }),
    prisma.mission.count({ where: { userId, status: 'DONE' } }),
    prisma.emotionLog.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    prisma.xpEvent.aggregate({ where: { userId, createdAt: { gte: new Date(Date.now() - 86_400_000) } }, _sum: { amount: true } }),
  ]);

  const dayScore = Math.min(100, 40 + (recentXp._sum.amount ?? 0));
  res.json({
    data: {
      level: levelFromXp(stats.totalXp),
      totalXp: stats.totalXp,
      stats: stats.stats,
      weight: { current: lastMetric?.weight ?? null, target: profile?.targetWeight ?? null },
      streak: streak?.current ?? 0,
      missionsCompleted: missionsDone,
      mood: lastEmotion ? (lastEmotion.valence >= 0 ? 'positivo' : 'bajo') : 'neutral',
      dayScore,
      weightHistory: weightHistory.map((m) => ({ date: m.date, weight: m.weight })),
    },
  });
});
