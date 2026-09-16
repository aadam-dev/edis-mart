import { NextResponse } from "next/server";
import { hashPassword, requireOpsUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await requireOpsUser();
  if (!user || user.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, password, role } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const created = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role,
      },
    });
    return NextResponse.json({
      user: { id: created.id, email: created.email, role: created.role },
    });
  } catch {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }
}
