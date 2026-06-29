# PROYECTO RENACER — Arquitectura y Plan Maestro

> Sistema Operativo Personal impulsado por IA para transformación física, mental, académica y profesional.
> Mezcla de Duolingo + Habitica + Notion + GitHub + MyFitnessPal + Obsidian + Todoist.

---

## 1. Visión y principios de diseño

| Principio | Significado |
|---|---|
| **Modular** | Cada dominio (Fitness, Inglés, Programación, Diario…) es un módulo independiente que se enchufa al núcleo (RPG, IA, Reportes). |
| **Local-first friendly** | Funciona offline-ligero; sincroniza cuando hay red (PWA + cache). |
| **IA como tejido conectivo** | La IA no es una pestaña: lee datos de todos los módulos y produce mentoría contextual. |
| **Gamificación real** | Todo esfuerzo medible genera XP → estadísticas RPG → niveles, logros, rangos. |
| **Escalable a años** | Esquema de datos versionado, eventos inmutables, migraciones controladas. |
| **Privacidad** | Diario y fotos cifrados en reposo; el usuario es dueño de sus datos (export total). |

---

## 2. Stack tecnológico

### Frontend (`apps/web`)
- **React 18 + TypeScript** — base de UI.
- **Vite** — bundler/dev server rápido.
- **TailwindCSS** — design system utilitario, dark/light por `class`.
- **Framer Motion** — animaciones fluidas (transiciones de página, barras de XP, level-up).
- **TanStack Query** — caché de servidor, sincronización, optimistic updates.
- **Zustand** — estado global ligero (usuario, tema, RPG en vivo).
- **React Router v6** — ruteo.
- **Recharts** — gráficas (peso, IMC, finanzas, XP).
- **react-hook-form + Zod** — formularios validados (tipos compartidos).
- **PWA (vite-plugin-pwa)** — instalable, offline parcial.

### Backend (`apps/api`)
- **Node.js + Express + TypeScript**.
- **Prisma ORM** sobre **PostgreSQL**.
- **JWT** (access + refresh) + **OAuth** (Google) vía Passport.
- **Zod** para validación de requests (esquemas compartidos en `packages/shared`).
- **BullMQ + Redis** — colas para trabajos pesados de IA (análisis de diario, fotos, reportes).
- **OpenAI / Claude (Anthropic) SDK** — capa de IA detrás de una interfaz `AIProvider` intercambiable.
- **Multer + S3-compatible storage** (o disco local en dev) — fotos y audios.
- **PDFKit / ExcelJS** — exportación de reportes.

### Infra / DevOps
- **Monorepo** con workspaces npm/pnpm + **Turborepo** (build cache).
- **Docker Compose** — Postgres + Redis + API + Web en local.
- **Prisma Migrate** — migraciones versionadas.
- **GitHub Actions** — lint + test + build + deploy.
- Deploy sugerido: **Vercel** (web) + contenedor/Render/Fly.io (api) + Neon/Supabase (Postgres) + Upstash (Redis).

---

## 3. Arquitectura de alto nivel

```
                       ┌──────────────────────────┐
                       │      PWA React (web)      │
                       │  Dashboard · Módulos · IA │
                       └─────────────┬────────────┘
                                     │ HTTPS / REST + JSON
                                     ▼
                       ┌──────────────────────────┐
                       │   API Gateway (Express)   │
                       │  Auth · Rate limit · Zod  │
                       └─────────────┬────────────┘
        ┌───────────────┬────────────┼────────────┬───────────────┐
        ▼               ▼            ▼            ▼               ▼
   ┌─────────┐    ┌──────────┐  ┌─────────┐  ┌─────────┐    ┌──────────┐
   │ Módulos │    │  Núcleo  │  │  IA     │  │ Reportes│    │  Media   │
   │ Fitness │    │  RPG/XP  │  │ Mentor  │  │ PDF/XLS │    │ S3/disco │
   │ Inglés  │    │ Misiones │  │ Análisis│  └─────────┘    └──────────┘
   │ Código  │    │ Logros   │  └────┬────┘
   │ Diario  │    └──────────┘       │ async
   │ Finanzas│                       ▼
   │ Lectura │                 ┌──────────┐
   │Proyectos│                 │ BullMQ   │──► Workers IA (Redis)
   └────┬────┘                 └──────────┘
        │ Prisma
        ▼
   ┌──────────────────────────────────────┐
   │           PostgreSQL                  │
   │  users · metrics · xp_events · ...    │
   └──────────────────────────────────────┘
```

