import { EventEmitter } from 'node:events';
import type { CoreEvent, CoreEventType, EventOf } from './events.js';

/**
 * Event Bus interno. Implementación in-memory (EventEmitter) que NO requiere
 * Redis para el cimiento. La interfaz está lista para sustituirse por un
 * adaptador Redis/BullMQ en producción (mismo `on` / `emit`).
 */
class EventBus {
  private emitter = new EventEmitter();

  constructor() {
    // Permite muchos suscriptores (un evento puede alimentar varios módulos).
    this.emitter.setMaxListeners(100);
  }

  on<T extends CoreEventType>(type: T, handler: (event: EventOf<T>) => void | Promise<void>) {
    this.emitter.on(type, handler as (e: CoreEvent) => void);
    return () => this.emitter.off(type, handler as (e: CoreEvent) => void);
  }

  emit(event: CoreEvent) {
    this.emitter.emit(event.type, event);
    this.emitter.emit('*', event); // canal comodín (p. ej. para el gateway WebSocket)
  }

  onAny(handler: (event: CoreEvent) => void | Promise<void>) {
    this.emitter.on('*', handler);
    return () => this.emitter.off('*', handler);
  }
}

export const bus = new EventBus();
