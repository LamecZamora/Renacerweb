import { prisma } from '../../lib/prisma.js';

export type Intent =
  | 'log_workout' | 'log_metric' | 'study_english' | 'practice_code'
  | 'journal' | 'finance' | 'open_app' | 'set_goal' | 'chat';

const RULES: { intent: Intent; action: string; keywords: string[] }[] = [
  { intent: 'log_workout', action: 'fitness.logWorkout', keywords: ['entren', 'gimnasio', 'pesas', 'rutina'] },
  { intent: 'log_metric', action: 'fitness.logMetric', keywords: ['peso', 'kilos', 'cintura', 'grasa'] },
  { intent: 'study_english', action: 'english.startLesson', keywords: ['inglés', 'ingles', 'english', 'listening', 'speaking'] },
  { intent: 'practice_code', action: 'code.openChallenge', keywords: ['program', 'código', 'codigo', 'python', 'java', 'reto'] },
  { intent: 'journal', action: 'journal.newEntry', keywords: ['diario', 'me siento', 'hoy fue'] },
  { intent: 'finance', action: 'finance.addTx', keywords: ['gasté', 'gaste', 'ingreso', 'ahorro', 'dinero'] },
  { intent: 'open_app', action: 'pc.openApp', keywords: ['abre', 'abrir', 'lanza', 'ejecuta'] },
  { intent: 'set_goal', action: 'memory.createGoal', keywords: ['quiero lograr', 'mi meta', 'objetivo', 'propósito'] },
];

/** Clasifica la intención del usuario y registra la decisión (auditoría). */
export async function classifyIntent(userId: string, text: string) {
  const t = text.toLowerCase();
  let best: { intent: Intent; action: string; confidence: number } = { intent: 'chat', action: 'core.conversation', confidence: 0.3 };

  for (const rule of RULES) {
    const hits = rule.keywords.filter((k) => t.includes(k)).length;
    if (hits > 0) {
      const confidence = Math.min(0.95, 0.5 + hits * 0.2);
      if (confidence > best.confidence) best = { intent: rule.intent, action: rule.action, confidence };
    }
  }

  await prisma.decision.create({
    data: { userId, intent: best.intent, chosenAction: best.action, confidence: best.confidence },
  });
  return best;
}
