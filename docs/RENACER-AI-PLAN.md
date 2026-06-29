# RENACER AI — Plan de Migración y Arquitectura del Ecosistema

> Evolución de **Proyecto Renacer** (app de transformación personal) a **RENACER AI**:
> un ecosistema donde una **Core IA** es el sistema nervioso central y la app actual
> se convierte en un conjunto de módulos internos.
>
> **Regla de oro de este plan:** *Additive-only*. No se elimina, reemplaza ni modifica
> ninguna funcionalidad existente. Todo lo nuevo se **suma** mediante capas y adaptadores.
> Patrón aplicado: **Strangler Fig** (envolver, no reescribir).

---

## 1. Análisis del proyecto actual

### 1.1 Módulos existentes (detectados en código)

| Capa | Artefacto real | Estado |
|---|---|---|
| **Backend** | `apps/api/src/index.ts` | Express + router `/api/v1`, monta auth y `/rpg/stats` |
| | `apps/api/src/lib/prisma.ts` | Cliente Prisma (singleton) |
| | `apps/api/src/lib/jwt.ts` | Access/refresh JWT |
| | `apps/api/src/lib/ai.ts` | **`AIProvider` (interfaz intercambiable)** + `PROMPTS` — ya es la semilla de Core IA |
| | `apps/api/src/middleware/auth.ts` | `requireAuth` |
| | `apps/api/src/modules/auth/` | register/login/refresh (argon2 + Zod) |
| | `apps/api/src/modules/rpg/rpg.service.ts` | **Motor RPG**: `awardXp`, `levelFromXp`, `getStats` (event sourcing) |
| | `apps/api/prisma/schema.prisma` | 35+ tablas, 11 dominios |
| **Frontend** | `apps/web/src/App.tsx` | `createBrowserRouter` con 10 rutas |
| | `apps/web/src/components/Layout.tsx` | Sidebar + tema dark/light |
| | `apps/web/src/components/ui.tsx` | Design system (Card, Stat, Progress, Badge) |
| | `apps/web/src/pages/*.tsx` | Dashboard, Fitness, English, Programming, Projects, Journal, Mentor, Reading, Finance, Reports |
| **Shared** | `packages/shared/src/constants/rpg.ts` | Tabla de niveles/XP/stats |

### 1.2 Dependencias internas (grafo actual)

```
web/App.tsx ──► pages/* ──► components/{ui,Layout}
                                  │
                                  ▼ (futuro: hoy usan datos mock)
api/index.ts ──► modules/auth ──► lib/{jwt,prisma}
            └──► modules/rpg  ──► lib/prisma ──► [Postgres]
            (lib/ai.ts existe, aún no cableado a rutas)
packages/shared/rpg.ts  ◄── (referenciado conceptualmente por web y api)
```

**Hallazgos clave:**
1. `lib/ai.ts` **ya define la abstracción de proveedor de IA y prompts** → es el cimiento natural de Core IA.
2. `rpg.service.ts` **ya es el "Motor RPG"** que pide la nueva arquitectura → se *eleva* a Core IA por re-exportación, sin moverlo destructivamente.
3. El "Análisis Emocional" ya está diseñado en `Journal` + `JournalAnalysis` (schema) → se promueve a servicio de Core IA.
4. Frontend y backend están **desacoplados por REST** → podemos insertar Core IA como capa intermedia sin romper contratos.
5. No hay capa de tiempo real (WebSocket) ni almacenamiento vectorial → son las dos brechas técnicas a cubrir.

### 1.3 Riesgo de ruptura por módulo (línea base)

| Módulo existente | ¿Lo toca la migración? | Estrategia |
|---|---|---|
| auth | No (se reutiliza) | Core IA consume `requireAuth` tal cual |
| rpg | No se modifica | Se *re-exporta* desde `core/` (wrapper) |
| Páginas web actuales | No se modifican | Se montan dentro del nuevo shell; siguen funcionando aisladas |
| schema.prisma | Solo se **añaden** modelos | Migraciones aditivas, sin alterar tablas existentes |

---

## 2. Arquitectura objetivo (RENACER AI)

### 2.1 Principio: Core IA como bus central

