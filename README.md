# 🌅 RENACER

**Sistema de desarrollo personal + plataforma de aprendizaje de programación, todo en una PWA local-first.**

RENACER reúne en una sola app lo que normalmente requeriría cinco: una plataforma de cursos de programación (estilo academia), un entrenador de inglés, un planificador de carrera para emigrar, un sistema de hábitos gamificado (XP, niveles, logros, rachas) y herramientas de fitness, finanzas y journaling. Funciona **100% en el navegador, sin servidor**: tus datos viven en tu dispositivo.

> 🔒 **Privacidad por diseño:** al ser *local-first* (`localStorage`), no hay backend que almacene nada. Cada quien usa su propia instancia; los datos nunca salen del dispositivo.

---

## ✨ Qué incluye

| Área | Lo que hace |
|---|---|
| 📚 **Cursos** | 25 rutas (JS, TS, Python, React, C#, Lua, Ciberseguridad, Redes, DSA, System Design, Linux, Cloud…) con teoría, ejercicios, **editor que corre código real**, exámenes y certificados. |
| 🗣 **Inglés** | Práctica de leer, escuchar (TTS), hablar (reconocimiento de voz), escribir y deletrear + exámenes y flashcards. |
| 🎮 **Estudio de Roblox** | Generador de juegos por descripción, plantillas, recetario de snippets, guía y **editor de Lua funcional** (wasmoon). |
| 💼 **Empleo internacional** | Vancouver 🇨🇦 · Tokio 🇯🇵 · Durango 🇲🇽 — bolsas de trabajo, calculadora de puntos CRS, checklist migratorio, simulador de entrevistas y **CV que se arma solo**. |
| 🎯 **Gamificación** | XP con curva y tope diario, niveles, **107 logros** en 5 rangos, racha, meta diaria (estilo Duolingo) y misiones semanales. |
| 🧠 **Bienestar** | Fitness con rutina automática por IMC, finanzas, diario emocional, lectura con recomendaciones y reportes de progreso. |
| 🤖 **Personajes IA** | Chat con mentores/personajes (opcional, con tu propia API key). |

---

## 🛠 Stack

- **React 18 + TypeScript + Vite**
- **TailwindCSS** (theming por variables CSS, 8 paletas) + **Framer Motion**
- **Recharts** para visualizaciones
- **React Router v6** con rutas *lazy* + Suspense
- **PWA** (service worker, instalable, offline) · empaquetable a **APK** con Capacitor
- Persistencia: **`localStorage`** (sin backend)

## ⚙️ Decisiones de ingeniería

Detalles que hacen la app rápida y mantenible:

- **Code-splitting agresivo:** cada ruta es un chunk *lazy*; las librerías pesadas (recharts, framer-motion, parsers de PDF/DOCX, runtime de Lua) se cargan **solo cuando se usan**.
- **`LazyMotion` (domAnimation):** carga solo el set de animaciones necesario (−26% del bundle de Framer Motion).
- **recharts diferido:** las gráficas entran tras el primer render, fuera de la ruta crítica del dashboard.
- **Cómputo memoizado:** las estadísticas globales se cachean por render para evitar recálculos.
- **Ledger de XP idempotente:** reconcilia el progreso histórico sin perder puntos al recalcular.

---

## 🚀 Arranque local

Requiere Node 18+. Solo necesitas el frontend:

```bash
cd apps/web
npm install
npm run dev        # http://localhost:5173
```

Producción:

```bash
npm run build      # genera dist/
npm run preview    # sirve el build en http://localhost:4173
```

## 📦 Deploy

Listo para **Vercel** (incluye `vercel.json` con rewrite SPA). Ver **[DEPLOY.md](DEPLOY.md)** para la guía paso a paso (CLI o GitHub) y **[APK.md](APK.md)** para generar el instalable Android.

## 🗂 Estructura

```
apps/web          PWA local-first (el producto principal)
  src/pages       Una página por módulo (lazy-loaded)
  src/components   UI compartida (Layout, Card, gráficas, toasts…)
  src/lib          Lógica: stats, xp, theme, storage, runners…
  src/data         Contenido: cursos, ejercicios, logros, inglés…
apps/api          Backend opcional RENACER AI (Express + Prisma) — no requerido por la web
docs/             Arquitectura y progreso
```

> `apps/api` es un backend de IA opcional/experimental. La PWA funciona completamente sin él.

---

## 📸 Capturas

> _Agrega aquí imágenes en `docs/screenshots/` (dashboard, cursos, Roblox, inglés)._

## 📄 Licencia

Proyecto personal. Úsalo como referencia. 🌱
