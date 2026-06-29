// Bus de notificaciones (toasts) por evento global, desacoplado de la UI.
export type ToastTone = 'success' | 'info' | 'achievement';

export function toast(message: string, tone: ToastTone = 'success') {
  window.dispatchEvent(new CustomEvent('toast', { detail: { message, tone, id: Math.random().toString(36).slice(2) } }));
}
