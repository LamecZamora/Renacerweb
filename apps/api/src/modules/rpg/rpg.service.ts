import { prisma } from '../../lib/prisma.js';

// Tabla de niveles (espejo de packages/shared/constants/rpg.ts).
const MAX_LEVEL = 100;
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.min(level, MAX_LEVEL));
  return Math.round(50 * (l - 1) * (l - 1) + 100 * (l - 1));
}
export function levelFromXp(totalXp: number): number {
  let level = 1;
  while (level < MAX_LEVEL && totalXp >= xpForLevel(level + 1)) level++;
  return level;
}

type Stat =
  | 'STRENGTH' | 'STAMINA' | 'DISCIPLINE' | 'INTELLIGENCE' | 'KNOWLEDGE'
  | 'CREATIVITY' | 'CHARISMA' | 'HEALTH' | 'PROGRAMMING' | 'ENGLISH';
type Source = 'FITNESS' | 'ENGLISH' | 'CODE' | 'JOURNAL' | 'READING' | 'TASK' | 'HABIT' | 'PROJECT' | 'FINANCE';

/**
 * Registra un evento de XP inmutable y actualiza el snapshot derivado.
 * Devuelve el nuevo nivel de la estadística y si hubo subida de nivel.
 */
export async function awardXp(params: {
  userId: string;
  source: Source;
  stat: Stat;
  amount: number;
  refId?: string;
}) {
  const { userId, source, stat, amount, refId } = params;

  return prisma.$transaction(async (tx) => {
    await tx.xpEvent.create({ data: { userId, source, stat, amount, refId } });

    const snapshot = await tx.statSnapshot.findUnique({
      where: { userId_stat: { userId, stat } },
    });
    const prevLevel = snapshot ? snapshot.level : 1;
    const totalXp = (snapshot?.totalXp ?? 0) + amount;
    const newLevel = levelFromXp(totalXp);

    await tx.statSnapshot.upsert({
      where: { userId_stat: { userId, stat } },
      create: { userId, stat, totalXp, level: newLevel },
      update: { totalXp, level: newLevel },
    });

    return { stat, totalXp, level: newLevel, leveledUp: newLevel > prevLevel };
  });
}

/** Estadísticas RPG completas de un usuario (para el radar del dashboard). */
export async function getStats(userId: string) {
  const snapshots = await prisma.statSnapshot.findMany({ where: { userId } });
  const totalXp = snapshots.reduce((sum, s) => sum + s.totalXp, 0);
  return {
    overallLevel: levelFromXp(totalXp),
    totalXp,
    stats: snapshots.map((s) => ({ stat: s.stat, level: s.level, totalXp: s.totalXp })),
  };
}