Todos los módulos hablan con **Core IA** a través de un **Orquestador** + un **Event Bus** interno.
Los módulos existentes siguen exponiendo sus REST endpoints; Core IA los invoca como
*capabilities* y reacciona a sus eventos. Nada se reescribe.

```
                          ┌──────────────────────────────────────────────┐
                          │                  CORE IA                      │
                          │  ┌──────────────┐  ┌────────────────────────┐ │
   Voz / Avatar / Chat ──►│  │ Orquestador  │◄─┤ Motor de Conversación  │ │
        (WebSocket)       │  └──────┬───────┘  └────────────────────────┘ │
                          │         │          ┌────────────────────────┐ │
                          │  ┌──────▼───────┐  │ Sistema de Decisiones  │ │
                          │  │  Event Bus   │◄─┤ Sistema Recomendaciones│ │
                          │  └──────┬───────┘  │ Análisis Emocional     │ │
                          │         │          │ Motor RPG (existente)  │ │
                          │         │          └────────────────────────┘ │
                          └─────────┼────────────────────────────────────┘
            ┌───────────────────────┼───────────────────────────────────┐
            ▼            ▼           ▼           ▼            ▼           ▼
       ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
       │Dashboard│ │ Fitness │ │ Inglés  │ │  ...    │ │ Memoria │ │Control  │
       │Fitness… │ │(actual) │ │(actual) │ │ módulos │ │ (vector)│ │  PC     │
       │(actuales)│ └─────────┘ └─────────┘ │actuales │ └─────────┘ └────┬────┘
       └─────────┘                          └─────────┘                  │
                                                                         ▼
                                                          ┌──────────────────────────┐
                                                          │  RENACER DESKTOP AGENT    │
                                                          │  (Electron/Tauri, local)  │
                                                          │  wake-word · TTS/STT · OS │
                                                          └──────────────────────────┘
```

### 2.2 Componentes de Core IA

| Componente | Responsabilidad | Origen |
|---|---|---|
| **Orquestador** | Punto de entrada único; recibe intención → decide qué módulos/servicios invocar y en qué orden; compone la respuesta. | NUEVO |
| **Motor de Conversación** | Gestiona el diálogo (turnos, contexto, streaming), usa `AIProvider`. | Evoluciona de `lib/ai.ts` |
| **Sistema de Decisiones** | Clasifica la intención del usuario (intent routing), aplica reglas/políticas, decide acciones (incl. Control de PC con confirmación). | NUEVO |
| **Sistema de Recomendaciones** | Genera consejos/misiones a partir de métricas multi-módulo (el "Mentor"). | Formaliza el Mentor actual |
| **Análisis Emocional** | Detecta emociones de texto/voz; alimenta Avatar y Memoria. | Promueve `JournalAnalysis` |
| **Motor RPG** | XP, niveles, stats, logros. | **Reutiliza `rpg.service.ts` sin cambios** |
| **Event Bus** | Pub/sub interno (BullMQ/Redis + EventEmitter) para que módulos emitan/escuchen eventos. | NUEVO |

### 2.3 Nuevas capacidades transversales (brechas técnicas a cubrir)

1. **Tiempo real:** WebSocket Gateway (Socket.IO) para chat en streaming, estado del Avatar y audio de Voz.
2. **Memoria semántica:** extensión **pgvector** en Postgres para embeddings (objetivos, hábitos, conversaciones, contexto).
3. **Agente de escritorio:** **Control de PC** y *wake word* no son posibles desde un navegador → se introduce un **Renacer Desktop Agent** (Electron o Tauri) que corre local con permisos del SO y se comunica con la API por un canal seguro autenticado.

---

## 3. Diseño de los nuevos módulos

### 3.1 MÓDULO AVATAR (frontend, bajo riesgo)
- **Tecnología:** Live2D Cubism SDK for Web + `pixi-live2d-display` (PIXI.js).
- **Funciones:** avatar anime 2D, expresiones faciales, movimiento de ojos (idle/seguimiento de cursor), movimiento de boca (**lip-sync por visemas** del TTS), estados emocionales.
- **Driver:** se suscribe por WebSocket a `avatar:state` (emoción + viseme stream) que emite Core IA (Análisis Emocional + Motor de Conversación).
- **Aislamiento:** componente React nuevo (`features/avatar/`); no toca páginas existentes. Si falla, el resto de la app sigue igual.
- **Licencia a verificar:** términos del Cubism SDK (gratuito bajo cierto umbral de ingresos).