**Patrón clave — Event Sourcing ligero para XP:** cada acción que da experiencia escribe un registro inmutable en `xp_events`. Niveles, estadísticas RPG y rachas se *derivan* (y se cachean) de esos eventos. Esto hace el progreso auditable, reproducible y a prueba de bugs de balance.

---

## 4. Estructura de carpetas

```
renacer/
├─ package.json                # workspaces + turbo
├─ turbo.json
├─ docker-compose.yml
├─ .env.example
├─ docs/
│  ├─ ARCHITECTURE.md          # este documento
│  ├─ API.md                   # contrato de endpoints
│  └─ ROADMAP.md               # plan por fases detallado
├─ packages/
│  └─ shared/                  # tipos + esquemas Zod compartidos web/api
│     └─ src/
│        ├─ schemas/           # zod: auth, fitness, english, code, journal...
│        ├─ types/             # tipos derivados
│        └─ constants/         # XP tables, niveles, stats RPG
├─ apps/
│  ├─ api/
│  │  ├─ prisma/
│  │  │  └─ schema.prisma
│  │  └─ src/
│  │     ├─ index.ts           # bootstrap Express
│  │     ├─ config/            # env, db, redis
│  │     ├─ middleware/        # auth, error, rate-limit, validate(zod)
│  │     ├─ lib/               # prisma client, ai provider, storage
│  │     ├─ modules/           # un folder por dominio
│  │     │  ├─ auth/           # controller·service·routes
│  │     │  ├─ users/
│  │     │  ├─ dashboard/
│  │     │  ├─ fitness/
│  │     │  ├─ english/
│  │     │  ├─ programming/
│  │     │  ├─ projects/
│  │     │  ├─ journal/
│  │     │  ├─ mentor/         # IA
│  │     │  ├─ rpg/            # xp, stats, logros, misiones
│  │     │  ├─ reading/
│  │     │  ├─ finance/
│  │     │  └─ reports/
│  │     ├─ jobs/              # workers BullMQ
│  │     └─ ai/                # prompts + análisis (emociones, código, foto)
│  └─ web/
│     ├─ index.html
│     ├─ vite.config.ts
│     ├─ tailwind.config.ts
│     └─ src/
│        ├─ main.tsx
│        ├─ App.tsx
│        ├─ router.tsx
│        ├─ lib/               # api client, query client
│        ├─ stores/           # zustand: auth, theme, rpg
│        ├─ components/
│        │  ├─ ui/             # botones, cards, inputs (design system)
│        │  ├─ charts/
│        │  ├─ layout/         # Sidebar, Topbar, Shell
│        │  └─ rpg/            # XPBar, LevelBadge, StatRadar
│        ├─ features/          # un folder por módulo (mirror del api)
│        │  ├─ dashboard/
│        │  ├─ fitness/
│        │  ├─ english/
│        │  ├─ programming/
│        │  ├─ projects/
│        │  ├─ journal/
│        │  ├─ mentor/
│        │  ├─ reading/
│        │  ├─ finance/
│        │  └─ reports/
│        └─ styles/
```

---

## 5. Diseño de base de datos (modelo de dominio)

### Núcleo / Usuario
- **User** — id, email, passwordHash, oauthProvider, displayName, locale, theme, createdAt.
- **Profile** — userId, birthDate, heightCm, goals (json), startWeight, targetWeight.
- **Setting** — preferencias (notificaciones, privacidad, unidades).

### RPG / Gamificación (núcleo transversal)
- **XpEvent** — id, userId, source (`FITNESS|ENGLISH|CODE|JOURNAL|READING|TASK|HABIT`), refId, amount, stat (`STRENGTH|STAMINA|DISCIPLINE|INTELLIGENCE|KNOWLEDGE|CREATIVITY|CHARISMA|HEALTH|PROGRAMMING|ENGLISH`), createdAt. **(inmutable)**
- **StatSnapshot** — cache derivado: userId, stat, totalXp, level (1–100).
- **Streak** — userId, type, current, longest, lastActiveDate.
- **Achievement** / **UserAchievement** — definición y desbloqueo (insignias, rangos).
- **Mission** — userId, scope (`DAILY|WEEKLY|MONTHLY`), title, target, progress, xpReward, status, dueAt.

