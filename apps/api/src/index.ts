import { createServer } from 'node:http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './modules/auth/auth.routes.js';
import { requireAuth, type AuthedRequest } from './middleware/auth.js';
import { getStats } from './modules/rpg/rpg.service.js';
import { flags } from './config/flags.js';
import { coreRouter } from './core/core.routes.js';
import { memoryRouter } from './modules/memory/memory.routes.js';
import { attachRealtime } from './realtime/gateway.js';
import { fitnessRouter } from './modules/fitness/fitness.routes.js';
import { journalRouter } from './modules/journal/journal.routes.js';
import { readingRouter } from './modules/reading/reading.routes.js';
import { financeRouter } from './modules/finance/finance.routes.js';
import { englishRouter } from './modules/english/english.routes.js';
import { programmingRouter } from './modules/programming/programming.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const api = express.Router();

// Health
api.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));

// Auth (público)
api.use('/auth', authRouter);

// RPG (protegido) — estadísticas reales derivadas de los eventos de XP
api.get('/rpg/stats', requireAuth, async (req: AuthedRequest, res) => {
  res.json({ data: await getStats(req.userId!) });
});

// ── Módulos de dominio (reales, Prisma + XP automático) ──
api.use('/fitness', fitnessRouter);
api.use('/journal', journalRouter);
api.use('/reading', readingRouter);
api.use('/finance', financeRouter);
api.use('/english', englishRouter);
api.use('/code', programmingRouter);
api.use('/projects', projectsRouter);
api.use('/me', dashboardRouter); // GET /me/dashboard (real, autenticado)

// ── RENACER AI (additive, tras feature flags) ──
if (flags.coreIA) {
  api.use('/core', coreRouter);
  api.use('/memory', memoryRouter);
}

// Dashboard (mock agregado — se conectará a los módulos en Fase 1)
api.get('/dashboard', (_req, res) => {
  res.json({
    data: {
      level: 14,
      totalXp: 12450,
      weight: { current: 82.4, target: 75 },
      streak: 18,
      tasksCompleted: 7,
      studyHours: 2.5,
      trainingHours: 1.2,
      mood: 'motivado',
      dayScore: 86,
      weeklyGoals: [
        { title: 'Entrenar 5 días', progress: 4, target: 5 },
        { title: 'Inglés 7 lecciones', progress: 5, target: 7 },
        { title: 'Programar 4 retos', progress: 3, target: 4 },
      ],
      stats: [
        { stat: 'STRENGTH', level: 16 },
        { stat: 'STAMINA', level: 12 },
        { stat: 'DISCIPLINE', level: 19 },
        { stat: 'INTELLIGENCE', level: 14 },
        { stat: 'KNOWLEDGE', level: 13 },
        { stat: 'PROGRAMMING', level: 17 },
        { stat: 'ENGLISH', level: 11 },
        { stat: 'HEALTH', level: 15 },
      ],
      weightHistory: [
        { date: '2026-05-01', weight: 87.1 },
        { date: '2026-05-08', weight: 86.0 },
        { date: '2026-05-15', weight: 85.2 },
        { date: '2026-05-22', weight: 84.4 },
        { date: '2026-05-29', weight: 83.5 },
        { date: '2026-06-05', weight: 82.9 },
        { date: '2026-06-12', weight: 82.4 },
      ],
    },
  });
});

app.use('/api/v1', api);

const PORT = process.env.PORT ?? 4000;
const httpServer = createServer(app);

// WebSocket Gateway en paralelo al REST (tras flag).
if (flags.realtime) {
  attachRealtime(httpServer);
  console.log('🔌 Realtime gateway activo');
}

httpServer.listen(PORT, () =>
  console.log(`🌅 Renacer API en http://localhost:${PORT}  (Core IA: ${flags.coreIA ? 'on' : 'off'})`),
);
