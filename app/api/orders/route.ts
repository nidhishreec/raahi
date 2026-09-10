import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// POST /api/orders -- public, but total is ALWAYS recomputed here from
// menu_items. Client sends only { table_num, items: [{ id, qty }] }.
export async function POST(req: NextRequest) {
  const { table_num, items } = (await req.json()) as {
    table_num: string;
    items: { id: number; qty: number }[];
  };

  if (!table_num || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }
  if (!/^\d{1,3}$/.test(table_num)) {
    return NextResponse.json({ error: "Invalid table number." }, { status: 400 });
  }
  for (const line of items) {
    if (!Number.isInteger(line.qty) || line.qty <= 0 || line.qty > 50) {
      return NextResponse.json({ error: "Invalid item quantity." }, { status: 400 });
    }
  }

  const ids = items.map((i) => i.id);
  const { data: menuRows, error: menuError } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, price, is_available")
    .in("id", ids);

  if (menuError) return NextResponse.json({ error: menuError.message }, { status: 500 });

  const menuById = new Map(menuRows!.map((m) => [m.id, m]));
  const orderLines: { id: number; name: string; price: number; qty: number }[] = [];
  let total = 0;

  for (const line of items) {
    const menuItem = menuById.get(line.id);
    if (!menuItem) {
      return NextResponse.json({ error: `Unknown item id ${line.id}` }, { status: 400 });
    }
    if (!menuItem.is_available) {
      return NextResponse.json(
        { error: `"${menuItem.name}" is currently out of stock.` },
        { status: 409 }
      );
    }
    orderLines.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, qty: line.qty });
    total += menuItem.price * line.qty;
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([{ table_num, items: orderLines, total, status: "Pending Kitchen" }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
