# 📌 Progreso — RENACER AI

_Última sesión: 2026-06-15 · Próxima: 2026-06-16_

## 2026-06-16 — ✅ +6 cursos (17 total) + más ejercicios de Inglés

- Cursos nuevos: **Go** (3 niv), **Rust** (2 niv), **Kotlin** (3 niv), **TypeScript** (3 niv, req JS≥50%), **Docker** (2 niv), **Git & GitHub** (3 niv). Cada uno con teoría/ejercicios/exámenes/proyectos. **Total: 17 cursos.**
- **Más ejercicios de Inglés**: +6 lecciones (greetings, comparativos, question forms, gerundios, phrasal verbs avanzados, y **Tech & interview English** B1 enfocado a entrevistas para Vancouver). Total inglés ahora **118** ejercicios (quizzes + pronunciación).
- Verificado: 17 cursos en la ruta; inglés con 118 ejercicios. Build exit 0.

---

## 2026-06-16 — ✅ +7 cursos nuevos (11 cursos en total)

- Añadidos a la ruta de Cursos: **HTML** (3 niv), **CSS** (3 niv, req HTML≥50%), **SQL** (3 niv), **PHP** (3 niv, req HTML≥50%), **C++** (3 niv), **Assembly x86** (2 niv), **Angular** (3 niv, req JavaScript≥50%). Cada uno con teoría/ejemplos/buenas prácticas/errores, ejercicios por dificultad, exámenes de desbloqueo y proyectos.
- Total ahora: **11 cursos** (Java, Python, JavaScript, HTML, CSS, SQL, PHP, C++, Assembly, React, Angular). Cadenas de prerrequisitos: HTML→CSS/PHP, JavaScript→React/Angular.
- Verificado en navegador: 11 cursos renderizan; CSS🔒/PHP🔒 bloqueados sin HTML. Build exit 0.

---

## 2026-06-16 — ✅ Fusión: "Aprendizaje" + "Programación" → un solo módulo "Cursos"

- El usuario notó que Aprendizaje y Programación eran lo mismo. Se **unieron en un único módulo "Cursos"** (`/learning`) con dos pestañas: **📚 Ruta de cursos** (la ruta estructurada Java/Python/JS/React con niveles/exámenes) y **⚡ Práctica rápida** (la antigua Programación: consola JS + retos por lenguaje, embebida con `<Programming embedded />` que oculta su PageHeader).
- Eliminados del menú y del router la entrada/ruta **Programación**. `Programming.tsx` ahora se renderiza dentro de Cursos.
- Verificado: menú muestra "Cursos" (no "Programación"); ambas pestañas funcionan (ruta de cursos + consola/retos), sin título duplicado. Build exit 0.

---

## 2026-06-16 — ✅ Curso React COMPLETO (4 cursos completos)

- **React** pasó de 1 nivel (stub) a **6 niveles completos**: Fundamentos, Estado y Eventos, Listas y Condicionales, Efectos y Datos (useEffect/fetch), Formularios, Profesional (custom hooks/Context/routing) — con teoría/ejemplos/buenas prácticas/errores, ejercicios por dificultad (hasta Experto), exámenes de desbloqueo (react-1..react-6) y proyecto (Dashboard/E-Commerce).
- **Prerrequisito mejorado**: React ahora requiere **JavaScript ≥50%** (ruta lógica), no Java.
- Los **4 cursos** (Java 10, Python 6, JavaScript 5, React 6 niveles) comparten estructura uniforme: teoría → ejercicios → examen → proyecto, con desbloqueo por niveles + prerrequisitos de curso.
- Verificado: con JS ~62% React se desbloquea y muestra sus 6 niveles. Build exit 0.

---

## 2026-06-16 — ✅ Curso JavaScript + Repaso espaciado + PWA

- **Curso JavaScript** (`data/courses.ts`): 5 niveles (Fundamentos, Funciones/Scope, Arrays/Objetos, DOM/Eventos, Asincronía) con teoría/ejercicios/exámenes + proyectos (To-do, App del clima). Ya son **4 cursos**: Java, Python, JavaScript, React.
- **Repaso espaciado** (`lib/learning.ts`: `markLevelPracticed`, `reviewDue`): registra cuándo practicaste cada nivel (localStorage `renacer_review`); si pasan ≥7 días de un nivel completado, lo recomienda en una tarjeta "🔁 Repaso recomendado" (Aprendizaje) y en las Notas del Mentor. Verificado con timestamp de 12 días.
- **PWA instalable**: `public/manifest.webmanifest` + `public/icon.svg` + `public/sw.js` (network-first con caché → offline) + registro en `main.tsx` + metas en `index.html`. En dist se empaquetan los 3 archivos. (Instalación real: probar "Instalar app" en Chrome/celular.)
- Build exit 0; verificado en navegador (4 cursos, repaso, sin errores).

---

## 2026-06-16 — ✅ Curso Python + Examen de desbloqueo

- **Examen de desbloqueo** (`EXAMS` en `data/courses.ts`): cada nivel tiene un test (3 preguntas, ≥70% para aprobar). `levelComplete` ahora exige **ejercicios completos Y examen aprobado** → así se gatea el desbloqueo del siguiente nivel. UI `ExamBlock` en `pages/Learning.tsx`: el examen se desbloquea al terminar los ejercicios, corrige al entregar, marca ✅ o pide reintentar. Verificado: con ejercicios pero sin examen N2 sigue bloqueado; al aprobar examen N1→✅ y N2 desbloquea.
- **Curso Python** (`data/courses.ts`): 6 niveles (Fundamentos→Profesional) con teoría/ejemplos/buenas prácticas/errores, ejercicios por dificultad y proyecto (analizador de datos). Disponible sin prerrequisito. Exámenes para los 6 niveles + los 10 de Java.
- Build exit 0; verificado en navegador (3 cursos: Java/Python/React).

---

## 2026-06-16 — ✅ Integración REAL con GitHub

- **`lib/github.ts`**: cliente de la API de GitHub desde el navegador con el PAT del usuario (localStorage `renacer_github_token`; GitHub permite CORS con token). Funciones: ghUser, ghRepos, ghCreateRepo (auto_init), ghPutFile (Contents API, base64 UTF-8, maneja sha create/update), slug.
- **Página GitHub** (`/github`, `pages/GitHub.tsx`): conectar/desconectar (valida token, muestra avatar/login), **crear repo**, **subir archivo/código** (commit a un repo elegido — sirve para documentos y para "programar ahí"), listar repos. Nota honesta sobre LinkedIn (API cerrada → solo enlace de compartir).
- **Proyectos**: botón **🐙 Subir a GitHub** por proyecto → crea repo (slug del título) + commitea README con tareas. Verificado: sin token avisa "Conéctate primero".
- Build exit 0; UI verificada (la subida real requiere el PAT del usuario).

---

## 2026-06-16 — ✅ CV Manager + Job Matcher + GitHub README

- **CV Manager** (`/cv`, `pages/CV.tsx`): el CV se construye solo desde el progreso — skills derivadas (Java/Spring/SQL/Docker/React/Inglés con nivel), proyectos del módulo Proyectos, datos editables (perfil, contacto, experiencia). Vista previa imprimible (CSS `@media print` + `.no-print` en nav) → **Imprimir/PDF** y **copiar texto**. Persistido en `renacer_cv`.
- **Generador de README de GitHub**: arma un markdown de perfil (nombre, headline, skills, proyectos) para pegar en `usuario/usuario`. (Auto-push real necesita token/OAuth — pendiente futuro.)
- **Job Matcher** (en `/career`, `data/jobs.ts`): vacantes reales de Vancouver (Mogo, Clio, SAP, Hootsuite, Trulioo, Later) ordenadas por **compatibilidad %** vs tus skills; marca **⭐ Mejor match** y aconseja (Aplica ya / Aplica y refuerza / Aún no). Añadir vacantes propias. Enlaces directos a LinkedIn/Indeed/Job Bank con filtro Vancouver+Java. Verificado: con buen progreso → overall 67%, Mejor match y "Aplica ya".
- Build exit 0; verificado en navegador.

---

## 2026-06-16 — ✅ Ecosistema de Aprendizaje + Career/Canadá (Fase 1 de la gran visión)

