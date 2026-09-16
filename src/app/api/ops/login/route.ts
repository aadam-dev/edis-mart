import { NextResponse } from "next/server";
import {
  authenticateCredentials,
  buildSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string; email?: string };
    const email = body.email || "";
    const password = body.password || "";
    const user = await authenticateCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ user });
    res.cookies.set(
      SESSION_COOKIE,
      buildSessionToken(user),
      sessionCookieOptions(),
    );
    return res;
  } catch (err) {
    console.error("ops login failed", err);
    return NextResponse.json(
      { error: "Login failed. Check database connection." },
      { status: 500 },
    );
  }
}
