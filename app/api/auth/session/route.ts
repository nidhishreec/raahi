import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

// GET /api/auth/session -- lets a page check "am I already logged in?"
// on mount (via the httpOnly cookie) without forcing a re-login on
// every refresh.
export async function GET(req: NextRequest) {
  const staffToken = req.cookies.get("raahi_staff_session")?.value;
  const ownerToken = req.cookies.get("raahi_owner_session")?.value;

  const ownerSession = await verifySessionToken(ownerToken);
  if (ownerSession) return NextResponse.json({ role: "owner" });

  const staffSession = await verifySessionToken(staffToken);
  if (staffSession) return NextResponse.json({ role: "staff" });

  return NextResponse.json({ role: null });
}
