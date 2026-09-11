import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifySessionToken } from "@/lib/session";

// PATCH /api/bill-requests/[id] -- staff or owner only. Marks a bill
// request resolved (staff acknowledged it, or the table got settled).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const staffToken = req.cookies.get("raahi_staff_session")?.value;
  const ownerToken = req.cookies.get("raahi_owner_session")?.value;
  const session =
    (await verifySessionToken(staffToken)) || (await verifySessionToken(ownerToken));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("bill_requests")
    .update({ status: "Resolved", resolved_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
