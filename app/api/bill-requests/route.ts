import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// POST /api/bill-requests -- public (any customer can request their
// bill), but de-duplicated server-side: if this table already has an
// unresolved request, we return that one instead of spamming a new
// row every time someone taps the button twice.
export async function POST(req: NextRequest) {
  const { table_num } = (await req.json()) as { table_num: string };

  if (!table_num || !/^\d{1,3}$/.test(table_num)) {
    return NextResponse.json({ error: "Invalid table number." }, { status: 400 });
  }

  const { data: existing, error: findError } = await supabaseAdmin
    .from("bill_requests")
    .select("*")
    .eq("table_num", table_num)
    .eq("status", "Requested")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
  if (existing) return NextResponse.json({ request: existing });

  const { data, error } = await supabaseAdmin
    .from("bill_requests")
    .insert([{ table_num, status: "Requested" }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data });
}
