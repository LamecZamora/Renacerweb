# 🌅 Proyecto Renacer

Sistema Operativo Personal impulsado por IA para transformación física, mental, académica y profesional.

> Lee **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** para la arquitectura completa, modelo de datos, contrato de API, flujo de usuario y plan por fases.

## Stack
- **Web:** React + TypeScript + Vite + TailwindCSS + Framer Motion + Recharts
- **API:** Node + Express + TypeScript + Prisma
- **DB:** PostgreSQL · **Cache/colas:** Redis (BullMQ)
- **Auth:** JWT + OAuth · **IA:** Anthropic/OpenAI (proveedor intercambiable)

## Estructura
```
apps/web      Frontend (dashboard, módulos, IA)
apps/api      Backend (Express, módulos por dominio)
packages/shared  Tipos + esquemas Zod + constantes RPG
docs/         Arquitectura, API, roadmap
```

## Arranque local
```bash
# 1) Infra (Postgres + Redis)
docker compose up -d

# 2) Variables de entorno
cp .env.example .env   # rellena claves

# 3) Backend
cd apps/api
npm install
npm run db:generate && npm run db:migrate
npm run dev            # http://localhost:4000

# 4) Frontend
cd ../web
npm install
npm run dev            # http://localhost:5173
```

## Estado
Fase 0–1 en marcha: andamiaje del monorepo, modelo de datos completo (Prisma),
sistema RPG/XP compartido y Dashboard funcional. Siguientes fases en `docs/ARCHITECTURE.md`.
