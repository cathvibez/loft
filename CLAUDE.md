# The Loft

A digital "Third Space" for Gen Z tech workers. Users write daily logbook entries, AI categorizes them into Work / Hobby / Wellness / Social, and each entry spawns a unique object that appears in their persistent room.

## Repo Structure

```
/
├── frontend/          # Next.js 16 app (port 5050)
├── packages/
│   └── db-schema/     # SQL migrations (PostgreSQL)
├── docker-compose.yml # PostgreSQL + Redis
├── turbo.json
└── package.json       # npm workspaces root
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Monorepo**: npm workspaces + Turborepo

## Local Dev

```bash
# 1. Install dependencies
npm install

# 2. Start infrastructure (Postgres + Redis)
docker-compose up -d

# 3. Run all dev servers
npm run dev
```

Frontend runs at **http://localhost:5050**.

## Database

Credentials (local):
- Host: `localhost:5432`
- DB: `the_loft`
- User: `loft_user` / `loft_password`

### Schema

**`entries`** — logbook entries written by users
- `id` UUID PK
- `user_id` UUID
- `text` TEXT
- `category` VARCHAR(50) — Work | Hobby | Wellness | Social (AI-assigned)
- `ai_summary` TEXT
- `deleted_at` TIMESTAMP (soft delete)

**`objects`** — room objects spawned from entries
- `id` UUID PK
- `user_id` UUID
- `entry_id` UUID FK → entries (cascade delete)
- `name` VARCHAR(255), `emoji` VARCHAR(10), `category` VARCHAR(50)
- `position_x`, `position_y` INT — position in the room (default 50)
- `animation_state` VARCHAR(50) — default `idle`

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all workspaces in parallel (via Turborepo) |
| `npm run build` | Build all workspaces |

## Key Notes

- Migrations live in `packages/db-schema/migrations/` — add new `.sql` files sequentially (e.g. `002_...sql`)
- No ORM yet — raw SQL via migrations
- The `objects` table hard-deletes cascade from `entries` (no orphaned objects)
- `position_x`/`position_y` represent percentage-based coordinates in the room UI (0–100)