### 3.2 MÓDULO VOZ (full-stack + desktop)
- **STT:** Web Speech API (navegador) y/o Whisper (server) para precisión.
- **TTS:** proveedor intercambiable (Web Speech / ElevenLabs / Azure) detrás de interfaz `TTSProvider` (espejo de `AIProvider`). Devuelve audio + timeline de visemas para el Avatar.
- **Activación por voz (wake word):** "Hola Renacer" — requiere escucha continua → vive en el **Desktop Agent** (Porcupine/openWakeWord). En navegador, fallback con botón push-to-talk.
- **Conversación natural:** STT → Core IA (Orquestador) → TTS, en streaming por WebSocket.

### 3.3 MÓDULO MEMORIA (backend, núcleo de Core IA)
- **Qué guarda:** objetivos, hábitos, conversaciones, historial, contexto personal.
- **Cómo:** memoria **estructurada** (tablas `Goal`, `Habit`, `HabitLog`) + memoria **semántica** (`Memory` con embeddings en pgvector).
- **Recuperación:** el Motor de Conversación hace *retrieval* (top-k por similitud + recencia + importancia) y lo inyecta como contexto → esto formaliza el "resumen rodante" del Mentor descrito en la arquitectura original.
- **Privacidad:** contenido sensible cifrado en reposo (reusa el patrón de cifrado del Diario).

### 3.4 MÓDULO CONTROL DE PC (alto riesgo — se diseña con máxima cautela)
- **Por qué necesita Desktop Agent:** un navegador no puede abrir programas ni ejecutar acciones del SO. Se introduce un proceso local (Electron/Tauri) que:
  - Se registra con un **token de dispositivo** firmado y vinculado al usuario.
  - Expone solo un **catálogo allowlist** de acciones (`PcAction`): abrir programa X, lanzar automatización Y, gestionar notificaciones.
  - **Requiere confirmación explícita** del usuario para acciones sensibles (principio: nunca ejecutar dinero/borrados/instalaciones sin confirmar).
  - Registra todo en `AutomationRun` (auditoría).
- **Comunicación:** la web/Core IA **no** ejecuta nada directo; envía una *intención de acción* → el Agent valida contra allowlist → confirma → ejecuta → reporta. Canal local autenticado (WebSocket localhost + token).

### 3.5 MÓDULO INTEGRACIONES
- Conectores externos (calendario, notificaciones, servicios). Tabla `Integration` con credenciales cifradas; eventos vía Event Bus.

---

## 4. Nueva estructura de carpetas (additive)

```
renacer/
├─ apps/
│  ├─ web/                         # EXISTE — se le añade el shell + nuevos features
│  │  └─ src/
│  │     ├─ pages/                 # (intactas)
│  │     ├─ components/            # (intactas)
│  │     └─ features/              # NUEVO
│  │        ├─ avatar/             # Live2D
│  │        ├─ voice/              # STT/TTS UI, push-to-talk
│  │        └─ assistant/          # ventana de chat con Core IA (streaming)
│  │
│  ├─ api/                         # EXISTE — se le añade core/ y módulos nuevos
│  │  └─ src/
│  │     ├─ modules/               # (auth, rpg intactos)
│  │     ├─ core/                  # NUEVO — Core IA
│  │     │  ├─ orchestrator/
│  │     │  ├─ conversation/       # evoluciona de lib/ai.ts (sin borrarlo)
│  │     │  ├─ decisions/
│  │     │  ├─ recommendations/
│  │     │  ├─ emotion/
│  │     │  ├─ rpg.ts              # RE-EXPORT de modules/rpg (wrapper, no copia)
│  │     │  └─ bus/                # Event Bus (Redis/BullMQ + EventEmitter)
│  │     ├─ realtime/              # NUEVO — WebSocket Gateway (Socket.IO)
│  │     ├─ modules/memory/        # NUEVO
│  │     ├─ modules/voice/         # NUEVO
│  │     ├─ modules/avatar/        # NUEVO (estado/config)
│  │     ├─ modules/pc/            # NUEVO — Control de PC (orquesta al Agent)
│  │     └─ modules/integrations/  # NUEVO
│  │
│  └─ desktop/                     # NUEVO — Renacer Desktop Agent (Electron/Tauri)
│     └─ src/
│        ├─ wakeword/              # escucha continua
│        ├─ actions/               # ejecutor allowlist del SO
│        └─ bridge/                # canal seguro con la API
│
└─ packages/
   ├─ shared/                      # EXISTE — se añaden contratos nuevos
   │  └─ src/
   │     ├─ constants/rpg.ts       # (intacto)
   │     └─ schemas/               # NUEVO — Zod de core/memory/voice/pc
   └─ core-contracts/              # NUEVO (opcional) — tipos de eventos del bus
```