Primera fase del spec "RENACER AI - Visión Completa": mentor digital estructurado hacia un empleo dev en Vancouver.
- **Aprendizaje** (`/learning`, `data/courses.ts` + `lib/learning.ts` + `pages/Learning.tsx`): cursos con estructura global (Nivel → subtemas → Teoría {teoría, ejemplo, buenas prácticas, errores} → Ejercicios por dificultad Básico/Intermedio/Avanzado/Experto con objetivo, pista y solución → Proyecto de etapa). **Java seedeado con 10 niveles** (Fundamentos→Profesional). **Desbloqueo por niveles** (un nivel se abre al completar el anterior) y **prerrequisitos de curso** (React bloqueado hasta Java ≥50%). Verificado: N1 completo → N2 desbloquea, N3 sigue 🔒.
- **Notas inteligentes del Mentor** (`learningNotes`): mensajes auto-generados del progreso, en Aprendizaje y Dashboard.
- **Career & Immigration** (`/career`): **Canada Roadmap** con 8 indicadores (Inglés/Java/Spring/React/Docker derivados del progreso real + GitHub/CV/Entrevistas manuales) y % global hacia Vancouver; **Skill Gap Analyzer** (compatibilidad % vs vacante + faltantes); **Application Tracker** (empresa/ciudad/fecha/estado); **Interview Trainer** → personaje IA "Mr. Reyes" (reclutador de Vancouver, entrevista en inglés).
- Build exit 0; verificado en navegador.

**PENDIENTE de la visión (fases siguientes):** más cursos (Python, JS, React completo, SQL), generador de ejercicios dinámico, repaso espaciado por fechas, exámenes de desbloqueo formales, proyectos combinados con requisitos, Job Hunter (scraping de vacantes reales), CV Manager con versiones, analizador de preparación, integración Memoria↔IA.

---

## 2026-06-16 — ✅ Móvil + rendimiento + Ajustes/Backup

- **Navegación móvil**: barra superior con ☰ y menú desplegable (antes el sidebar `hidden md:flex` dejaba el celular sin navegación). Verificado a 375px: sidebar oculto, hamburguesa funcional.
- **Rendimiento (code-splitting)**: rutas con `React.lazy` + Suspense → bundle inicial de **856 KB → 333 KB**; Recharts (368 KB) y cada página en chunks separados bajo demanda.
- **Ajustes** (`/settings`): editar perfil (nombre, objetivo, peso, altura), **copia de seguridad** (exportar/importar JSON de todo `renacer_*` vía `lib/storage`), y borrar cuenta. `saveProfile/exportAccount/importAccount` añadidos.
- Verificado: Ajustes carga (lazy), 5 campos, export/import/peligro presentes; móvil OK; sin errores de consola. Build exit 0.

---

## 2026-06-16 — ✅ Proyectos: estado dinámico + pasos recomendados

- **Estado automático** del proyecto según las tareas marcadas: Sin tareas → Por empezar → En progreso → Completado (badge), con fecha "Actualizado:" que se refresca al marcar/añadir.
- **Pasos recomendados** (roadmap): `suggestSteps` sugiere tareas según el tipo (Web/Móvil/Videojuego/API…) + extras por palabras clave del título (login→auth, tienda→pago, base de datos→DB). Añadir uno a uno o "Añadir todos".
- Verificado: "Tienda online" → 8 pasos (incl. pasarela de pago); añadir todos → "Por empezar"; marcar 1 → "En progreso" + Actualizado. Build exit 0.

---

## 2026-06-16 — ✅ Más logros + calendario + voz en el chat

- **37 logros** (antes 21): nuevos hitos de inglés/código/fitness/lectura/finanzas/racha/nivel/días activos.
- **Calendario de actividad** (`components/ActivityCalendar.tsx`): heatmap tipo GitHub de 18 semanas con etiquetas de mes y leyenda, en la página de Logros.
- **Detalle**: mejor racha (`getLongestStreak`), días activos, desglose por rango (Bronce/Plata/Oro), barras de progreso en logros bloqueados.
- **Voz en el chat de Personajes**: TTS (`speak`) lee las respuestas en voz alta — Ms. Taylor en inglés (`lang:'en-US'`); botón 🔊 Voz, 🔊 por mensaje y 🎤 micrófono (STT) para hablarle.
- Verificado: 11/37 desbloqueados, desglose Bronce 7/10·Plata 4/13·Oro 0/14, calendario 126 celdas, mejor racha 5, botones de voz/mic presentes. Build exit 0.

---

## 2026-06-16 — ✅ Profundidad: Logros, rachas, IMC, stats centrales

- **Motor central** `lib/stats.ts` (`computeStats`) que calcula todo desde la cuenta: ejercicios por área, diario+ánimo medio, libros/páginas, finanzas, proyectos, peso/delta, IMC, nivel/puntos, racha y días activos.
- **Logros** (`data/achievements.ts` + `pages/Achievements.tsx`, ruta `/achievements`): 21 insignias con rango bronce/plata/oro, se desbloquean con actividad real; las bloqueadas muestran progreso.
- **Racha / días activos**: `markActive` se dispara al completar ejercicios o crear elementos; `getStreak` cuenta días consecutivos.
- **IMC** con clasificación (se añadió altura al onboarding); visible en Fitness y Dashboard.
- **Dashboard** enriquecido: chips de racha y logros, iconos de insignias, kg perdidos, ánimo medio, IMC.
- **Reportes** ampliado a 21 métricas (incluye racha, días activos, logros, IMC, peso perdido, ánimo) + export CSV.
- Verificado: Logros 10/21, IMC 25.9 "Sobrepeso", delta −3 kg, ánimo 5/5. Build exit 0.

---

## 2026-06-16 — ✅ Módulo "Personajes" (estilo Character.AI)

- Nuevo módulo `🎭 Personajes`: galería de 6 presets + crear personaje propio (persistente), cada uno con chat con su personalidad.
- **Ms. Taylor (tutora de inglés) destacada como ⭐ Recomendado y primera** — persona optimizada para enseñar inglés (correcciones con formato ✅/💡, nivel adaptativo, vocabulario, pronunciación, siempre termina con pregunta).
- IA real desde el navegador: `lib/llm.ts` llama a Claude (`api.anthropic.com` con header `anthropic-dangerous-direct-browser-access`). API key + modelo se guardan SOLO en localStorage (card ⚙️ Conexión). Sin key → modo demo.
- Chats persistentes por personaje. Verificado en navegador (galería, recomendado, chat abre + envía; respuesta real requiere API key del usuario).
- Nota seguridad: la key vive en el navegador del usuario (ok para uso personal local; no para producción compartida).

---

## 2026-06-16 — ✅ Micrófono + teoría + consola + más ejercicios

- **Inglés con micrófono**: sección "Pronunciación (Speaking)" con Web Speech API (`lib/speech.ts`), 10 frases; compara lo dicho con la frase (≥80% acierto = ✓) y suma a la aprobación del nivel.
- **Teoría esencial**: `LESSON_THEORY` (inglés, por lección) y `LANG_THEORY` (programación, por lenguaje) renderizadas como tarjeta 📖.
- **Mini-consola** (`components/CodeRunner.tsx`): ejecuta JavaScript real (captura console.log) — global en Programación + botón "Escribir código" por reto.
- **Más ejercicios**: Inglés ~83 (quizzes + speaking), Programación ~57 retos.
- Verificado en navegador: consola imprime "Hola, RENACER"; teoría Python visible; sección de pronunciación y micrófono presentes.

**Pendiente (a decisión del usuario):** asistente IA conversacional ("veremos si lo metemos").

---

## 2026-06-16 — ✅ Mejoras pedidas (sin IA)

- **Proyectos**: dificultad **automática** por heurística que lee el nombre + tipo (★ en vivo; "Sistema médico distribuido…" → Muy difícil, "Landing page" → Muy fácil).
- **Diario**: gráfica de **ánimo en el tiempo** (LineChart) + **escala de color por entrada** + stats (ánimo medio).
- **Cursos**: más ejercicios (Inglés 53, Programación 37).
- **Nivel 90%**: en Inglés los niveles se **bloquean** (🔒) hasta aprobar el anterior con ≥90% (verificado: A1✓ desbloquea A2, B1–C2 bloqueados). En Programación, ✓ al dominar un lenguaje (≥90%).
- **Fitness**: sección **Tips** (Agua, Comidas, Ejercicio, Relajación, Motivación, Hábitos).
- Verificado en navegador + build exit 0.

---

## 2026-06-16 — ✅ App completa SIN IA (todos los módulos funcionales y persistentes)

