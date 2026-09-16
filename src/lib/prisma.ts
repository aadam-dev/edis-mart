import { copyFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

/**
 * On Vercel, DATABASE_URL is often unset and the FS is read-only except /tmp.
 * Ship a seeded SQLite snapshot (prisma/deploy.db) and copy it to /tmp at boot.
 * Replace with Postgres DATABASE_URL in production when ready for durable ops data.
 */
function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const snapshot = path.join(process.cwd(), "prisma", "deploy.db");
  if (existsSync(snapshot)) {
    const target = "/tmp/edis-mart.db";
    try {
      copyFileSync(snapshot, target);
    } catch {
      // Another concurrent instance may have created it
    }
    return `file:${target}`;
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
