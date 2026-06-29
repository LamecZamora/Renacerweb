// Contratos de eventos del Event Bus interno. Todos los módulos se comunican
// con Core IA emitiendo/escuchando estos eventos tipados.

export type CoreEvent =
  | { type: 'chat.message.created'; userId: string; conversationId: string; content: string }
  | { type: 'chat.reply.created'; userId: string; conversationId: string; content: string }
  | { type: 'emotion.detected'; userId: string; source: 'JOURNAL' | 'VOICE' | 'CHAT'; valence: number; arousal: number; emotions: Record<string, number> }
  | { type: 'xp.awarded'; userId: string; stat: string; amount: number; leveledUp: boolean }
  | { type: 'recommendation.created'; userId: string; content: string }
  | { type: 'avatar.state'; userId: string; emotion: string; intensity: number }
  | { type: 'pc.action.requested'; userId: string; actionKey: string; params?: unknown };

export type CoreEventType = CoreEvent['type'];
export type EventOf<T extends CoreEventType> = Extract<CoreEvent, { type: T }>;