Todos los módulos del frontend ahora funcionan de verdad, persistentes por cuenta (localStorage), sin nada de IA/asistente:
- **Diario**: escribir entradas + estado de ánimo + historial (sin análisis IA).
- **Lectura**: añadir libros, registrar páginas (+10/+25), progreso y stats.
- **Proyectos**: crear proyectos, tareas con checklist, dificultad, progreso.
- **Finanzas**: ingresos/gastos/ahorro reales, gráfica por categoría, balance, historial.
- **Fitness**: el registro de métricas se guarda y alimenta la gráfica de peso real.
- **Reportes**: resumen calculado desde toda la cuenta + exportar CSV / imprimir.
- **Dashboard**: nivel/puntos/peso/radar/objetivos derivados de datos reales; eliminada la tarjeta "Mentor IA".
- Motor de datos: `lib/storage.ts` → `useLocalList` + `readList` + `uid` (listas persistentes por cuenta).

Verificado: build exit 0, sin errores de consola, snapshot del Dashboard con datos reales. (La parte de IA queda pendiente para una próxima iteración, por decisión del usuario.)

---

## 2026-06-16 — ✅ Ejercicios + cuenta desde cero + rediseño

- **Rediseño visual** (frontend-design): tipografías Sora + Manrope, paleta ámbar/ember sobre tinta cálida, atmósfera radial. Eliminado el módulo Asistente (avatar/voz/realtime).
- **Cuenta local desde cero**: `components/Onboarding.tsx` + `lib/storage.ts` (perfil + progreso en localStorage). Layout muestra la pantalla de alta si no hay cuenta; nombre + "cerrar sesión/reiniciar" en el sidebar.
- **Ejercicios interactivos** (persisten por cuenta): Inglés `data/english.ts` (37 quizzes A1–C2 con corrección y explicación), Programación `data/programming.ts` (27 retos por lenguaje con solución revelable + marcar hecho), Fitness `data/fitness.ts` (rutina semanal con ejercicios series×reps, casillas, HOY resaltado, progreso por día).
- Dashboard saluda con tu nombre y muestra ejercicios completados reales.
- Verificado en navegador (preview) + `npm run build` exit 0.

---

## 2026-06-16 (noche, 2) — ✅ LLM real enchufado (Anthropic/Claude)

`apps/api/src/lib/ai.ts` ahora usa el SDK oficial `@anthropic-ai/sdk` con el modelo `claude-opus-4-8`
(configurable por `AI_MODEL`), detrás de la interfaz `AIProvider` existente. Fallback automático a modo demo
si no hay `ANTHROPIC_API_KEY` (no crashea), y manejo de errores que degrada con elegancia en vez de tumbar la petición.
Verificado: backend `tsc` exit 0 + arranque real + chat respondiendo (modo demo sin key). Para activar IA real:
poner `ANTHROPIC_API_KEY=sk-ant-...` en `apps/api/.env`. **Es el único paso que faltaba para que MENTOR hable de verdad.**

---

## 2026-06-16 (noche) — ✅ PROBADO END-TO-END contra Postgres real

Sin Docker ni Postgres instalado, se usó **`embedded-postgres`** (binario real, sin instalación) para correr todo de verdad:
- `npm run db:embedded` levanta Postgres 18 en localhost:5432 (db `renacer` en **UTF8** — ojo: el default de Windows es WIN1252 y rompe los acentos; el script ya fuerza UTF8).
- `prisma db push` + `npm run db:seed` → esquema + usuario demo (`demo@renacer.ai` / `renacer123`).
- API levantada con `FEATURE_REALTIME=true`. **Probado con curl y funcionando:** login JWT, `GET /me/dashboard` real,
  `POST /fitness/metrics` (+10 XP HEALTH real en DB), `POST /journal` (análisis emocional Core IA + XP), `POST /core/chat`
  (orquestador: intención `log_workout` detectada, conversación persistida), `POST /core/recommendations/generate`
  (el Mentor leyó datos multi-módulo y citó el objetivo real "Bajar a 75 kg"). Datos confirmados persistidos en Postgres.

**Único cable que falta para IA "de verdad":** el `AIProvider` está en modo **Mock** (responde "ejemplo"). Toda la maquinaria
(emoción, memoria, intención, persistencia, RPG) es real; falta enchufar Claude/OpenAI con una API key en `lib/ai.ts`.

**Para reproducirlo:** `cd apps/api && npm run db:embedded` (deja corriendo) → en otra terminal `npm run db:push && npm run db:seed && npm run dev`.

---

## 2026-06-16 (tarde) — ✅ Backend de dominio COMPLETO

Todos los módulos de dominio ahora tienen backend real (Prisma + XP automático vía motor RPG), additive:
`fitness`, `journal` (con análisis emocional del Core IA), `reading`, `finance`, `english`, `code`, `projects`,
y `GET /me/dashboard` (agregado real). Más `prisma/seed.ts` (usuario demo `demo@renacer.ai` / `renacer123` + catálogos
de 17 lenguajes, 18 rutas, niveles A1–C2). Cambio de schema: 2 FKs relajadas a opcionales (EnglishSubmission.exerciseId,
CodeSubmission.challengeId) — seguro, esas tablas no tenían datos. Backend `tsc` exit 0.

**Pendiente clave:** las 11 páginas web siguen con datos mock → falta cablearlas a estos endpoints (necesita DB corriendo
para verificar de verdad). Lo grande con dependencias externas: Live2D (assets), Voz (API keys), Desktop Agent, pgvector.

---

## Estado actual: ✅ Fundación RENACER AI (fases AI-0 → AI-3) construida y verificada

- Backend `npx tsc --noEmit` → **exit 0**
- Frontend `npm run build` → **exit 0**
- Prisma schema → **válido**, cliente generado
- Todo **additive-only**: nada existente se eliminó ni modificó en comportamiento.

## Lo que quedó funcionando

**App base (sesiones previas):** monorepo (`apps/web`, `apps/api`, `packages/shared`), 11 páginas web,
auth JWT+argon2, motor RPG con event sourcing, 35+ tablas Prisma.

**RENACER AI (esta sesión):**
- Core IA: Event Bus tipado, Orquestador, Conversación, Emoción, Decisiones, Recomendaciones, RPG re-export.
  → `apps/api/src/core/**`
- Memoria semántica + objetivos/hábitos → `apps/api/src/modules/memory/**`
- 20+ tablas nuevas en `prisma/schema.prisma` (Conversation, Memory, Goal, Habit, Voice*, Avatar*, DeviceAgent, PcAction, Automation, Integration…)
- WebSocket Gateway → `apps/api/src/realtime/gateway.ts`
- Asistente frontend (chat + voz navegador STT/TTS + avatar emocional) → `apps/web/src/pages/Assistant.tsx`, `apps/web/src/features/assistant/**`
- Feature flags → `apps/api/src/config/flags.ts` (Core IA on; Realtime y Control de PC off)

**Endpoints vivos:** `POST /core/chat`, `GET|POST /core/recommendations`, `GET /core/conversations/:id/messages`,
`POST /memory`, `POST /memory/search`, `CRUD /memory/goals`, `CRUD /memory/habits`.

## Cómo retomar mañana

```bash
# Frontend solo (modo demo, sin backend):
cd renacer/apps/web && npm run dev      # → http://localhost:5173/assistant

# Stack completo:
cd renacer && docker compose up -d
cp .env.example .env                    # rellenar claves
cd apps/api && npm run db:migrate && npm run dev
cd ../web && npm run dev
```

## Próximos pasos (decidir cuál seguir)

1. ✅ **HECHO (2026-06-16) — Asistente conectado al WebSocket.** Avatar y recomendaciones reaccionan en vivo vía eventos del bus; indicador "en vivo". Cliente `web/src/lib/realtime.ts` + hook `features/assistant/useRealtime.ts`. Requiere `FEATURE_REALTIME=true` en la API y token en localStorage; en modo demo muestra "sin conexión" (graceful). _Pendiente opcional: streaming token-a-token (requiere extender el AIProvider)._
2. **Avatar Live2D real** (fase AI-5) → sustituir el placeholder por Cubism SDK + lip-sync. Misma interfaz `emotion`/`speaking`.
3. **Voz de producción** (fase AI-4) → Whisper/ElevenLabs detrás de `TTSProvider`.
4. **Desktop Agent + Control de PC** (fase AI-7) → el de mayor riesgo, dejar para el final. Diseñar contrato allowlist + confirmación primero.
5. **Migración pgvector** → cambiar embeddings deterministas por reales; `Memory.embedding` ya existe como `Float[]`.
6. **Cablear las 11 páginas existentes al backend real** (hoy usan datos mock).

