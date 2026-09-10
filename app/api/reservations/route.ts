import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// POST /api/reservations -- public, but validated server-side.
// Reservations contain a phone number, so this table has no public
// SELECT policy (see supabase/reservations.sql) -- this route is the
// only way in or out, and it only allows writing, not reading.
export async function POST(req: NextRequest) {
  const { name, phone, date, time } = (await req.json()) as {
    name: string;
    phone: string;
    date: string;
    time: string;
  };

  if (!name?.trim() || !phone?.trim() || !date || !time) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (name.trim().length > 100) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }
  if (!/^[\d+\-\s()]{7,20}$/.test(phone.trim())) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  const requestedDate = new Date(`${date}T${time}`);
  if (isNaN(requestedDate.getTime()) || requestedDate < new Date()) {
    return NextResponse.json({ error: "Please choose a valid future date and time." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("reservations").insert([
    { name: name.trim(), phone: phone.trim(), date, time, status: "Pending" },
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
