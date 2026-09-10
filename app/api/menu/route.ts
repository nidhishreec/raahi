import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifySessionToken } from "@/lib/session";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

// PATCH /api/menu -- staff or owner only. Body: { id, is_available }
export async function PATCH(req: NextRequest) {
  const staffToken = req.cookies.get("raahi_staff_session")?.value;
  const ownerToken = req.cookies.get("raahi_owner_session")?.value;
  const session =
    (await verifySessionToken(staffToken)) || (await verifySessionToken(ownerToken));

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id, is_available } = (await req.json()) as { id: number; is_available: boolean };

  const { error } = await supabaseAdmin
    .from("menu_items")
    .update({ is_available, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
