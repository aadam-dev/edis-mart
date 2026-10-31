import type { SessionUser } from "@/lib/auth";

export type Permission =
  | "ops.view"
  | "partners.manage"
  | "production.manage"
  | "compliance.manage"
  | "trade.manage"
  | "finance.view"
  | "reports.view"
  | "people.manage"
  | "import.run"
  | "settings.manage";

const rolePermissions: Record<SessionUser["role"], Permission[]> = {
  owner: [
    "ops.view",
    "partners.manage",
    "production.manage",
    "compliance.manage",
    "trade.manage",
    "finance.view",
    "reports.view",
    "people.manage",
    "import.run",
    "settings.manage",
  ],
  manager: [
    "ops.view",
    "partners.manage",
    "production.manage",
    "compliance.manage",
    "trade.manage",
    "finance.view",
    "settings.manage",
  ],
  till: ["ops.view"],
};

export function can(user: SessionUser | null | undefined, permission: Permission) {
  if (!user) return false;
  return rolePermissions[user.role]?.includes(permission) ?? false;
}

export function requirePermission(
  user: SessionUser | null | undefined,
  permission: Permission,
) {
  return can(user, permission) ? user : null;
}