---

## 5. Nuevas tablas de base de datos (solo se AÑADEN)

> Requiere habilitar la extensión `pgvector`. Ninguna tabla existente se altera.

**Core IA / Conversación**
- `Conversation` — id, userId, channel (`TEXT|VOICE`), startedAt.
- `Message` — id, conversationId, role (`USER|ASSISTANT|SYSTEM`), content, tokens, createdAt.
- `Decision` — id, userId, intent, chosenAction, confidence, payload(json), createdAt *(auditoría del Sistema de Decisiones)*.
- `Recommendation` — id, userId, type, content, source, status, createdAt.
- `EmotionLog` — id, userId, source (`JOURNAL|VOICE|CHAT`), emotions(json), valence, arousal, createdAt.

**Memoria**
- `Memory` — id, userId, kind (`GOAL|HABIT|FACT|PREFERENCE|EVENT|CONVERSATION`), content, embedding `vector(1536)`, importance, lastUsedAt, createdAt.
- `Goal` — id, userId, title, description, targetDate, status, progress.
- `Habit` — id, userId, title, cadence (`DAILY|WEEKLY`), active.
- `HabitLog` — id, habitId, date, done.

**Voz**
- `VoiceSession` — id, userId, conversationId, deviceId, startedAt, endedAt.
- `VoiceTranscript` — id, sessionId, text, isFinal, createdAt.
- `TtsCache` — id, hash, voice, audioUrl, visemes(json).

**Avatar**
- `AvatarConfig` — id, userId, modelId, voice, palette(json).
- `AvatarState` — id, userId, emotion, intensity, updatedAt.

**Control de PC**
- `DeviceAgent` — id, userId, name, tokenHash, lastSeenAt, trusted.
- `PcAction` — id, key, label, category, requiresConfirmation, **allowlisted**.
- `Automation` — id, userId, trigger(json), actionKey, params(json), enabled.
- `AutomationRun` — id, automationId, status, output, startedAt *(auditoría)*.

**Integraciones**
- `Integration` — id, userId, provider, credentials(json, cifrado), scopes, status.
- `IntegrationEvent` — id, integrationId, type, payload(json), createdAt.

---

## 6. APIs y canales nuevos

**REST (prefijo `/api/v1`, additive)**
| Área | Endpoints |
|---|---|
| Core IA | `POST /core/chat` (orquestado) · `POST /core/intent` · `GET /core/recommendations` · `GET /core/decisions` |
| Memoria | `CRUD /memory` · `POST /memory/search` (semántico) · `CRUD /goals` · `CRUD /habits` · `POST /habits/:id/log` |
| Voz | `POST /voice/stt` · `POST /voice/tts` · `POST /voice/sessions` |
| Avatar | `GET /avatar/config` · `PATCH /avatar/config` · `GET /avatar/state` |
| Control PC | `POST /pc/agents/register` · `GET /pc/actions` · `CRUD /pc/automations` · `POST /pc/intent` (→ Agent, con confirmación) |
| Integraciones | `CRUD /integrations` · `POST /integrations/:id/connect` |

**WebSocket (`/realtime`)**
- Cliente→servidor: `chat:message`, `voice:audio-chunk`, `pc:confirm`.
- Servidor→cliente: `chat:token` (streaming), `avatar:state`, `avatar:viseme`, `voice:transcript`, `pc:action-request`, `recommendation:new`.