### Fitness
- **BodyMetric** — userId, date, weight, waist, neck, chest, arms, legs, bodyFatPct, sleepHours, waterMl, calories.
- **ProgressPhoto** — userId, date, url (cifrada), aiAnalysis (json), tags.
- **Workout** — userId, date, dayType (`CHEST_BACK|LEG|SHOULDER_ARM|CARDIO_ABS|FULL_BODY|CARDIO|REVIEW`), durationMin, notes.
- **WorkoutExercise** — workoutId, name, sets, reps, weight.

### Inglés (academia)
- **EnglishLevel** (A1–C2) → **Course** → **Lesson** → **Exercise** (catálogo, seedable).
- **EnglishProgress** — userId, lessonId, status, score.
- **EnglishSubmission** — userId, exerciseId, type (`SPEAKING|WRITING|...`), payload (texto/audioUrl), aiFeedback (json), score, weakAreas.
- **StudyPlan** — userId, generatedBy `MENTOR`, items (json), createdAt.

### Programación
- **Language** (Python, Java, SQL, …) + **Track** (Web, Backend, Ciberseguridad, ML…).
- **CodeModule** → **CodeLesson** → **CodeChallenge** (teoría, práctica, reto, proyecto).
- **CodeSubmission** — userId, challengeId, language, code, aiReview (json: errores, malas prácticas, explicación), score (1–100), xpAwarded.

### Proyectos
- **Project** — userId, title, type, difficulty, status, grade, totalTimeMin.
- **ProjectTask** — projectId, title, done, order.
- **ProjectLog** — projectId, date, note, minutesSpent.

### Diario
- **JournalEntry** — userId, date, feeling, didToday, learned, worries, happy, improve, **encrypted**.
- **JournalAnalysis** — entryId, emotions (json), stress, anxiety, frustration, motivation, aiResponse, advice, reflection.

### Lectura
- **Book** — userId, title, author, totalPages.
- **ReadingSession** — bookId, date, pagesRead, minutes.
- **BookSummary** — bookId, aiSummary, comprehensionQuiz (json), score.

### Finanzas
- **FinanceAccount** — userId, name, balance.
- **Transaction** — userId, type (`INCOME|EXPENSE|SAVING`), amount, category, date, note.
- **Budget** — userId, category, monthlyLimit.

### IA / Mentor
- **MentorReport** — userId, scope (`DAILY|WEEKLY|MONTHLY`), content, generatedAt.
- **AiInteraction** — userId, module, prompt, response, tokensUsed (auditoría + memoria del Mentor).

> **Memoria del Mentor:** se construye con un *resumen rodante* (rolling summary) por usuario + recuperación de `AiInteraction`, `MentorReport` y métricas recientes, inyectados como contexto. Así "recuerda" el historial sin enviar toda la base.

---

## 6. Contrato de API (REST, prefijo `/api/v1`)

