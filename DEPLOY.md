# Desplegar RENACER (web) 🚀

La app vive en `apps/web` (React + TypeScript + Vite, PWA, 100% localStorage — sin backend).
Al desplegarla obtienes **dos cosas a la vez**: una herramienta que usas desde tu celular y un **proyecto de portafolio** para mostrar a reclutadores en Vancouver. 🍁

> ✅ El repo ya está inicializado en git (rama `master`, commit inicial) con un `.gitignore` que excluye `node_modules`, `dist`, `.pgdata`, `.env` y el APK. Solo falta subirlo o desplegarlo.

## Opción 0 · Vercel CLI (lo más rápido, ~2 min, sin GitHub)

```bash
npm i -g vercel            # una sola vez
cd renacer/apps/web
vercel                     # login + preguntas → URL de preview
vercel --prod              # publica en producción
```

En las preguntas: acepta los valores por defecto (Vite detectado, build `npm run build`, output `dist`). No necesitas configurar nada más.

## Opción A · Vercel + GitHub (recomendada para portafolio)

1. Sube el repo a GitHub (módulo 🐙 GitHub o `git push`).
2. Entra a [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repo.
3. En **Root Directory** elige `renacer/apps/web` (donde está el `package.json`).
4. Vercel detecta Vite solo:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy**. Listo: te da una URL `https://tu-app.vercel.app`.

El archivo `apps/web/vercel.json` ya incluye el *rewrite* SPA para que rutas como `/interview` funcionen al recargar.

## Opción B · Netlify

1. Importa el repo, base directory `renacer/apps/web`.
2. Build: `npm run build` · Publish: `dist`.
3. El `public/_redirects` ya maneja el fallback SPA.

## Opción C · GitHub Pages

Funciona sin cambios si publicas en una **User Page** (`tuusuario.github.io`), porque la app usa rutas en la raíz `/`.
Para una **Project Page** (`tuusuario.github.io/repo`) necesitarías fijar `base: '/repo/'` en `vite.config.ts` y un `basename` en el router — más enredo; mejor usa Vercel.

## Probar el build de producción localmente

```bash
cd renacer/apps/web
npm run build
npm run preview   # abre http://localhost:4173
```

## Instalar como app (PWA)

Una vez desplegada (HTTPS), abre la URL en el celular → menú del navegador → **"Agregar a pantalla de inicio"**.
Funciona offline gracias al service worker (`public/sw.js`).

> Nota: tus datos son locales por dispositivo/navegador. Usa **Ajustes → Exportar/Importar** para respaldar y mover tu progreso entre equipos.
