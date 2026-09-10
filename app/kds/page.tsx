"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MENU_CATEGORIES } from "@/lib/constants";
import type { Order, MenuItem } from "@/lib/types";

export default function KdsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<"kds" | "inventory">("kds");
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const [staffCategory, setStaffCategory] = useState("All");
  const [staffSearch, setStaffSearch] = useState("");

  // Live orders: reading is still allowed by RLS for the anon key,
  // only writes are gated -- so this stays a direct Supabase read +
  // realtime subscription, same as before.
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["Pending Kitchen", "Preparing", "Served"])
        .order("created_at", { ascending: false });

      if (data) setOrders(data as Order[]);
      if (error) console.error("Error fetching KDS orders:", error);
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel("staff-kds-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            if (["Pending Kitchen", "Preparing", "Served"].includes(payload.new.status)) {
              setOrders((prev) => [payload.new, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            if (payload.new.status.startsWith("Paid via")) {
              setOrders((prev) => prev.filter((ord) => ord.id !== payload.new.id));
            } else {
              setOrders((prev) => prev.map((ord) => (ord.id === payload.new.id ? payload.new : ord)));
            }
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((ord) => ord.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Menu now comes from the API (backed by Supabase), not a hardcoded array.
  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data.items || []))
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  // Status updates now go through the authenticated API route instead
  // of a direct client-side Supabase write -- this is what actually
  // stops an unauthenticated visitor from moving the kitchen queue.
  const updateStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus as any } : ord)));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update order.");
    }
  };

  // Stock toggle now persists to Supabase via the authenticated API
  // route, instead of only updating local React state.
  const toggleAvailability = async (item: MenuItem) => {
    const nextAvailable = !item.is_available;
    setMenuItems((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, is_available: nextAvailable } : m))
    ); // optimistic update

    const res = await fetch("/api/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, is_available: nextAvailable }),
    });

    if (!res.ok) {
      // revert on failure
      setMenuItems((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, is_available: item.is_available } : m))
      );
      const data = await res.json();
      alert(data.error || "Failed to update stock status.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "staff" }),
    });
    window.location.href = "/staff-login";
  };

  const filteredOrders = orders.filter((order) => filter === "All" || order.status === filter);

  const filteredStaffMenu = menuItems.filter((item) => {
    const matchesCat = staffCategory === "All" || item.category === staffCategory;
    const matchesSearch =
      staffSearch.trim() === "" || item.name.toLowerCase().includes(staffSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen font-sans p-4 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
              Staff Kitchen & Bar Station
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">Raahi Staff Portal</h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            ← Exit to Homepage
          </Link>
          <button
            onClick={handleLogout}
            className="border border-white/10 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("kds")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "kds" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Live Kitchen Queue ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "inventory" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Menu Stock Control (In/Out of Stock)
        </button>
      </div>

      {activeTab === "kds" ? (
        <div>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {["All", "Pending Kitchen", "Preparing", "Served"].map((tab) => {
              const count = tab === "All" ? orders.length : orders.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    filter === tab
                      ? "bg-[#D4AF37] text-black shadow-lg"
                      : "bg-[#12100E] text-gray-400 border border-white/10 hover:text-white"
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === tab ? "bg-black/20 text-black" : "bg-white/10 text-white"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="text-center py-24 text-gray-500 font-serif text-xl animate-pulse">
              Loading live kitchen orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
              No active orders found in this queue. Everything is caught up! 🥂
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => {
                const isPending = order.status === "Pending Kitchen";
                const isPreparing = order.status === "Preparing";

                return (
                  <div
                    key={order.id}
                    className={`bg-[#12100E] border rounded-2xl p-6 shadow-2xl flex flex-col justify-between transition-all ${
                      isPending ? "border-amber-500/50" : isPreparing ? "border-blue-500/50" : "border-white/10 opacity-75"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                        <div>
                          <span className="text-xl font-serif text-[#D4AF37] font-bold block">
                            Table #{order.table_num}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">ID: {order.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold inline-block mb-1 ${
                              isPending
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : isPreparing
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-green-500/20 text-green-300 border border-green-500/30"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-[11px] text-gray-400 block font-mono">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 mb-6 max-h-64 overflow-y-auto pr-1">
                        {order.items?.map((item, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm bg-white/5 px-3.5 py-2.5 rounded-xl border border-white/5">
                            <span className="text-white font-medium">
                              <strong className="text-[#D4AF37] mr-2 text-base">{item.qty}x</strong> {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                      {order.status === "Pending Kitchen" && (
                        <>
                          <button
                            onClick={() => updateStatus(order.id, "Preparing")}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Start Preparing
                          </button>
                          <button
                            onClick={() => updateStatus(order.id, "Served")}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/40 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Mark Served / Ready ✓
                          </button>
                        </>
                      )}
                      {order.status === "Preparing" && (
                        <button
                          onClick={() => updateStatus(order.id, "Served")}
                          className="col-span-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/40 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Mark Served / Ready ✓
                        </button>
                      )}
                      {order.status === "Served" && (
                        <div className="col-span-2 text-center py-2 text-xs text-gray-500 uppercase tracking-widest font-semibold">
                          Order Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="font-serif text-2xl text-white">Menu Stock Control</h2>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                Mark items in or out of stock instantly
              </p>
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              className="w-full lg:w-80 bg-[#12100E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setStaffCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  staffCategory === cat ? "bg-[#D4AF37] text-black shadow-md" : "bg-[#12100E] text-gray-400 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaffMenu.map((item) => (
              <div
                key={item.id}
                className={`bg-[#12100E] border rounded-2xl p-6 shadow-xl flex flex-col justify-between ${
                  item.is_available ? "border-white/10" : "border-red-500/30 opacity-60"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-1">{item.category}</span>
                      <h3 className="font-serif text-base text-white">{item.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest font-bold shrink-0 ${
                        item.is_available
                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {item.is_available ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-6">
                    ₹{item.price} — {item.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleAvailability(item)}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                    item.is_available
                      ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                      : "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                  }`}
                >
                  {item.is_available ? "Mark Out of Stock ✕" : "Mark In Stock ✓"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}