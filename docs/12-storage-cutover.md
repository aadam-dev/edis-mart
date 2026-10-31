# 12 — Storage cutover (SQLite → managed Postgres)

## Why

Vercel copies `prisma/deploy.db` into `/tmp` when `DATABASE_URL` is unset. That path is **not durable** across instances. Expanded ops data (partners, trade leads, production) must live on managed PostgreSQL before production reliance.

## Current state

- Local default: `DATABASE_URL="file:./dev.db"` (SQLite under `prisma/`)
- Schema remains SQLite-compatible for local development
- Ops models are additive and do not rewrite `Purchase` / POS / Order tables

## Cutover checklist

1. **Backup** local/prod SQLite:
   ```bash
   cp prisma/dev.db "backups/dev-$(date +%Y%m%d).db"
   npx tsx scripts/reconcile-data.ts
   ```
2. Provision Neon/Supabase/Postgres and set `DATABASE_URL` + `DIRECT_URL` if needed.
3. Change `provider = "postgresql"` in `prisma/schema.prisma` (or maintain a `schema.postgres.prisma` shadow) and run:
   ```bash
   npx prisma migrate deploy
   ```
4. Import commerce rows with ID preservation (`scripts/export-sqlite.ts` → `scripts/import-postgres.ts`).
5. Re-run `scripts/reconcile-data.ts` against Postgres:
   - table counts
   - `Variant.stock == SUM(StockMovement.qty)`
   - sale/order totals vs lines
   - receipt + idempotency uniqueness
6. Point Vercel `DATABASE_URL` at Postgres; remove reliance on `deploy.db`.
7. Only then run `scripts/import-business-assessment.ts --apply`.

## Security

Rotate `OPS_SESSION_SECRET` and default seed passwords before production import. Enforce `src/lib/permissions.ts` on new admin routes.