## Deudas técnicas conscientes (cimiento → producción)
- Embeddings deterministas (hashing) → embeddings reales + pgvector.
- Análisis emocional por léxico → combinar con `AIProvider`.
- Sin tests de caracterización aún (recomendado antes de seguir tocando `/auth` y `/rpg/stats`).
- Bundle web > 500 kB → code-splitting pendiente.

> Diseño completo en `docs/RENACER-AI-PLAN.md` (§11 = estado de implementación).

---

## 2026-06-22 · +6 cursos → 23 cursos en total
Añadidos a `data/courses.ts` (consts + entradas en `EXAMS` + array `COURSES`):
- **🛡️ Ciberseguridad** (3 niveles): Fundamentos (CIA, malware, phishing) · Vulnerabilidades web/OWASP (SQLi, XSS, CSRF) · Defensa y criptografía (bcrypt/argon2, TLS, mínimo privilegio). Enfoque defensivo/educativo. + proyecto mini-auditoría.
- **🌐 Redes** (3 niveles): Fundamentos (TCP/IP, OSI, IP, puertos) · Protocolos (TCP/UDP, DNS, handshake) · Subredes y herramientas (CIDR, ping/traceroute, router vs switch). + proyecto mapa de red.
- **🧮 Algoritmos y Estructuras (DSA)** (3 niveles): Big-O y arrays · Pilas/colas/listas/hash · Árboles/grafos/recursión. + proyecto 10 retos LeetCode.
- **🏗️ System Design** (3 niveles, requiere Redes ≥50%): Fundamentos/escalado · Caché/BD/balanceo · Colas/microservicios/CAP. + proyecto "diseña Twitter".
- **🐧 Linux & Terminal** (3 niveles): Navegación/archivos · Permisos/procesos · Pipes/scripts/SSH. + proyecto script de respaldo.
- **☁️ Cloud / AWS** (3 niveles, requiere Linux ≥50%): Fundamentos cloud · Cómputo/almacenamiento (EC2/S3/Lambda) · Redes/seguridad/CI-CD/IaC. + proyecto despliegue.

Todos con teoría + ejemplo + buenas prácticas + errores comunes + exámenes (corte 70%). Build EXIT 0 (1223 módulos). Verificado en preview: `COURSES.length === 23`, exámenes enlazados y prerrequisitos OK.
Enfoque del bloque: ruta de empleabilidad para Vancouver 🍁 (DSA + System Design = entrevistas técnicas; Linux + Cloud = backend/DevOps).

---

## 2026-06-22 · Certificados, Roadmap y mejoras cruzadas entre módulos
**Cursos (Learning):**
- 🎓 **Certificados**: al completar un curso al 100% aparece banner + modal de certificado imprimible (window.print aislado vía clase `printing-cert` en `index.css`), con nombre del perfil, curso y fecha. Sección "Mis certificados" y 🎓 en tarjetas completas. Helpers `courseComplete`/`completedCourses` en `lib/learning.ts`.
- 🗺️ **Ruta recomendada** (`ROADMAP` en `lib/learning.ts`): 5 fases (Cimientos→Especialización) que ordenan los 23 cursos hacia el objetivo Vancouver, con progreso por fase y chips clicables. Componente `Roadmap` en `Learning.tsx`.
- ➕ **Más ejercicios DSA**: niveles 1-3 ampliados (Boyer-Moore, invertir lista, fib memo, maxDepth…). DSA: 17 ejercicios.
- 🧠 Notas del Mentor ahora globales: certificados ganados + "siguiente curso de tu ruta".

**Integración cruzada (el sistema de cursos ya alimenta el resto):**
- `lib/stats.ts`: nuevos `courseExercises` y `coursesCompleted`; los ejercicios de cursos ahora suman a `exercises` y `points` (+3 por curso completado).
- `data/achievements.ts`: +4 logros de certificados (course-1/3/5/10). Total 41 logros.
- `pages/Achievements.tsx`: tarjeta "Cursos · certificados 🎓".
- `pages/Dashboard.tsx`: tarjeta "Ruta de cursos" enlazada + radar (Programación/Conocimiento) refleja cursos.
- `pages/Reports.tsx`: filas "Ejercicios de cursos" y "Cursos completados" (también en el CSV).

Build EXIT 0 (1223 módulos). Verificado en preview: certificado de Git mostró nombre real; stats `coursesCompleted`/`courseExercises` OK; Dashboard/Logros/Reportes renderizan las métricas nuevas.

---

## 2026-06-22 · Recomendador de proyectos según cursos aprendidos
- Nuevo `data/projectIdeas.ts`: 19 ideas (`ProjectIdea`) con `requires` (ids de curso), `difficulty`, `type`, `combo`, `vancouver` y `tasks` (primeros pasos). Cubren un solo lenguaje y **combos** (React+TS+SQL, Java+SQL+Docker, React+TS+Cloud, Go+Docker+Redes, Ciber+JS, Linux+Git+Docker, JS+SystemDesign…).
- Helper `courseLearned(courseId, done, threshold=50)` en `lib/learning.ts`.
- `pages/Projects.tsx`: sección "💡 Proyectos sugeridos para ti" que clasifica las ideas en **✅ Puedes construirlos ya** (tienes todos los cursos ≥50%), **🔜 Casi listos** (te falta 1 curso) y **bloqueados** (toggle). Cada idea muestra el stack con iconos/colores del curso, estrellas de dificultad y badges 🔀 Combo / 🍁 Portafolio. Botón "+ Crear este proyecto" que lo añade a tus proyectos con los primeros pasos precargados (evita duplicados → "Ya está en tus proyectos").

Build EXIT 0 (1224 módulos). Verificado en preview con datos reales: con JavaScript+Git ≥50% → 1 listo (Snake), 10 casi listos, 8 bloqueados; "Crear" generó el proyecto con 5 tareas y se restauró la lista sin alterarla.

---

## 2026-06-22 · 4 funciones de empleabilidad (Canadá, entrevistas, ahorro, retos)
1. **Calculadora CRS + Checklist de migración** (`data/canada.ts` + Career): CRS Express Entry estimado (edad, educación, inglés CLB, experiencia, transferibilidad, PNP/oferta/etc.) con desglose y veredicto vs corte; checklist de 5 fases (prep→docs→Express Entry→PR→mudanza) persistente. Verificado: base 348 → con CLB9+PNP 1054.
2. **Simulador de entrevista** (`data/interview.ts` + `pages/Interview.tsx`, ruta `/interview` 🎤 en App+Layout): 20 preguntas en inglés (Behavioral/Backend/Frontend/DSA/System Design) con tip en español y respuesta modelo; filtro por categoría, pregunta aleatoria, contador de practicadas (namespace `interview`, alimenta racha). Verificado: revela respuesta y marca ✓ practicada.
3. **Meta de ahorro · Mudanza a Canadá** (Finance): objetivo + fecha persistente (`renacer_savegoal`), progreso desde movimientos de Ahorro, días restantes y "ahorra/mes" sugerido.
4. **Reto del día** (Dashboard, `dailyChallenge`) — ejercicio desbloqueado y pendiente, estable por fecha; **Plan semanal** (Cursos, `weeklyPlan`) — hasta 7 próximos niveles de la ruta, uno por día, clicable.

Nav crece a 16 módulos (nuevo 🎤 Entrevista). Build EXIT 0 (1227 módulos). Todo verificado en preview.

---

## 2026-06-22 · Editor ejecutable, despliegue y repaso (4 mejoras)
1. **Backup**: ya estaba implementado y conectado en Ajustes (exportar/importar JSON). Verificado, sin cambios.
2. **Editor de código en los ejercicios de cursos**: `Learning.tsx` ExerciseItem ahora tiene "✏️ Resolver aquí" que abre `CodeRunner`. Cursos JS-family (javascript/typescript/react/angular) ejecutan en vivo; el resto permite escribir y comparar. Verificado: `console.log(2+3+"!")` → `5!`.
3. **Preparación de despliegue**: `apps/web/vercel.json` (rewrite SPA), `public/_redirects` (Netlify), `public/sw.js` v2 (precache + fallback de navegación offline + limpieza de cachés viejos), y `DEPLOY.md` con pasos para Vercel/Netlify/GitHub Pages + PWA. Build de prod OK.
4. **Flashcards tech con repaso espaciado** (`data/flashcards.ts` 28 términos + `components/Flashcards.tsx`, sistema Leitner 1-5, en módulo Inglés) y **Rutinas de Fitness guiadas por objetivo** (perder grasa/músculo/fuerza/salud, con frecuencia, entrenamiento y nutrición; selección persistente).

Build EXIT 0 (1229 módulos). Todo verificado en preview.

