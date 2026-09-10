"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/kds";

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode, role: "staff" }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Incorrect passcode.");
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen flex items-center justify-center font-sans p-6">
      <div className="w-full max-w-md bg-[#12100E] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-[#D4AF37] text-2xl">✦</span>
          <h1 className="font-serif text-3xl text-white mt-2">Raahi Staff Portal</h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">
            Kitchen & Bar Station Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#D4AF37] mb-2">
              Staff Passcode
            </label>
            <input
              type="password"
              placeholder="Enter staff passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#D4AF37]"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? "Checking..." : "Enter Kitchen Station"}
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

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#06080C] text-[#D4AF37] min-h-screen flex items-center justify-center font-serif text-xl">
          Loading...
        </div>
      }
    >
      <StaffLoginForm />
    </Suspense>
  );
}