| Área | Endpoints principales |
|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh` · `GET /auth/google` · `POST /auth/logout` |
| Usuario | `GET /me` · `PATCH /me` · `GET /me/settings` · `PATCH /me/settings` |
| Dashboard | `GET /dashboard` (agrega nivel, XP, peso, racha, tareas, horas, estado, calificación del día, objetivos) |
| RPG | `GET /rpg/stats` · `GET /rpg/achievements` · `GET /rpg/missions` · `POST /rpg/missions/:id/complete` |
| Fitness | `GET/POST /fitness/metrics` · `GET/POST /fitness/workouts` · `POST /fitness/photos` · `GET /fitness/trends` · `POST /fitness/analyze` |
| Inglés | `GET /english/levels` · `GET /english/lessons/:id` · `POST /english/submissions` · `GET /english/plan` · `POST /english/plan/generate` |
| Programación | `GET /code/languages` · `GET /code/tracks` · `GET /code/challenges/:id` · `POST /code/submissions` (devuelve review IA + score) |
| Proyectos | `CRUD /projects` · `CRUD /projects/:id/tasks` · `POST /projects/:id/logs` |
| Diario | `GET/POST /journal` · `GET /journal/:id` (incluye análisis IA) |
| Mentor | `GET /mentor/advice` · `POST /mentor/ask` · `GET /mentor/reports?scope=` |
| Lectura | `CRUD /reading/books` · `POST /reading/sessions` · `POST /reading/books/:id/summary` |
| Finanzas | `CRUD /finance/transactions` · `CRUD /finance/budgets` · `GET /finance/trends` |
| Reportes | `GET /reports?scope=daily|weekly|monthly|yearly` · `GET /reports/export?format=pdf|xlsx` |

**Convenciones:** respuestas `{ data, meta }`, errores `{ error: { code, message, details } }`, validación Zod en cada body, JWT en `Authorization: Bearer`.

---

## 7. Capa de IA (cómo "piensa" RENACER)

Interfaz única `AIProvider` (swappable entre Claude/OpenAI). Servicios especializados con prompts versionados:

| Servicio IA | Entrada | Salida |
|---|---|---|
| `analyzeJournal` | texto del diario | emociones, estrés/ansiedad/motivación, respuesta **personalizada** (cita lo que escribió), consejo, reflexión |
| `reviewCode` | código + lenguaje | errores, malas prácticas, explicación, score 1–100, XP |
| `gradeEnglish` | texto/audio + skill | correcciones, calificación, áreas débiles, feedback |
| `generatePlan` | historial + nivel | plan de estudio + ejercicios personalizados |
| `analyzePhoto` | foto(s) + métricas | comparación de avance, cambios físicos estimados |
| `mentorReport` | resumen multi-módulo | consejo diario/semanal, informe mensual, advertencias |

Reglas: **nunca respuestas genéricas** — siempre se inyecta contexto del usuario (últimas métricas, entradas, objetivos). Trabajos largos van a **cola BullMQ** y notifican vía polling/websocket.

---

## 8. Flujo de usuario (journey)

```
Registro/OAuth → Onboarding (peso inicial, meta, objetivos, nivel inglés/código,
   horario de rutina) → genera Misiones diarias + Plan de estudio inicial
        │
        ▼
   DASHBOARD (cada día)
   ├─ ve nivel, XP, racha, calificación del día, objetivos
   ├─ entrena → registra Workout/métricas → +XP Fuerza/Resistencia
   ├─ estudia inglés → submission → IA califica → +XP Inglés
   ├─ programa → submission → IA revisa → +XP Programación
   ├─ escribe diario → IA analiza emociones → responde
   ├─ lee / registra finanzas / avanza proyecto → +XP
   ├─ completa Misiones → sube de nivel → desbloquea Logros/Insignias
   └─ Mentor IA da consejo del día
        │
        ▼
   Fin de semana/mes → Reportes automáticos + Informe del Mentor → ajustes
```

---

## 9. Plan de desarrollo por fases

| Fase | Objetivo | Entregables |
|---|---|---|
| **0 — Cimientos** (sem 1-2) | Monorepo, Docker, Prisma, Auth JWT/OAuth, design system, dark/light, shell + sidebar. | Login funcional, layout, tema. |
| **1 — Núcleo RPG + Dashboard** (sem 3-4) | XpEvents, stats derivadas, niveles, rachas, misiones, dashboard agregado con gráficas. | Dashboard vivo + gamificación. |
| **2 — Fitness** (sem 5-6) | Métricas corporales, rutina semanal, gráficas peso/IMC/tendencias, fotos. | Módulo Fitness completo. |
| **3 — Diario + Mentor IA** (sem 7-8) | Diario cifrado, análisis de emociones, respuestas personalizadas, consejo diario. | IA contextual operativa. |
| **4 — Inglés** (sem 9-11) | Academia A1–C2, ejercicios, submissions, corrección IA, plan generado. | Módulo Inglés. |
| **5 — Programación** (sem 12-14) | Lenguajes + rutas, retos, review de código IA con score/XP. | Módulo Programación. |
| **6 — Proyectos + Lectura + Finanzas** (sem 15-17) | CRUDs, checklists, sesiones, resúmenes IA, gráficas financieras. | 3 módulos. |
| **7 — Reportes + Export** (sem 18-19) | Reportes diario/semanal/mensual/anual, PDF/Excel, informe Mentor mensual. | Reportería. |
| **8 — Pulido** (sem 20+) | Animaciones, PWA offline, análisis de fotos, logros avanzados, performance. | Producto pulido. |

---

## 10. Seguridad y calidad
- Hash de contraseñas con **argon2**; JWT corto + refresh rotativo.
- Diario y URLs de fotos **cifrados en reposo** (AES-256); fotos en buckets privados con URLs firmadas.
- Rate limiting + Helmet + CORS estricto.
- Validación Zod en todo input; tipos compartidos eliminan drift web↔api.
- Tests: Vitest (unidad) + Supertest (api) + Playwright (e2e críticos).
- Migraciones Prisma versionadas; seeds para catálogos (inglés, lenguajes, logros).
