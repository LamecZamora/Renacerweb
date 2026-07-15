import React from 'react';
import ReactDOM from 'react-dom/client';
import { LazyMotion, domAnimation } from 'framer-motion';
import App from './App';
import './index.css';
import { initTheme } from './lib/theme';

// Aplica el color de acento elegido antes del primer render (evita parpadeo).
initTheme();

// LazyMotion + componentes `m` cargan solo el set de animaciones que usamos
// (domAnimation, ~17 kB) en vez del bundle completo de framer-motion (~38 kB gzip).
// `strict` obliga a usar `m.*` (no `motion.*`) para no arrastrar el bundle grande.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>,
);

// PWA: registrar service worker para que sea instalable y funcione offline.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* noop */ });
  });
}
