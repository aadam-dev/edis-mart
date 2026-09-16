import { NextResponse } from "next/server";
import { authenticateCredentials, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string; email?: string };
  const email = body.email || "";
  const password = body.password || "";
  const user = await authenticateCredentials(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  await createSession(user);
  return NextResponse.json({ user });
}
