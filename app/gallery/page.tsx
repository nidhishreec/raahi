"use client";

import React from "react";
import Link from "next/link";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85", // 1
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85", // 2
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=85", // 3
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85", // 4
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=85", // 5
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=85", // 6
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=85", // 7
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=85", // 8
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85", // 9
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=85", // 10
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=85", // 11
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=85", // 12
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=85", // 13
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=85", // 14 (Fixed!)
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85", // 15
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=85", // 16
  "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=800&q=85", // 17
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85", // 18
  "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=85", // 19
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85", // 21
  "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=800&q=85"  // 22
];

export default function RaahiGalleryPage() {
  return (
    <main className="bg-[#070e22] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#17275c] via-[#091128] to-[#040713] text-[#F4F0EA] min-h-screen selection:bg-[#D4AF37] selection:text-black font-sans p-6 md:p-16">
      
      {/* Top Bar with Perfectly Centered Golden Title */}
      <div className="grid grid-cols-3 items-center mb-16 border-b border-white/10 pb-6 max-w-7xl mx-auto">
        <div>
          <Link href="/" className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
        <div className="text-center">
          <span className="font-serif tracking-[0.3em] text-[#D4AF37] text-sm md:text-base font-semibold uppercase">
            Raahi Gallery
          </span>
        </div>
        <div></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[20px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">
            — A VISUAL JOURNEY —
          </span>
          
          <p className="text-[#D3CEC5] text-sm md:text-base font-light leading-relaxed">
            Savour the flavours — a complete journey through our crafted plates, artisan cocktails, and evenings at Raahi.
          </p>
        </div>

        {/* Full Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((imgSrc, idx) => (
            <div key={idx} className="h-80 rounded-2xl overflow-hidden border border-white/10 group relative shadow-xl bg-black">
              <img 
                src={imgSrc} 
                alt="Raahi full gallery showcase" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}