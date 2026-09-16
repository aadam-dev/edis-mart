import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "edis-ops-session";
const SESSION_DAYS = 14;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "manager" | "till";
};

function secret() {
  return (
    process.env.OPS_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "yeskoko-dev-secret"
  );
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

function sign(payload: string) {
  return createHash("sha256")
    .update(`${payload}.${secret()}`)
    .digest("hex")
    .slice(0, 32);
}

export async function createSession(user: SessionUser) {
  const body = Buffer.from(
    JSON.stringify({
      ...user,
      exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    }),
  ).toString("base64url");
  const token = `${body}.${sign(body)}`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || sig !== sign(body)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data?.exp || data.exp < Date.now()) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
    };
  } catch {
    return null;
  }
}

export async function requireOwner() {
  const user = await getSessionUser();
  if (!user || user.role !== "owner") return null;
  return user;
}

export async function requireOpsUser() {
  const user = await getSessionUser();
  if (!user) return null;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || !dbUser.active) return null;
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role as SessionUser["role"],
  };
}

/** Email + password login against User table */
export async function authenticateCredentials(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return null;

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (user && user.active && verifyPassword(password, user.passwordHash)) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as SessionUser["role"],
    };
  }

  // Legacy env bootstrap: ADMIN_PASSWORD alone still works for the seeded owner email
  const envPass = process.env.ADMIN_PASSWORD || "yeskoko-admin";
  if (password === envPass) {
    const ownerEmail = (
      process.env.OWNER_EMAIL || "admin@edismart.com"
    ).toLowerCase();
    if (normalized === ownerEmail || !normalized) {
      let owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
      if (!owner) {
        owner = await prisma.user.create({
          data: {
            email: ownerEmail,
            name: "Edis Mart Admin",
            passwordHash: hashPassword(envPass),
            role: "owner",
          },
        });
      }
      return {
        id: owner.id,
        email: owner.email,
        name: owner.name,
        role: owner.role as SessionUser["role"],
      };
    }
  }

  return null;
}

/** @deprecated prefer authenticateCredentials */
export async function authenticatePassword(password: string) {
  return authenticateCredentials(
    process.env.OWNER_EMAIL || "admin@edismart.com",
    password,
  );
}
