import { authOptions } from "@/auth";
import { BetterSqliteAdapter } from "@/lib/auth-adapter";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPassword } from "@/lib/hash";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const stmt = db.prepare("SELECT id, email, password FROM users WHERE email = ?");
    const user = stmt.get(email) as any;

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValidPassword = verifyPassword(user.password, password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const adapter = BetterSqliteAdapter(db) as any;
    const sessionToken = randomUUID();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await adapter.createSession({
      sessionToken,
      userId: String(user.id),
      expires,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("next-auth.session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
