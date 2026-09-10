"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export default function RaahiAdminDashboard() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [checkoutTable, setCheckoutTable] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "Cash">("UPI");
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  // On load, check for an existing valid owner session cookie so a
  // refresh doesn't force a re-login every time.
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.role === "owner") setIsAuthenticated(true);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode, role: "owner" }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      const data = await res.json();
      setLoginError(data.error || "Incorrect passcode.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "owner" }),
    });
    setIsAuthenticated(false);
  };

  // Reads still go direct via Supabase (RLS allows public SELECT on
  // orders) -- only writes go through the authenticated API.
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setAllOrders(data as Order[]);
      if (error) console.error(error);
    };

    fetchOrders();

    const orderChannel = supabase
      .channel("admin-realtime-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [isAuthenticated]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setAllOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update order.");
    }
  };

  const handleCheckoutTable = async (tableNum: string) => {
    setCheckoutInProgress(true);
    const ordersToSettle = allOrders.filter(
      (o) => o.table_num === tableNum && !o.status.startsWith("Paid via")
    );

    const results = await Promise.all(
      ordersToSettle.map((o) =>
        fetch(`/api/orders/${o.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: `Paid via ${paymentMethod}` }),
        })
      )
    );

    setCheckoutInProgress(false);

    if (results.some((r) => !r.ok)) {
      alert("Some items failed to settle. Please check the table again.");
      return;
    }

    alert(`Table #${tableNum} successfully checked out via ${paymentMethod}!`);
    setCheckoutTable(null);
    setAllOrders((prev) =>
      prev.map((order) =>
        order.table_num === tableNum && !order.status.startsWith("Paid via")
          ? { ...order, status: `Paid via ${paymentMethod}` as any }
          : order
      )
    );
  };

  if (checkingSession) {
    return (
      <main className="bg-[#06080C] text-[#D4AF37] min-h-screen flex items-center justify-center font-serif text-xl">
        Loading...
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen flex items-center justify-center font-sans p-6">
        <div className="w-full max-w-md bg-[#12100E] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-[#D4AF37] text-2xl">✦</span>
            <h1 className="font-serif text-3xl text-white mt-2">Raahi Owner Portal</h1>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Restricted Financial & Executive Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#D4AF37] mb-2">Owner Passcode</label>
              <input
                type="password"
                placeholder="Enter owner passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              Unlock Executive Dashboard
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors">
              ← Return to Website Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const paidOrders = allOrders.filter((o) => o.status.startsWith("Paid via"));
  const now = new Date();

  const dailyRevenue = paidOrders
    .filter((o) => {
      const d = new Date(o.created_at);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    })
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const weeklyRevenue = paidOrders
    .filter((o) => Math.abs(now.getTime() - new Date(o.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 7)
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const monthlyRevenue = paidOrders
    .filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const yearlyRevenue = paidOrders
    .filter((o) => new Date(o.created_at).getFullYear() === now.getFullYear())
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const upiRevenue = paidOrders.filter((o) => o.status === "Paid via UPI").reduce((sum, o) => sum + (o.total || 0), 0);
  const cardRevenue = paidOrders.filter((o) => o.status === "Paid via Card").reduce((sum, o) => sum + (o.total || 0), 0);
  const cashRevenue = paidOrders.filter((o) => o.status === "Paid via Cash").reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const liveKitchenOrders = allOrders.filter((o) => ["Pending Kitchen", "Preparing"].includes(o.status));
  const activeTableOrders = allOrders.filter((o) => ["Pending Kitchen", "Preparing", "Served"].includes(o.status));
  const historyOrders = allOrders.filter((o) => o.status.startsWith("Paid via") || o.status === "Archived");

  const tableCheckoutOrders = checkoutTable ? activeTableOrders.filter((o) => o.table_num === checkoutTable) : [];
  const tableCheckoutTotal = tableCheckoutOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen font-sans p-6 md:p-12 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">OWNER FINANCIAL & OPERATIONS SUITE</span>
          <h1 className="font-serif text-4xl text-white mt-1">Raahi Executive Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/kds"
            className="bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <span>🖥️ Open KDS Screen</span>
          </Link>
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Live Sync Active
          </div>
          <button
            onClick={handleLogout}
            className="border border-white/10 text-gray-400 hover:text-white px-5 py-2 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-6">
        <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-3">Executive Revenue & Timeframe Earnings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12100E] border border-[#D4AF37]/40 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-1">Today's Earnings (Daily)</span>
            <span className="font-serif text-3xl text-white">₹{dailyRevenue}</span>
          </div>
          <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Past 7 Days (Weekly)</span>
            <span className="font-serif text-3xl text-[#D4AF37]">₹{weeklyRevenue}</span>
          </div>
          <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">This Month (Monthly)</span>
            <span className="font-serif text-3xl text-white">₹{monthlyRevenue}</span>
          </div>
          <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">This Year (Yearly)</span>
            <span className="font-serif text-3xl text-white">₹{yearlyRevenue}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-3">Payment Method Collection Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Total Settled Revenue</span>
            <span className="font-serif text-3xl text-white">₹{totalRevenue}</span>
            <span className="text-[10px] text-gray-500 block mt-2">{paidOrders.length} settled bills</span>
          </div>
          <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">UPI Payments</span>
            <span className="font-serif text-3xl text-[#D4AF37]">₹{upiRevenue}</span>
          </div>
          <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Card Payments</span>
            <span className="font-serif text-3xl text-white">₹{cardRevenue}</span>
          </div>
          <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Cash Payments</span>
            <span className="font-serif text-3xl text-white">₹{cashRevenue}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-3">Table Status & Quick Checkout</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"].map((tbl) => {
            const hasActiveTable = activeTableOrders.some((o) => o.table_num === tbl);
            return (
              <div
                key={tbl}
                onClick={() => hasActiveTable && setCheckoutTable(tbl)}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border whitespace-nowrap transition-all ${
                  hasActiveTable
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] animate-pulse cursor-pointer hover:bg-[#D4AF37]/30"
                    : "bg-white/5 border-white/10 text-gray-500 cursor-default"
                }`}
              >
                Table #{tbl} {hasActiveTable ? "• Checkout Bill ↗" : "• Free"}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "active" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Live Kitchen Queue ({liveKitchenOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "history" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Billing History ({historyOrders.length})
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === "active" ? (
          <div>
            <h2 className="font-serif text-2xl text-white mb-6">Live Kitchen Queue</h2>
            {liveKitchenOrders.length === 0 ? (
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No active kitchen orders right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveKitchenOrders.map((order) => (
                  <div key={order.id} className="bg-[#12100E] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                        <div>
                          <span className="bg-[#D4AF37] text-black font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                            Table #{order.table_num}
                          </span>
                          <span className="text-gray-400 text-xs ml-3">ID: {order.id.slice(0, 6)}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="space-y-3 mb-6">
                        {order.items?.map((item, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-white"><span className="text-[#D4AF37] font-bold mr-2">{item.qty}x</span> {item.name}</span>
                            <span className="text-gray-400">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Status: <strong className="text-white">{order.status}</strong></span>
                        <span className="font-serif text-xl text-[#D4AF37]">₹{order.total}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, "Preparing")}
                          className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                            order.status === "Preparing" ? "bg-[#D4AF37] text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          Preparing
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, "Served")}
                          className="flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer bg-white/5 text-gray-300 hover:bg-green-600 hover:text-white"
                        >
                          Served / Done
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="font-serif text-2xl text-white mb-6">Settled Billing History</h2>
            {historyOrders.length === 0 ? (
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No settled billing history yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyOrders.map((order) => (
                  <div key={order.id} className="bg-[#12100E]/60 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between opacity-80">
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                        <div>
                          <span className="bg-white/10 text-gray-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                            Table #{order.table_num}
                          </span>
                          <span className="text-gray-500 text-xs ml-3">ID: {order.id.slice(0, 6)}</span>
                        </div>
                        <span className="text-xs text-green-400 font-semibold">{order.status}</span>
                      </div>
                      <div className="space-y-3 mb-6">
                        {order.items?.map((item, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm text-gray-400">
                            <span><span className="text-gray-300 font-bold mr-2">{item.qty}x</span> {item.name}</span>
                            <span>₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-white/5 pt-4 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="font-serif text-lg text-gray-300">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {checkoutTable && (
        <div onClick={() => setCheckoutTable(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="bg-[#12100E] border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold">Bill Settlement</span>
                <h2 className="font-serif text-2xl text-white">Table #{checkoutTable} Checkout</h2>
              </div>
              <button onClick={() => setCheckoutTable(null)} className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer bg-white/5 p-2 rounded-full w-9 h-9 flex items-center justify-center">✕</button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 mb-4">
              {tableCheckoutOrders.map((order, idx) => (
                <div key={order.id} className="bg-[#1F1C18] p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Round #{idx + 1} ({order.status})</span>
                    <span>₹{order.total}</span>
                  </div>
                  {order.items?.map((item, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-white py-0.5">
                      <span>{item.qty}x {item.name}</span>
                      <span className="text-gray-400">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="bg-[#1F1C18] p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-300 font-bold">Grand Total Due</span>
                <span className="font-serif text-2xl text-[#D4AF37]">₹{tableCheckoutTotal}</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["UPI", "Card", "Cash"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                        paymentMethod === method
                          ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setCheckoutTable(null)} className="flex-1 border border-white/10 text-gray-300 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/5 cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={() => handleCheckoutTable(checkoutTable)}
                  disabled={checkoutInProgress}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:opacity-90 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {checkoutInProgress ? "Settling..." : "Settle & Free Table Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