---

## 2026-06-22 · Exámenes (inglés + final de curso) y deletreo
1. **Exámenes de inglés por nivel** (`ENGLISH_EXAMS` en `data/english.ts`, A1-C1, corte 80%, preguntas más difíciles): componente `EnglishExam` en `pages/English.tsx`, al final de cada nivel; aprobado se guarda como `exam:<nivel>` y suma al total. No bloquea el avance (evita re-lock del progreso ya ganado).
2. **Deletreo / Spelling** (`SPELLING_WORDS` 20 palabras tramposas + componente `Spelling`): escucha la palabra con `speechSynthesis` (en-US) y la escribes; pista en español, marcador de aciertos. Verificado: feedback correcto/incorrecto.
3. **Examen final difícil de cursos** (`finalExam`/`finalExamPassed` en `lib/learning.ts`): combina TODAS las preguntas de examen de los niveles del curso, corte **85%**. `FinalExamBlock` aparece en el banner de curso completado; al superarlo se marca `finalexam:<curso>` y el **certificado muestra "🏅 con distinción"**. Verificado end-to-end con Git (9 preguntas → distinción en el certificado).

Build EXIT 0 (1229 módulos). Todo verificado en preview; datos de prueba restaurados sin alterar el progreso real.

---

## 2026-06-22 · Buscador global / Command Palette (Ctrl+K)
- Nuevo `components/CommandPalette.tsx`: overlay con búsqueda difusa sobre los 16 módulos (NAV exportado desde Layout) + los 23 cursos. Atajo global Ctrl/⌘+K, navegación con ↑↓, Enter para abrir, Esc para cerrar; también se abre con un evento `palette-open`.
- Botón 🔎 en la barra móvil y un botón "Buscar… [Ctrl K]" en el sidebar de escritorio.
- Al elegir un curso, guarda `renacer_open_course` y navega a Cursos; `Learning.tsx` lee ese id al montar para abrir el curso directamente.
- Verificado en preview: Ctrl+K abre; "rust" → abre el curso Rust en /learning; "entrev" → /interview; Esc cierra.

Build EXIT 0 (1230 módulos).

---

## 2026-06-22 · Pulido: toasts, transiciones y aviso de logros
- **Sistema de toasts** (`lib/toast.ts` bus por evento + `components/Toasts.tsx` con framer-motion, auto-cierre ~3.4s, tonos success/info/achievement, clic para descartar). Montado global en Layout.
- **Toasts cableados**: ejercicio completado (solo al marcar), examen de nivel aprobado, examen final con distinción, examen de inglés aprobado, proyecto creado desde idea.
- **Aviso de logros nuevos** (`lib/achievementsWatch.ts`): compara desbloqueados vs vistos (`renacer_seen_achievements`) al cambiar de ruta; la primera vez registra en silencio para no spamear; luego notifica cada logro nuevo con toast.
- **Transiciones de página**: `<Outlet>` envuelto en `AnimatePresence`/`motion.div` con fade+slide por `location.pathname`.

Build EXIT 0 (1233 módulos). Verificado en preview: toasts aparecen y se cierran solos; toast solo al completar (no al desmarcar); navegación animada OK.

---

## 2026-06-22 · Dashboard vivo + acciones en el buscador
- **Saludo por hora** en Dashboard (Buenos días/tardes/noches) y **subtítulo dinámico**: avisa si la racha está en riesgo (racha activa pero sin actividad hoy, en ámbar), o invita al reto del día. Usa `getActiveDays()` para saber si hubo actividad hoy.
- **Acciones rápidas en el Command Palette (Ctrl+K)**: 🌓 Cambiar tema (vía evento `toggle-theme` que escucha Layout), 🎯 Reto del día (abre el curso del reto), 💾 Copia de seguridad (→ Ajustes). Aparecen arriba de módulos y cursos.

Build EXIT 0 (1233 módulos). Verificado en preview: saludo "Buenas noches"; 3 acciones visibles; toggle de tema cambia el modo; acción "Reto del día" navega a Cursos.

---

## 2026-06-23 · Mini-resumen, "esta semana" y confetti 🎉
- **Mini-resumen del día** (Dashboard): tira de 4 chips — 🔥 Racha, 🎯 Reto de hoy, 📚 Próximo nivel (de `weeklyPlan`), 🗣 % Inglés. Justo bajo el saludo por hora.
- **"Esta semana"** (Reportes): rejilla de 7 días (✓/·) desde `getActiveDays()`, contador X/7 días activos y mensaje motivador según el ritmo.
- **Confetti** (`lib/confetti.ts`, Web Animations API, sin dependencias): se dispara al **completar un curso al 100%** (detección de transición con `useRef` en Learning, evita falsos positivos al montar) y al **lograr la distinción** del examen final. Acompañado de su toast.

Build EXIT 0 (1234 módulos). Verificado en preview: 4 chips del resumen; "Esta semana" con X/7; confetti genera 30 partículas a demanda; saludo "Buenos días".

---

## 2026-06-23 · Refinamiento del sistema de diseño (skill frontend-design)
Dirección: *dashboard cálido-oscuro premium, con profundidad atmosférica, vidrio y grano*. Cambios a nivel sistema que se propagan a las 16 páginas:
- **`index.css`**: atmósfera "amanecer" enriquecida (3 glows), **grano/film sutil** (SVG fractalNoise vía `::after`, con `isolation:isolate` para no romper overlays), foco accesible global (anillo ámbar), transiciones suaves por defecto, `::selection` ámbar, scroll suave, **shimmer de skeleton** y utilidades `.glass-card`/`.rise`.
- **`components/ui.tsx`**: `Card` ahora es de vidrio (realce superior interno + sombra + transición); `PageHeader` con **icono en mosaico** (tile ámbar con ring); `Progress` con degradado+glow; `Badge` con ring-inset; `Stat` refinado; nuevo `Skeleton`.
- **`App.tsx`**: loader de **skeletons** (header + grid + cards) en vez del "Cargando…" plano.
- **`Layout.tsx`**: estado activo del nav con **degradado ámbar + barra de acento** (inset shadow) y micro-desplazamiento al hover.
- **`Onboarding.tsx`**: primera impresión elevada — blobs atmosféricos, vidrio, **revelado escalonado** (framer stagger), misión "De cero a Vancouver 🍁" y nota de privacidad.

Build EXIT 0 (1234 módulos). Verificado en preview (capturas): Dashboard y Cursos se ven cohesivos y premium; el buscador (Ctrl+K) queda correctamente por encima del contenido tras el cambio de apilamiento.

---

## 2026-06-23 · Pulido final: tarjetas de curso, fix de degradados y modo claro
- **Tarjetas de curso rediseñadas** (selector en Cursos): icono con anillo del color del curso, % en el color del curso, **barra de progreso integrada** con el color del curso, candado + requisito si está bloqueado, y **lift al hover** (`.glass-card.lift`).
- **Bug corregido**: `.glass-card` definía un `background-image` que **pisaba los degradados de Tailwind** (hero "Nivel 12", tarjeta Reto del día) — se veían lavados, sobre todo en modo claro. Ahora el realce de vidrio va solo en `box-shadow` (inset), respetando cualquier degradado encima.
- **Modo claro verificado** (capturas): hero naranja vibrante, tarjetas blancas legibles, contraste correcto.

Build EXIT 0 (1234 módulos). Estado: la app está en un punto sólido y "terminado" de diseño + funcionalidad; el siguiente paso natural es el **deploy** (ver DEPLOY.md).

---

## 2026-06-23 · Caza de bugs y pulido fino
Auditoría de toda la app (16 rutas) en preview:
- **Consola limpia**: 0 errores en todas las páginas. Solo warnings de dev de React Router (futuras flags v7) → **silenciados** con `future={{ v7_startTransition: true }}` en `RouterProvider` y `{ future: { v7_relativeSplatPath: true } }` en `createBrowserRouter` (verificado en el bundle servido; son dev-only, no salen en producción).
- **Responsividad móvil**: 0 overflow horizontal en las 16 rutas a 375px (incluidas las densas: Canadá/CRS, Finanzas, Reportes, Inglés, Entrevista).
- **Accesibilidad**: soporte de `prefers-reduced-motion` (desactiva animaciones/confetti/shimmer para quien lo prefiera) y `aria-label` en el botón de menú móvil.

No se encontraron bugs funcionales. Build de producción EXIT 0 (1234 módulos).

---

