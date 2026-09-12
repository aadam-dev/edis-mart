import { NextResponse } from "next/server";

function authorized(req: Request) {
  const pwd = req.headers.get("x-admin-password");
  return pwd && pwd === process.env.ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Catalog is code-backed on Vercel; stock edits are local-only until Postgres lands.
  return NextResponse.json({
    ok: true,
    note: "Stock is catalog-backed. Connect Postgres to persist stock edits.",
  });
}
