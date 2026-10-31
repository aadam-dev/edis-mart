import { copyFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

/**
 * Prefer an explicit DATABASE_URL.
 * - Production: set a managed Postgres URL (Neon/Supabase/etc). The ephemeral
 *   Vercel SQLite `/tmp` copy is not durable for ops data.
 * - Local: `file:./dev.db` under prisma/ is fine for development.
 * See docs/12-storage-cutover.md.
 */
function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  if (process.env.VERCEL) {
    console.warn(
      "[prisma] DATABASE_URL unset on Vercel — using ephemeral /tmp SQLite. Configure Postgres for durable ops.",
    );
    const snapshot = path.join(process.cwd(), "prisma", "deploy.db");
    if (existsSync(snapshot)) {
      const target = "/tmp/edis-mart.db";
      try {
        copyFileSync(snapshot, target);
      } catch {
        // concurrent boot
      }
      return `file:${target}`;
    }
  }

  return "file:./dev.db";
}

process.env.DATABASE_URL = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
