"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function KdsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["Pending Kitchen", "Preparing", "Served"])
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      if (error) console.error("Error fetching KDS orders:", error);
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel("kds-realtime-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            if (["Pending Kitchen", "Preparing", "Served"].includes(payload.new.status)) {
              setOrders((prev) => [payload.new, ...prev]);
              playNotificationSound();
            }
          } else if (payload.eventType === "UPDATE") {
            if (payload.new.status.startsWith("Paid via")) {
              setOrders((prev) => prev.filter((ord) => ord.id !== payload.new.id));
            } else {
              setOrders((prev) =>
                prev.map((ord) => (ord.id === payload.new.id ? payload.new : ord))
              );
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

  const playNotificationSound = () => {
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  return (
    <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen font-sans p-4 sm:p-8">
      
      {/* STAFF KDS HEADER (NO ADMIN LINKS, PURELY KITCHEN OPS) */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">Staff Kitchen & Bar Station</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">Raahi KDS Queue</h1>
        </div>

        <div>
          <Link
            href="/"
            className="border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            ← Exit to Homepage
          </Link>
        </div>
      </header>

      {/* FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {["All", "Pending Kitchen", "Preparing", "Served"].map((tab) => {
          const count = tab === "All" ? orders.length : orders.filter(o => o.status === tab).length;
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

      {/* ORDERS GRID */}
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
                  isPending ? "border-amber-500/50 shadow-amber-500/10" : isPreparing ? "border-blue-500/50" : "border-white/10 opacity-75"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xl font-serif text-[#D4AF37] font-bold block">
                        Table #{order.table_num}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        ID: {order.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold inline-block mb-1 ${
                        isPending ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                        isPreparing ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                        "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-[11px] text-gray-400 block font-mono">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6 max-h-64 overflow-y-auto pr-1">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-white/5 px-3.5 py-2.5 rounded-xl border border-white/5">
                        <span className="text-white font-medium">
                          <strong className="text-[#D4AF37] mr-2 text-base">{item.qty}x</strong> {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                  {order.status !== "Preparing" && (
                    <button
                      onClick={() => updateStatus(order.id, "Preparing")}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status !== "Served" && (
                    <button
                      onClick={() => updateStatus(order.id, "Served")}
                      className={`${order.status === "Preparing" ? "col-span-2" : ""} bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/40 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer`}
                    >
                      Mark Served / Ready ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}