**Canal local Desktop Agent ↔ API**
- Agent se autentica con token de dispositivo; recibe `pc:action-request`, valida contra allowlist, pide confirmación al usuario, ejecuta, responde `pc:action-result`.

---

## 7. Estrategia de migración (Strangler Fig, additive-only)

| Paso | Acción | Garantía de no-ruptura |
|---|---|---|
| **M0** | **Caracterización**: tests sobre endpoints existentes (`/auth`, `/rpg/stats`) y snapshot de las 10 páginas. | Red de seguridad antes de tocar nada. |
| **M1** | Crear `api/src/core/` y `core/bus/` **vacíos/aditivos**. `core/rpg.ts` solo **re-exporta** `modules/rpg`. | Cero cambios de comportamiento. |
| **M2** | Montar **WebSocket Gateway** en paralelo al REST. | REST sigue idéntico. |
| **M3** | Migraciones Prisma **solo-añadir** (pgvector + tablas nuevas). | Tablas existentes intactas. |
| **M4** | Implementar **Memoria** + **Motor de Conversación** (sobre `lib/ai.ts`). Exponer `/core/chat`. | Nuevas rutas, nada se reemplaza. |
| **M5** | **Avatar** y **Voz** en frontend como `features/` nuevos + ventana de asistente. | Páginas actuales sin cambios. |
| **M6** | **Desktop Agent** + **Control de PC** (allowlist + confirmación + auditoría). | Aislado, opt-in, sin permisos por defecto. |
| **M7** | **Integraciones** y promover Mentor→Sistema de Recomendaciones. | Reutiliza datos existentes. |

**Bandera de seguridad:** todo lo nuevo detrás de *feature flags*; se puede desactivar Core IA y la app vuelve a su comportamiento actual exacto.

---

## 8. Riesgos e impactos

| # | Riesgo | Severidad | Mitigación |
|---|---|---|---|
| R1 | **Control de PC = ejecución de código en el SO** (superficie de ataque crítica). | 🔴 Alta | Desktop Agent local, allowlist estricta, confirmación obligatoria, tokens firmados, auditoría, sin permisos por defecto, nunca acciones de dinero/borrado automáticas. |
| R2 | Romper funcionalidad existente. | 🔴 Alta | Additive-only + tests de caracterización (M0) + feature flags. |
| R3 | Complejidad de tiempo real (sincronía estado Avatar/Voz). | 🟠 Media | WebSocket Gateway aislado; degradación elegante a REST. |
| R4 | Migración a **pgvector**. | 🟠 Media | Solo añade columnas/tablas; índice IVFFlat; rollback simple. |
| R5 | Privacidad (voz, memoria, conversaciones). | 🔴 Alta | Cifrado en reposo, opt-in de grabación, export/borrado total del usuario. |
| R6 | Licencia Live2D Cubism y costos de TTS/STT/LLM. | 🟠 Media | Verificar términos; proveedores intercambiables; caché TTS; cuotas. |
| R7 | Wake word imposible en navegador. | 🟡 Baja | Vive en Desktop Agent; fallback push-to-talk en web. |
| R8 | Scope creep (ecosistema enorme). | 🟠 Media | Roadmap por fases + prioridad estricta (sección 9). |

---

## 9. Roadmap de implementación y prioridad de módulos

**Prioridad (qué construir primero y por qué):**

1. 🥇 **Core IA (Orquestador + Conversación + Event Bus)** — todo lo demás depende de él.
2. 🥈 **Memoria (pgvector)** — sin memoria, la conversación no es contextual.
3. 🥉 **WebSocket Gateway** — habilita streaming, Voz y Avatar.
4. **Voz** — alto impacto, riesgo medio.
5. **Avatar** — alto "deleite", aislado en frontend, bajo riesgo backend.
6. **Sistema de Recomendaciones / Decisiones** — formaliza el Mentor.
7. **Control de PC + Desktop Agent** — máximo riesgo → **al final**, tras endurecer seguridad.
8. **Integraciones** — continuo.

**Fases (sobre las fases originales 0–8, sin reiniciarlas):**

