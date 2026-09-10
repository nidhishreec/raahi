"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MENU_CATEGORIES } from "@/lib/constants";
import type { MenuItem, Order } from "@/lib/types";

function OrderContent() {
  const searchParams = useSearchParams();
  const tableNum = searchParams.get("table") || "01";

  const [activeTab, setActiveTab] = useState<"menu" | "status">("menu");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [tableOrders, setTableOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showMobileCartModal, setShowMobileCartModal] = useState(false);

  // Menu now comes from Supabase via the API, and reflects live
  // stock status -- items staff mark out of stock disappear here.
  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu((data.items || []).filter((i: MenuItem) => i.is_available)))
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  useEffect(() => {
    const fetchTableOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("table_num", tableNum)
        .order("created_at", { ascending: false });

      if (data) setTableOrders(data as Order[]);
      if (error) console.error(error);
    };

    fetchTableOrders();

    const channel = supabase
      .channel(`table-${tableNum}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `table_num=eq.${tableNum}` },
        () => fetchTableOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableNum]);

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  const calculateCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = menu.find((m) => m.id === Number(id));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const totalItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // This is the key change: we send only { id, qty } pairs, never
  // price or total. The server looks up the real price from the
  // menu_items table and computes the total itself, so a tampered
  // client can no longer submit a fake discount.
  const handlePlaceOrder = async () => {
    const itemsArray = Object.entries(cart).map(([id, qty]) => ({
      id: Number(id),
      qty,
    }));

    if (itemsArray.length === 0) return;

    setIsSubmitting(true);
    setOrderError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_num: tableNum, items: itemsArray }),
    });

    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      setOrderError(data.error || "Failed to place order. Please try again.");
      return;
    }

    setCart({});
    setOrderSuccess(true);
    setShowMobileCartModal(false);
    setActiveTab("status");
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  const searchSuggestions = searchQuery.trim() === "" ? [] : menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredItems = menu.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery.trim() !== "") return matchesSearch;
    return matchesCategory;
  });

  const cumulativeBill = tableOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen font-sans pb-32">
      <nav className="sticky top-0 z-50 bg-[#06080C]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <Link href="/" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] transition-colors">
              ← Back
            </Link>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block text-center sm:text-left">
                Table #{tableNum}
              </span>
              <h1 className="font-serif text-xl sm:text-2xl text-white">Raahi Pub & Dining Menu</h1>
            </div>
          </div>

          <div className="flex bg-[#12100E] border border-white/10 rounded-full p-1 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center ${
                activeTab === "menu" ? "bg-[#D4AF37] text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              Menu & Cart
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all relative cursor-pointer text-center ${
                activeTab === "status" ? "bg-[#D4AF37] text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              My Table Bill
              {tableOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {tableOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {activeTab === "menu" && (
        <div className="bg-[#12100E]/80 border-b border-white/10 py-3 px-4 sm:px-6 sticky top-[133px] sm:top-[73px] z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 w-full lg:w-auto">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearchQuery("");
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat && !searchQuery
                      ? "bg-[#D4AF37] text-black shadow-lg"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 cursor-pointer shrink-0"
                >
                  Clear ✕
                </button>
              )}
            </div>

            <div className="w-full lg:w-72 shrink-0 relative">
              <input
                type="text"
                placeholder="Search food & drinks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#12100E] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                  {searchSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      onClick={() => {
                        setSearchQuery(sug.name);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-none cursor-pointer flex justify-between items-center text-xs"
                    >
                      <span className="text-white font-medium">{sug.name}</span>
                      <span className="text-[#D4AF37]">₹{sug.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-2xl text-xs uppercase tracking-widest text-center animate-pulse">
            ✓ Order placed successfully! Check "My Table Bill" tab for live status.
          </div>
        </div>
      )}

      {orderError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs uppercase tracking-widest text-center">
            {orderError}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {activeTab === "menu" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-white border-b border-white/10 pb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === "All" ? "Full Pub Menu & Bar" : selectedCategory}
              </h2>

              {filteredItems.length === 0 ? (
                <div className="bg-[#12100E] border border-white/10 rounded-2xl p-12 text-center text-gray-400 text-xs sm:text-sm">
                  No items match your search or category. Try searching for something else!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-[#12100E] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-serif text-base text-white">{item.name}</h3>
                          <span className="text-[#D4AF37] font-semibold text-sm shrink-0">₹{item.price}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">{item.category}</span>
                        {cart[item.id] ? (
                          <div className="flex items-center gap-3 bg-[#1F1C18] border border-white/10 px-3 py-1 rounded-xl">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-[#D4AF37] font-bold cursor-pointer">-</button>
                            <span className="text-white text-xs font-bold">{cart[item.id]}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-[#D4AF37] font-bold cursor-pointer">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
                          >
                            Add +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:block lg:sticky lg:top-36">
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="font-serif text-xl text-white mb-4 border-b border-white/10 pb-3">Current Cart</h3>
                {Object.keys(cart).length === 0 ? (
                  <p className="text-gray-500 text-xs py-8 text-center">Your cart is empty. Select food or drinks from the menu.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                      {Object.entries(cart).map(([id, qty]) => {
                        const item = menu.find((m) => m.id === Number(id));
                        return (
                          <div key={id} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="text-white block font-medium">{item?.name}</span>
                              <span className="text-xs text-gray-500">Qty: {qty}</span>
                            </div>
                            <span className="text-[#D4AF37] font-semibold">₹{(item?.price || 0) * Number(qty)}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between items-center text-base font-bold">
                      <span className="text-gray-300">Total</span>
                      <span className="text-[#D4AF37]">₹{calculateCartTotal()}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg mt-2 disabled:opacity-50"
                    >
                      {isSubmitting ? "Placing Order..." : "Place Order to Kitchen / Bar"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#12100E] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Table #{tableNum} Ledger</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1">Live Bill & Status</h2>
              </div>
              <div className="bg-[#1F1C18] border border-white/10 px-6 py-4 rounded-2xl w-full sm:w-auto text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block">Cumulative Table Total</span>
                <span className="font-serif text-2xl text-[#D4AF37]">₹{cumulativeBill}</span>
              </div>
            </div>

            {tableOrders.length === 0 ? (
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No orders placed for this table yet. Go back to the Menu tab to order food & drinks!
              </div>
            ) : (
              <div className="space-y-4">
                {tableOrders.map((order, index) => (
                  <div key={order.id} className="bg-[#12100E] border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                          Round #{tableOrders.length - index}
                        </span>
                        <span className="text-gray-500 text-xs ml-3">ID: {order.id.slice(0, 6)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold ${
                            order.status === "Served"
                              ? "bg-green-500/10 text-green-400 border border-green-500/30"
                              : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-white"><strong className="text-[#D4AF37] mr-2">{item.qty}x</strong> {item.name}</span>
                          <span className="text-gray-400">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-widest">Round Total</span>
                      <span className="font-serif text-lg text-[#D4AF37]">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === "menu" && totalItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#12100E]/95 backdrop-blur-xl border-t border-white/15 px-5 py-3.5 lg:hidden z-50 flex justify-between items-center shadow-2xl">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">{totalItemCount} Items in Cart</span>
            <span className="font-serif text-xl text-white">₹{calculateCartTotal()}</span>
          </div>
          <button
            onClick={() => setShowMobileCartModal(true)}
            className="bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg cursor-pointer"
          >
            View Cart & Checkout →
          </button>
        </div>
      )}

      {showMobileCartModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end lg:hidden">
          <div className="bg-[#12100E] border-t border-white/15 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl text-white">Your Current Cart</h3>
              <button onClick={() => setShowMobileCartModal(false)} className="text-gray-400 hover:text-white text-lg font-bold p-2">✕</button>
            </div>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-4">
              {Object.entries(cart).map(([id, qty]) => {
                const item = menu.find((m) => m.id === Number(id));
                return (
                  <div key={id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <div>
                      <span className="text-white block font-medium">{item?.name}</span>
                      <span className="text-xs text-gray-500">Qty: {qty}</span>
                    </div>
                    <span className="text-[#D4AF37] font-semibold">₹{(item?.price || 0) * Number(qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-base font-bold mb-6">
              <span className="text-gray-300">Total Amount</span>
              <span className="font-serif text-2xl text-[#D4AF37]">₹{calculateCartTotal()}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "Placing Order..." : "Place Order to Kitchen / Bar"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="bg-[#06080C] text-[#D4AF37] min-h-screen flex items-center justify-center font-serif text-xl">Loading Raahi Menu...</div>}>
      <OrderContent />
    </Suspense>
  );
}