## 2026-06-23 · Multiplataforma + instalable como app (PWA)
**Responsive verificado** en las 16 rutas: desktop (1280), **tablet (768)** y **móvil (375)** sin overflow horizontal; sidebar en ≥md, barra+menú hamburguesa en móvil.
**Instalable como app** (ya era PWA; ahora con UX de instalación):
- `components/InstallPrompt.tsx`: banner abajo-izquierda que captura `beforeinstallprompt`, botón **📲 Instalar** (dispara el diálogo nativo), descarte recordado (`renacer_install_dismissed`) y **fallback iOS** con instrucciones (Compartir → Agregar a inicio). Verificado: banner aparece y el botón llama a `prompt()`.
- `index.html`: `viewport-fit=cover`, `<meta description>`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style=black-translucent`, título con tagline.
- **Safe-areas**: clases `.safe-top`/`.safe-bottom` (env(safe-area-inset-*)) en la barra superior móvil, toasts e install prompt → no quedan bajo el notch ni la barra inferior.
- Confirmado: service worker **registrado y activo**, manifest válido (standalone), 0 errores de consola.

Build EXIT 0 (1235 módulos).

---

## 2026-06-23 · App Android nativa (APK) con Capacitor
- Integrado **Capacitor 8.4.1** en `apps/web` (`@capacitor/core|cli|android`) + `capacitor.config.ts` (appId `com.renacer.app`, appName RENACER, webDir `dist`, bg #0c0a09).
- `npx cap add android` → proyecto nativo en `apps/web/android`. `local.properties` apunta al SDK (`AppData/Local/Android/Sdk`). Capacitor 8 ya usa compileSdk/target **36** (instalado); minSdk 24.
- **APK de debug compilado** con el Gradle wrapper (BUILD SUCCESSFUL, 2m20s) y copiado a **`renacer/RENACER.apk`** (4.4 MB). Firmado con la debug keystore (verificado con `apksigner`: CN=Android Debug). Empaqueta la app web → funciona **100% offline**.
- Scripts en package.json: `cap:sync`, `apk` (build+sync+assembleDebug), `apk:open`. Guía en **`APK.md`** (instalar, regenerar, AAB de release para Play Store).
- Pendiente opcional: ícono de marca (el SVG usa `<text>`, no convertible a vector Android; se haría con `@capacitor/assets` desde un PNG 1024²) y splash screen.

Requisitos confirmados en la máquina: JDK 21, Android SDK (platforms 36/36.1, build-tools 34-37, platform-tools).

---

## 2026-06-23 · Web + App conviviendo (un código, dos productos)
- Confirmado: la app React **no importa Capacitor** → el bundle de la **web** es independiente del APK (sin peso extra). Web build EXIT 0.
- Añadidos `apps/web/.vercelignore` (excluye `android/`, `ios/`, `*.apk/aab/keystore` del deploy web) y `apps/web/.gitignore` (ignora `node_modules`, `dist`, artefactos de Android, `local.properties` y secretos/keystores; conserva el proyecto `android/` para rebuild).
- Flujo: editas la web → `npm run build` sirve para **ambos**. Para la web haces deploy (Vercel); para la app `npm run apk` regenera el APK. Mismo `dist/`.

---

## 2026-06-24 · Empleo multi-destino: Vancouver 🇨🇦 + Durango 🇲🇽 + Tokyo 🇯🇵
- Nuevo `data/destinations.ts`: tipo `Destination` (city, country, flag, color, tagline, visa, jobLinks, jobs, checklist, checklistKey, pointsSystem). Tres destinos con **bolsas de trabajo reales** y **empresas** por ciudad:
  - **Vancouver**: bolsas CA + Express Entry (CRS).
  - **Durango**: OCC/Computrabajo/Indeed MX + remoto-México (Kueski, Clip, Konfío, Bitso); sin visa; checklist local.
  - **Tokyo**: Japan Dev/TokyoDev/Daijob + empresas English-OK (Mercari, Rakuten, PayPay, LINE Yahoo, Woven by Toyota); visa de trabajo (CoE); checklist de reubicación.
- `pages/Career.tsx` refactorizado a **multi-destino**: selector con bandera/color (persistido en `renacer_destination`), hero y nota de visa dinámicos, Job Matcher y enlaces por destino, checklist por destino (con `key` para remount), CRS **solo** para Canadá. Renombrado el módulo a "Empleo & Reubicación"; nav "Canadá 🍁" → "Empleo 🌍". Interview Trainer ahora enlaza al simulador `/interview`.
- `components/ui.tsx`: `Card` acepta `style` (para los acentos de color por destino).
- **APK regenerado** con la función (`RENACER.apk`, 4.6 MB).

Build EXIT 0 (1236 módulos). Verificado en preview: los 3 destinos cambian empresas, enlaces, checklist y nota de visa; CRS solo en Vancouver.

---

## 2026-06-24 · Personalización de color + logros + diario + lectura + empleo auto
1. **🎨 Color de acento personalizable**: `brand` ahora usa variables CSS (`tailwind.config` + `:root`); `lib/theme.ts` con 8 presets (Ámbar, Esmeralda, Océano, Violeta, Rosa, Cian, Carmesí, Lima); `initTheme()` en main.tsx; selector en Ajustes. Modo claro/oscuro se mantiene aparte. Glow, selección y atmósfera siguen el color. (Requiere reinicio del dev server para que Tailwind regenere; verificado: cambia toda la UI en vivo y persiste.)
2. **🏆 Logros: 41 → 107**, con 5 fases (bronce, plata, **oro, platino, diamante**). Nuevos hitos difíciles: 1000 ejercicios, 23 cursos al 100%, C2 inglés (118), 5/30 exámenes aprobados, 10 finales con distinción, 10 proyectos completos, racha x100, nivel 75, etc. Nuevos stats en `stats.ts`: englishExamsPassed, courseExamsPassed, finalExamsPassed, projectsCompleted.
3. **📔 Diario emocional**: +4 campos (💛 gratitud, ❤️ relaciones/amor, 💰 finanzas-emocional, 😟 preocupaciones) además de ánimo/feeling/hice/aprendí/mejorar.
4. **📚 Lectura por gusto**: `data/books.ts` con 8 géneros × 3 libros recomendados; selector en Lectura + botón "+ Añadir" que los manda a la biblioteca con sus páginas.
5. **⚙️ Ajustes**: peso y altura ahora **bloqueados** (se fijan al crear la cuenta) + selector de color. Export/import intactos.
6. **💼 Empleo automático**: los indicadores Portafolio/CV/Entrevistas ya **no son manuales** — se derivan de proyectos completados y práctica de entrevista. Adiós sliders.

Build EXIT 0 (1238 módulos). Verificado en preview. (Web primero; el APK se regenera después.)

### Cola para la próxima (del feedback de voz)
- Exámenes más difíciles (inglés + cursos) · CV/documento que se arma solo y descargable · habilidades con nivel (HTML básico/medio/avanzado) auto desde cursos · notificación "entrevista disponible" al completar curso/nivel/examen · más recomendaciones/pasos en Proyectos · (opcional) más cursos/dificultad.

---

## 2026-06-24 · Habilidades automáticas en el CV
- Nuevo `lib/skills.ts`: `autoSkills()` deriva habilidades de TODOS los cursos con progreso (nivel Básico→Experto por %) + Inglés en escala CEFR (A1–C2). Ordenadas por dominio.
- `pages/CV.tsx`: reemplazadas las 6 skills fijas por `autoSkills()`; nueva tarjeta "Tus habilidades (se forman solas)" con chips del color de cada curso + nivel. Entran solas en el CV imprimible, el texto copiable y el README de GitHub.

Build EXIT 0 (1239 módulos). Verificado: Git·Experto, JavaScript·Intermedio, Inglés·A2.

---

## 2026-06-24 · Estilos de aprendizaje + entrevista disponible + inglés más duro + C#
- **🔊 Modo escuchar (auditivo)**: `components/ListenButton.tsx` (SpeechSynthesis). Botón "Escuchar teoría" en la teoría de cursos (es-MX) y en la teoría de Inglés. Etiqueta "📖 Lee · 🔊 Escucha · ✏️ Hazlo" para cubrir a quien aprende leyendo, oyendo o haciendo (la práctica/code-runner ya existía).
- **🎤 Entrevista disponible**: toast al completar un curso (en el efecto de finalización de Learning) y al aprobar un examen de nivel de inglés → invita a practicar en el simulador.
- **🧠 Exámenes de inglés más difíciles**: +2/3 preguntas más retadoras por nivel (reported speech, condicionales 2°/3°, pasiva, inversión, phrasal verbs). A1=7, A2/B1/B2/C1=8 preguntas; corte 80%.
- **➕ Curso C#** (🟦, .NET): 3 niveles (Fundamentos, POO, Colecciones/LINQ/async) + exámenes + proyecto API ASP.NET. Total **24 cursos**. Añadido a la ruta (Fase 5) y al logro "completar todos" (24).

Build EXIT 0 (1240 módulos). Verificado en preview: 24 cursos, C# presente, exámenes inglés más largos, botón escuchar + etiqueta de modos, TTS soportado.

### Cola
- Más cursos/empleos/entrevistas según se pidan · CV descargable mejorado · más pasos/recomendaciones en Proyectos · (idea) ejemplos guiados paso a paso por tema.

---

## 2026-06-24 · Frases motivacionales al fallar / estresarse 🥊
- `data/quotes.ts`: 24 frases cortas y potentes (Rocky, Jordan, Edison, Churchill, Ali, Yoda, proverbios + propias de RENACER).
- `lib/motivate.ts`: `motivate()` elige una frase (sin repetir la anterior) y dispara evento `motivate`.
- `components/Motivation.tsx`: banner breve centrado-arriba con framer-motion (auto-cierre ~5s, sigue el color de acento, clic para descartar). Montado en Layout.
- Se dispara al **fallar**: examen de nivel de curso, examen final, examen de inglés; y al guardar una entrada de diario con **ánimo bajo** (≤ "Bajo"). No bloquea la interacción.

Build EXIT 0 (1243 módulos). Verificado en preview: el banner aparece con la frase + fuente.

---

## 2026-06-24 · Fitness automático por IMC + escritura en inglés con feedback
- **🏋️ Fitness automatizado (lo grande)**: `data/fitnessPlan.ts` con 4 fases según IMC que **evolucionan al bajar de peso**:
  - Fase 1 Arranque seguro (Obesidad II, IMC≥35): bajo impacto, articulaciones, hábito.
  - Fase 2 Construyendo base (Obesidad I, 30-35): full-body + cardio ligero.
  - Fase 3 Quema y fuerza (Sobrepeso, 25-30): fuerza + HIIT.
  - Fase 4 Definición (Normal, <25): fuerza por grupos + definición.
  - `phaseForBMI(imc)` elige la fase; `Fitness.tsx` muestra tarjeta "🤖 Tu rutina automática" con IMC/categoría/fase/tips y renderiza la rutina de esa fase. Conforme registras menos peso → cambia de fase con ejercicios distintos (no te estancas). Stat de progreso por fase.
- **✍️ Escribir en inglés con revisión automática**: `data/writing.ts` (4 consignas: rutina/Present Simple, dream job, pasado, intro de entrevista) + componente `WritingPractice` en English. Revisión heurística (longitud, mayúscula/puntuación, estructura objetivo, que esté en inglés) con feedback ✓/✗ por criterio; al fallar lanza frase motivacional, al cumplir todo felicita. Botón para oír la consigna (en-US).

Build EXIT 0 (1244 módulos). Verificado: fases por IMC (38→F1, 32→F2, 27→F3, 22→F4); escritura marca bien/mal con su retroalimentación.

### Cola
- Inglés: más ejercicios de pronunciación/listening (audios "describe el párrafo") · avance por examen ≥80-90% · Finanzas/Ajustes: manita de gato.

---

## 2026-06-24 · Inglés: listening + avance por examen + más pronunciación; Finanzas
- **🎧 Listening**: `LISTENING` (8 audios A2-B2) en `data/english.ts` + componente `Listening` en English: reproduce el texto en inglés (TTS en-US, las veces que quieras) y respondes una pregunta de comprensión; acierto→toast, fallo→frase motivacional; revela el texto al responder.
- **🗣 Más pronunciación**: +4 frases de Speaking (perfil/entrevista). Total 14.
- **📈 Avance por examen**: subir de nivel en inglés ahora exige **aprobar el examen del nivel (≥80%)** (antes era 90% de ejercicios). Si el nivel no tiene examen (C2), cae al % de ejercicios. Badge actualizado.
- **✍️ Escritura** (de la tanda anterior) ya integrada con listening.
- **💵 Finanzas (manita de gato)**: stat "Tasa de ahorro" (ahorro/ingresos) + tarjeta "Salud financiera" con consejo según tu tasa (gastas de más / 10% / 20%+ → directo a la mudanza).

Build EXIT 0 (1244 módulos). Verificado: 8 listenings, speaking 14, avance por examen, tasa de ahorro.

### Cola
- Listening/escritura ligados al nivel (que cuenten) si se quiere · más audios · Ajustes/Reportes manita de gato · regenerar APK con todo.

---

## 2026-06-24 · Personajes mentores + asistente de proyectos
- **🎭 +3 personajes** (en `data/characters.ts`, total 10): **Yuki 🗼** (guía para trabajar en Tokyo: empleos English-OK, visa, japonés básico), **Don Dinero 💰** (coach de finanzas/ahorro 50-30-20 para la mudanza), **El Campeón 🥊** (motivación tipo Rocky cuando estás abajo). Se suman a Mentor, Ms. Taylor (inglés), Mr. Reyes (reclutador Vancouver), Coach Rex (fitness), Marco (estoico), Bit (dev), Luna (creativa). Chatean con IA real (API key) o modo demo.
- **🧭 Asistente de proyectos** (Projects): describes en una frase qué quieres construir → detecta el tipo (Web/API/Móvil/Videojuego), genera **pasos recomendados** (con extras por keywords: login→auth, datos→BD, pagos→pasarela, chat→tiempo real, clima→API externa) y muestra **proyectos parecidos** del catálogo. Botón para crear el proyecto con todos sus pasos como tareas.

Build EXIT 0 (1244 módulos). Verificado: 10 personajes; asistente detecta login y pagos y arma los pasos.

---

## 2026-06-24 · Misiones semanales (RPG) + examen inglés extenso + consejos
- **🗡️ Misiones de la semana** (`lib/quests.ts` + `components/WeeklyQuests.tsx`, en Dashboard): 5 retos semanales que avanzan con tu actividad real (8 ejercicios, 8 de inglés, 5 días activos, 2 de diario, 1 examen). Usa baseline por semana ISO (delta desde el lunes) y días activos reales. Al completar las 5 → "Reclamar recompensa" con confetti + contador de "semanas completas". Se reinician cada semana.
- **🧠 Examen de inglés más extenso**: cada nivel pasó a **12 preguntas** (A1-C1), con más gramática (zero/mixed conditional, causative, reported, cleft, subjunctive, phrasal verbs…). Corte 80%.
- **💡 Consejos de estudio** (`data/tips.ts` + `components/ConsejoCard.tsx`): tarjeta rotativa con consejos para **aprender a programar** (en Cursos, 14 tips) y para **aprender inglés** (en Inglés, 13 tips). Botón "Otro" para cambiarlo.

Build EXIT 0 (1248 módulos). Verificado: misiones con progreso real (activo 3/5), exámenes 12 preguntas, consejos en ambos módulos.

---

## 2026-06-24 · Curso de Lua + constructor de juego de Roblox 🎮
- **🌙 Curso de Lua** (25 cursos): 3 niveles (Fundamentos · Tablas y Funciones · **Lua en Roblox** con Instance, eventos .Touched, Players) + exámenes + proyecto "tu primer obby". En ruta (Fase 5) y logro "completar todos" = 25.
- **🎮 Módulo Roblox** (nueva ruta `/roblox` + nav): subes la **historia de tu juego** (`.pdf` con pdfjs-dist, `.docx` con mammoth, `.txt`/`.md`) o la pegas → `lib/docParser.ts` extrae el texto → `lib/robloxPlan.ts` (heurístico, sin IA) detecta elementos (enemigos, niveles, objetos, puntos/vida, GUI, guardado, multijugador) y genera un **paso a paso con comandos Lua** (PlayerAdded, leaderstats, Touched, DataStore, Teams, GUI…) + **recomendaciones para mejorarlo/animarte**. Siempre muestra setup y publicación aunque no subas nada.

Build EXIT 0 (1680 módulos; pdf.js incluido). Verificado: Lua presente (25 cursos), página Roblox carga, detecta 6 elementos de una historia y arma 9 secciones + 7 recomendaciones; lector .txt OK.

---

## 2026-06-24 · De lleno: Roblox + Inglés + Cursos + optimización
- **🎮 Roblox de lleno**: el generador (`lib/robloxPlan.ts`) ahora detecta **tipo de juego** (obby/simulator/tycoon/combate/carreras) y muchos más elementos: Jefe/Boss, Tienda, Checkpoints, Timer, Teletransporte/Portales, Puertas y llaves, Vehículos, Mascotas (+ los previos). Verificado: una historia rica detecta **13 elementos → 17 secciones** con comandos Lua.
- **🗣 Inglés de lleno**: Listening 8→**12** audios; escritura 4→**6** consignas (planes de fin de semana con "going to/will", opinión con "I think/because").
- **📚 Cursos de lleno**: más ejercicios en los más delgados — Lua [3,3,2], Docker [2,2], Git [2,2,2].
- **⚡ Optimización**: `lib/docParser.ts` ahora hace **dynamic import** de mammoth (.docx) y pdf.js (.pdf) solo cuando subes ese tipo de archivo. Resultado: la página **Roblox carga en 14 kB** (antes arrastraba pdf.js de ~472 kB); pdf.js queda en su propio chunk, cargado bajo demanda.

Build EXIT 0 (1680 módulos; pdf.js code-split aparte). Verificado en preview.

---

## 2026-06-24 · Sistema de XP/niveles + optimización + Roblox para juegos extensos
- **🎮 XP y niveles (rehecho)** (`lib/xp.ts`): el nivel ya no es lineal. Curva **triangular creciente** (cada nivel cuesta más: L5=100, L10=450, L20=1900, L30=4350 XP) → subir es más difícil y lento. **Tope de 100 XP por día** (ledger que reconcilia el "XP bruto" de tu actividad), así no sirve grindear lo mismo todo el día. El progreso pasado se respeta al iniciar (el usuario quedó Nivel 11, casi sin cambio). `stats.ts` deriva nivel/XP de aquí; Dashboard/Logros/Reportes muestran "XP total", "hoy x/100" y "máx 100 XP al día".
- **⚡ Optimización**: `computeStats()` ahora cachea su resultado por microtarea (varias llamadas en un render comparten cómputo, se limpia entre renders → sin staleness). Sumado al dynamic-import de pdf.js/mammoth de antes.
- **🎮 Roblox con sazón (juegos extensos)**: `robloxPlan.ts` ahora detecta **tipo de juego** + 16 elementos: Mercaderes/NPCs (ProximityPrompt), Inventario, Misiones/Quests, Diálogos, Gráficos (Lighting/Skybox/Materials/PostProcessing), Boss, Tienda, Vehículos, Mascotas, Portales, Puertas, Checkpoints, Timer… y para historias largas o con ≥6 elementos añade una sección **"Organiza un proyecto grande"** (ModuleScripts, RemoteEvents cliente/servidor, estructura, performance). Verificado: RPG extenso → 21 secciones con comandos Lua.

Build EXIT 0 (1681 módulos). Verificado en preview.

---

## 2026-06-28 · Roblox SUPER completo (estudio de juegos)
`pages/Roblox.tsx` rehecho con 4 pestañas + `data/roblox.ts`:
- **🧠 Generador**: historia (pdf/docx/txt o pegada) → plan detallado; ahora cada paso es un **checklist marcable** (persistente) y se puede **descargar el plan en .md** (con checkboxes y bloques de código).
- **🎲 Plantillas**: 6 tipos de juego (Obby, Simulator, Tycoon, Combate, RPG, Tower Defense) con dificultad, **roadmap por fases** e **ideas de monetización** (Game Pass / Dev Products).
- **📜 Recetario Lua**: 25 snippets copiables en 9 categorías (Básico, Jugador, Partes/eventos, Economía/leaderstats, GUI, NPC/tienda, DataStore, Efectos/Tween, Avanzado/RemoteEvents/ModuleScripts) — cada uno con botón "Copiar".
- **📘 Guía**: Studio en 1 minuto, errores comunes y cómo arreglarlos, cómo se ve pro (iluminación/skybox/efectos), **monetización** (Robux) y **publicar/conseguir jugadores**.

Build EXIT 0 (1682 módulos; Roblox 35 kB, pdf.js sigue en chunk aparte/bajo demanda). Verificado en preview: 6 plantillas, 25 snippets, 5 secciones de guía, plan con checklist + descarga.

---

## 2026-06-28 · Roblox: editor de Lua real + más producción
- **💻 Editor de Lua** (nueva pestaña): ejecuta **Lua 5.4 de verdad** en el navegador vía **wasmoon** (WASM cargado bajo demanda, 271 kB en chunk aparte). `lib/luaRunner.ts` captura print/warn y errores de sintaxis. Botones de ejemplo (Hola, Bucle, Tabla, Función, Condicional), Ejecutar/Limpiar y panel de salida. Verificado: corre bucles, tablas y reporta errores ("línea 1: unexpected symbol"). Nota clara de que las APIs de Roblox solo corren en Studio.
- **▶ Probar**: cada bloque de código del Generador y del Recetario tiene botón "Probar" que lo carga en el editor (integración entre pestañas).
- **Más producción**: +2 plantillas (👻 Horror/Survival, 🏎️ Carreras) → 8 tipos de juego; +7 snippets (teleport, dar Tool, recompensa diaria, color/material, partículas, repetir con task.wait…).

Build EXIT 0 (1687 módulos; Roblox 42 kB, glue.wasm 271 kB y pdf.js en chunks aparte/bajo demanda). Verificado en preview: el editor ejecuta Lua y muestra la salida.

---

## 2026-06-28 · Optimización para proyectos extensos de Roblox
- **⚡ Motor de Lua cacheado** (`lib/luaRunner.ts`): la LuaFactory (carga del WASM) se crea UNA vez y se reutiliza. Medido: 1ª ejecución ~80ms, siguientes **~1ms**. Clave si corres código muchas veces en un proyecto grande.
- **⚡ Análisis de la historia con debounce** (Roblox Generador): `analyzeStory` corre 400ms DESPUÉS de dejar de escribir, no en cada tecla → no se traba al pegar un documento grande.
- **🧭 Plan por hitos** (`robloxPlan.ts` → `scope`): detecta el tamaño del proyecto (pequeño/mediano/**extenso**) por nº de elementos y longitud, y genera un **roadmap por hitos** (MVP → economía → conflicto → mundo/progresión → persistencia/UI → pulido → lanzar) con consejo para no abrumarte. Se muestra en el Generador y va incluido en el plan descargable (.md). Verificado: RPG enorme → "extenso" con 7 hitos.

Build EXIT 0 (1687 módulos).

---

## 2026-06-28 · Meta diaria estilo Duolingo + optimización para aprender mucho
- **🎯 Meta diaria de XP** (`lib/xp.ts` + `components/DailyGoal.tsx`, en Dashboard arriba de todo): anillo de progreso (SVG) de la XP de hoy hacia tu meta, con selector Relajado(20)/Normal(40)/Serio(60)/Intenso(100), persistido. Cierra el "loop diario" tipo Duolingo: meta diaria + racha + misiones semanales + nivel/XP con tope.
- **⚡ Optimización de la página de Cursos**: `learningNotes`, `reviewDue`, `completedCourses`, `weeklyPlan` y el cálculo de los 25 cursos (progreso/desbloqueo/completado) ahora van en `useMemo([done])` → no se recalculan al cambiar de pestaña/nivel/curso, solo cuando cambia tu progreso. Clave para sesiones largas de estudio.
- (Acumulado) `computeStats` cacheado por microtarea, motor de Lua reutilizado, análisis de Roblox con debounce, y pdf.js/wasm bajo demanda.

Build EXIT 0 (1688 módulos). Verificado: meta diaria con anillo y selector persistente; Cursos sigue OK tras la memoización.

---

## 2026-06-28 · Optimización de bundle (vendor chunking)
- `vite.config.ts`: `manualChunks` separa las librerías grandes en chunks propios — **react-vendor** (~207 kB), **motion** (framer, ~115 kB) y **charts** (recharts, ~422 kB). Beneficio: cachean por separado (rara vez cambian) y se descargan en paralelo, así la app abre más rápido y, al actualizar el código de la app, solo cambia el chunk pequeño del entry (mejor caché para usuarios que vuelven).
- Confirmado que mammoth (.docx, ~495 kB), pdf.js y wasmoon siguen como chunks **lazy** (solo cargan al usar esa función), no en el entry.
- Verificado el build de producción con `vite preview`: el HTML carga el entry y los chunks responden 200.

Build EXIT 0 (1688 módulos). Acumulado de optimizaciones: computeStats cacheado, motor de Lua reutilizado, análisis de Roblox con debounce, página de Cursos memoizada, y vendors en chunks aparte.