| Fase AI | Semanas | Entregable |
|---|---|---|
| **AI-0** | 1 | Caracterización + flags + andamiaje `core/` (M0–M1). |
| **AI-1** | 2-4 | Event Bus + Orquestador + Motor de Conversación + `/core/chat`. |
| **AI-2** | 5-6 | Memoria (pgvector) + retrieval contextual. |
| **AI-3** | 7-8 | WebSocket Gateway + ventana de asistente con chat en streaming. |
| **AI-4** | 9-11 | Módulo Voz (STT/TTS + push-to-talk). |
| **AI-5** | 12-14 | Módulo Avatar (Live2D + lip-sync + estados emocionales). |
| **AI-6** | 15-16 | Recomendaciones/Decisiones (Mentor formalizado). |
| **AI-7** | 17-20 | Desktop Agent + Control de PC (allowlist, confirmación, auditoría). |
| **AI-8** | 21+ | Integraciones + pulido + activación por voz (wake word). |

---

## 10. Cómo empezar tu camino (primer paso concreto, sin romper nada)

Cuando decidas implementar (en otra iteración), el arranque seguro es **AI-0 + AI-1**:
1. Añadir tests de caracterización a `/auth` y `/rpg/stats`.
2. Crear `apps/api/src/core/` con `bus/` (EventEmitter sobre Redis) y `core/rpg.ts` re-exportando el motor actual.
3. Crear `core/conversation/` envolviendo `lib/ai.ts` y exponer `POST /core/chat` (detrás de un flag).

Eso entrega el **núcleo central de IA** funcionando *junto* a la app actual, sin modificar una sola línea de lo que ya existe. A partir de ahí, cada módulo nuevo se enchufa al Event Bus.

---

## 11. Estado de implementación

> Las fases **AI-0 → AI-3** ya están construidas y verificadas (typecheck + build verdes), de forma **additive-only**.

| Fase | Entregable | Estado | Archivos |
|---|---|---|---|
| AI-0 | Feature flags | ✅ | `apps/api/src/config/flags.ts` |
| AI-1 | Event Bus tipado | ✅ | `core/bus/{events,eventBus}.ts` |
| AI-1 | Motor RPG (re-export, no se movió) | ✅ | `core/rpg.ts` |
| AI-1 | Motor de Conversación | ✅ | `core/conversation/conversation.service.ts` |
| AI-1 | Sistema de Decisiones | ✅ | `core/decisions/decisions.service.ts` |
| AI-1 | Análisis Emocional | ✅ | `core/emotion/emotion.service.ts` |
| AI-1 | Sistema de Recomendaciones (Mentor) | ✅ | `core/recommendations/recommendations.service.ts` |
| AI-1 | Orquestador | ✅ | `core/orchestrator/orchestrator.service.ts` |
| AI-2 | Memoria (semántica + objetivos/hábitos) | ✅ | `modules/memory/`, `core/conversation/embeddings.ts` |
| AI-2 | Tablas nuevas (20+, additive) | ✅ | `prisma/schema.prisma` |
| AI-3 | WebSocket Gateway | ✅ | `realtime/gateway.ts` |
| AI-3 | Asistente (chat + voz + avatar) | ✅ | `web/src/pages/Assistant.tsx`, `web/src/features/assistant/` |

**Endpoints vivos** (tras `FEATURE_CORE_IA=true`): `POST /core/chat`, `GET /core/recommendations`,
`POST /core/recommendations/generate`, `GET /core/conversations/:id/messages`,
`POST /memory`, `POST /memory/search`, `CRUD /memory/goals`, `CRUD /memory/habits`.

**Notas del cimiento (con ruta de upgrade a producción):**
- Embeddings: implementación determinista (hashing) → sustituir por OpenAI/Anthropic + **pgvector** (la columna `Memory.embedding` ya existe como `Float[]`).
- Análisis emocional: léxico ligero → combinar con `AIProvider`.
- Voz: Web Speech API del navegador → Whisper/ElevenLabs + wake word en el Desktop Agent.
- Avatar: placeholder emocional → modelo **Live2D** con lip-sync (misma interfaz `emotion` + `speaking`).

**Pendiente (siguientes fases):** AI-4/5 (Voz y Avatar de producción), AI-6 (Decisiones avanzadas),
**AI-7 Control de PC + Desktop Agent** (último, por riesgo), AI-8 Integraciones.
