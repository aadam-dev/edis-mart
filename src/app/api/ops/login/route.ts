import { NextResponse } from "next/server";
import { authenticatePassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string; email?: string };
  const password = body.password || "";
  const user = await authenticatePassword(password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  if (body.email && body.email !== user.email) {
    // optional email check
  }
  await createSession(user);
  return NextResponse.json({ user });
}
