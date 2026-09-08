"use client";

import React from "react";
import Link from "next/link";

export default function RaahiGalleryPage() {
  return (
    <main className="bg-[#080706] text-[#F4F0EA] min-h-screen selection:bg-[#D4AF37] selection:text-black font-sans p-6 md:p-16">
      
      {/* Top Bar with Back Link */}
      <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-6">
        <Link href="/" className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors">
          ← Back to Home
        </Link>
        <span className="font-serif tracking-[0.3em] text-white">RAAHI GALLERY</span>
        <div></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">
            — A VISUAL JOURNEY —
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
            Full Gallery
          </h1>
          <p className="text-[#D3CEC5] text-sm md:text-base font-light leading-relaxed">
            Savour the flavours — a journey through the room, the plates and the evenings at Raahi.
          </p>
        </div>

        {/* Full Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=85",
            "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=85"
          ].map((imgSrc, idx) => (
            <div key={idx} className="h-80 rounded-2xl overflow-hidden border border-white/10 group relative shadow-xl">
              <img 
                src={imgSrc} 
                alt="Raahi full gallery showcase" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}