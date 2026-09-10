import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { role } = (await req.json()) as { role: "staff" | "owner" };
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(`raahi_${role}_session`);
  return res;
}
