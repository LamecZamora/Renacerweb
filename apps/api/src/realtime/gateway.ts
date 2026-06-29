import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { verifyAccess } from '../lib/jwt.js';
import { bus } from '../core/bus/eventBus.js';

/**
 * WebSocket Gateway. Reenvía los eventos del Event Bus a la sala del usuario
 * correspondiente (chat en streaming, estado del Avatar, transcripciones de Voz).
 * Corre EN PARALELO al REST; si está apagado, la API sigue funcionando igual.
 */
export function attachRealtime(httpServer: HttpServer) {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('unauthorized'));
    try {
      const { sub } = verifyAccess(token);
      socket.data.userId = sub;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.data.userId}`);
  });

  // Cada evento con userId se entrega solo a ese usuario.
  bus.onAny((event) => {
    if ('userId' in event && event.userId) {
      io.to(`user:${event.userId}`).emit(event.type, event);
    }
  });

  return io;
}
