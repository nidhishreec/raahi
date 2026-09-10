import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, Role } from "@/lib/session";

// .env.local (and Vercel env vars) -- pick real passcodes, NOT "raahi2026":
//   STAFF_PASSCODE=...
//   OWNER_PASSCODE=...
//   SESSION_SECRET=<openssl rand -base64 32>

export async function POST(req: NextRequest) {
  const { passcode, role } = (await req.json()) as { passcode: string; role: Role };

  const expected = role === "owner" ? process.env.OWNER_PASSCODE : process.env.STAFF_PASSCODE;

  if (!expected || passcode !== expected) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const token = await createSessionToken(role);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(`raahi_${role}_session`, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
