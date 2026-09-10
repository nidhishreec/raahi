import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifySessionToken } from "@/lib/session";

// PATCH /api/orders/[id] -- staff or owner only.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const staffToken = req.cookies.get("raahi_staff_session")?.value;
  const ownerToken = req.cookies.get("raahi_owner_session")?.value;
  const session =
    (await verifySessionToken(staffToken)) || (await verifySessionToken(ownerToken));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { status } = (await req.json()) as { status: string };
  const allowed = ["Preparing", "Served", "Paid via UPI", "Paid via Card", "Paid via Cash", "Archived"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
