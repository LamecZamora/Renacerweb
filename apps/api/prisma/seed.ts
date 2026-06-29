import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGES = ['Python', 'Java', 'SQL', 'HTML', 'CSS', 'JavaScript', 'PHP', 'C', 'C++', 'C#', 'Kotlin', 'Dart', 'Go', 'Rust', 'Assembly x86', 'Bash', 'PowerShell'];
const TRACKS = ['Desarrollo Web', 'Backend', 'Frontend', 'Bases de Datos', 'Desktop', 'Android', 'Flutter', 'Videojuegos', 'Ciberseguridad', 'Redes', 'Linux', 'DevOps', 'IA', 'Machine Learning', 'Ingeniería Inversa', 'Assembly', 'Análisis de Malware', 'Sistemas Operativos'];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

async function main() {
  // Usuario demo
  const passwordHash = await argon2.hash('renacer123');
  const user = await prisma.user.upsert({
    where: { email: 'demo@renacer.ai' },
    update: {},
    create: {
      email: 'demo@renacer.ai',
      passwordHash,
      displayName: 'Renacido Demo',
      profile: { create: { heightCm: 178, startWeight: 87, targetWeight: 75 } },
    },
  });

  // Catálogos
  for (const name of LANGUAGES) {
    await prisma.language.upsert({ where: { slug: name.toLowerCase().replace(/\W+/g, '-') }, update: {}, create: { slug: name.toLowerCase().replace(/\W+/g, '-'), name } });
  }
  for (const name of TRACKS) {
    await prisma.track.upsert({ where: { slug: name.toLowerCase().replace(/\W+/g, '-') }, update: {}, create: { slug: name.toLowerCase().replace(/\W+/g, '-'), name } });
  }
  for (let i = 0; i < LEVELS.length; i++) {
    await prisma.englishLevel.upsert({ where: { code: LEVELS[i] }, update: {}, create: { code: LEVELS[i], order: i } });
  }

  // Datos de progreso demo
  await prisma.streak.upsert({ where: { userId_type: { userId: user.id, type: 'daily' } }, update: { current: 18, longest: 25 }, create: { userId: user.id, type: 'daily', current: 18, longest: 25 } });

  const weights = [87.1, 86.0, 85.2, 84.4, 83.5, 82.9, 82.4];
  for (let i = 0; i < weights.length; i++) {
    await prisma.bodyMetric.create({ data: { userId: user.id, date: new Date(Date.now() - (weights.length - i) * 7 * 86_400_000), weight: weights[i], bodyFatPct: 24 - i * 0.6 } });
  }

  await prisma.goal.create({ data: { userId: user.id, title: 'Bajar a 75 kg', description: 'Meta principal de fitness' } });
  await prisma.habit.create({ data: { userId: user.id, title: 'Entrenar', cadence: 'DAILY' } });

  console.log('✅ Seed completo. Usuario demo: demo@renacer.ai / renacer123');
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
