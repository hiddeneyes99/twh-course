# CYBER_TRACK — IT Training Tracker

A team IT training curriculum and progress tracker built for the CYBER_TRACK team.

## Stack

- **Monorepo:** pnpm workspaces
- **Frontend:** React 19 + Vite + Tailwind CSS 4 + Radix UI + TanStack Query + Wouter
- **Backend:** Express 5 + Node.js 24
- **Database:** PostgreSQL via Drizzle ORM (hosted on Supabase)
- **Auth:** Supabase Auth
- **API:** OpenAPI spec-first; Orval generates React hooks and Zod schemas

## Project Layout

| Path | What it is |
|---|---|
| `artifacts/it-training-tracker` | React frontend (preview at `/`) |
| `artifacts/api-server` | Express API server (preview at `/api`) |
| `artifacts/mockup-sandbox` | UI component sandbox |
| `lib/db` | Drizzle schema + DB client |
| `lib/api-spec` | OpenAPI definition + Orval codegen config |
| `lib/api-client-react` | Generated React query hooks |
| `lib/api-zod` | Generated Zod schemas |

## How to Run

Three workflows are configured and start automatically:

1. **Frontend** — `pnpm --filter @workspace/it-training-tracker run dev`
2. **API Server** — `pnpm --filter @workspace/api-server run dev`
3. **Mockup Sandbox** — `pnpm --filter @workspace/mockup-sandbox run dev`

## Database

Supabase PostgreSQL — connection config is already in the environment. To push schema changes:

```bash
pnpm --filter @workspace/db run push
```

## API Codegen

If `lib/api-spec/openapi.yaml` changes, regenerate client code:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## User Preferences

- Keep existing Supabase setup — do not swap the database or auth provider.
- Do not restructure the monorepo layout.
