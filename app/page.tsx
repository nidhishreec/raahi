"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function RaahiQissaHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [tableNum, setTableNum] = useState("01");

  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const [reservationError, setReservationError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1.4 });

    gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Reservation form now actually persists to Supabase via an API
  // route (see /api/reservations), instead of just showing an alert().
  const handleReservationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReservationError("");
    setReservationSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        phone: data.get("phone"),
        date: data.get("date"),
        time: data.get("time"),
      }),
    });

    setReservationSubmitting(false);

    if (!res.ok) {
      const body = await res.json();
      setReservationError(body.error || "Failed to reserve. Please try again.");
      return;
    }

    form.reset();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setIsReservationOpen(false);
    }, 2000);
  };

  return (
    <main className="bg-[#080706] text-[#F4F0EA] min-h-screen selection:bg-[#D4AF37] selection:text-black font-sans overflow-x-hidden">

      <style jsx global>{`
        html { scroll-behavior: auto; }
        body { background: #080706; margin: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes autoSlide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-auto-slide { display: flex; width: max-content; animation: autoSlide 25s linear infinite; }
        .animate-auto-slide:hover { animation-play-state: paused; }
      `}</style>

      {/* --- RESPONSIVE TOP NAV --- */}
      <nav className="absolute top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-12 py-5 flex justify-between items-center backdrop-blur-sm bg-black/30 border-b border-white/5">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors font-medium cursor-pointer p-2"
        >
          <span className="text-base">☰</span> MENU
        </button>

        <div></div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/*
            Staff KDS now links to the real, passcode-protected /kds
            route instead of opening an unauthenticated modal on this
            page. No more bypass -- middleware redirects to
            /staff-login if there's no valid session.
          */}
          <Link
            href="/kds"
            className="border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3.5 sm:px-4 py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-semibold cursor-pointer"
          >
            👨‍🍳 Staff KDS
          </Link>
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-[#D4AF37]/40 px-3.5 sm:px-5 py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-semibold cursor-pointer"
          >
            <span>TABLE QR</span>
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
          <button
            onClick={() => setIsReservationOpen(true)}
            className="bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-4 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            RESERVE
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=95"
            alt="Raahi Luxury Interior Atmosphere"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/60 to-black/70"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl px-4 mt-12">
          <div className="flex flex-col items-center mb-3">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-black/40 backdrop-blur-md mb-2 shadow-xl">
              <span className="text-[#D4AF37] text-xs animate-pulse">✦</span>
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">
              JP Nagar • Bengaluru
            </span>
          </div>

          <h1 ref={titleRef} className="font-serif text-6xl sm:text-8xl md:text-9xl tracking-tight text-white mb-4 drop-shadow-2xl">
            Raahi
          </h1>

          <p className="text-[#D3CEC5] text-xs sm:text-sm md:text-base font-light tracking-wide leading-relaxed mb-8 max-w-md sm:max-w-lg mx-auto">
            Artisanal dining meets a vibrant craft cocktail pub. Celebrating diverse culinary traditions, course by course.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-7 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl hover:opacity-90 transition-all cursor-pointer"
            >
              <span>Open Table QR Menu</span>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>
            <Link
              href="/admin"
              className="w-full sm:w-auto border border-white/20 bg-black/30 backdrop-blur-md text-white px-7 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all font-semibold text-center"
            >
              Manager Portal 🔒
            </Link>
          </div>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="reveal relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[350px] sm:h-[450px]">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
              alt="Raahi luxurious booth seating and atmosphere"
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="reveal space-y-5">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">— THE STORY —</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-white leading-tight">
              A word that means <span className="italic font-light text-[#D4AF37]">a tale.</span>
            </h2>
            <p className="text-[#D3CEC5] font-light leading-relaxed text-xs sm:text-sm md:text-base">
              Food is all about its story — the origin, the spices, the texture and the taste of every dish. It is the cornerstone of daily life, of culture, of history.
            </p>
            <p className="text-[#B5B0A6] font-light leading-relaxed text-xs sm:text-sm">
              'Raahi' tells the extraordinary stories behind the foods we eat: the finest artisanal cuisine and legendary pub drinks, served with careful attention to every detail of ambience and service.
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="font-serif text-base sm:text-lg text-white italic mb-2">
                "Raahi is a place of gathering, of celebrations, of business, and of pleasure. Let the story begin..."
              </p>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono">— THE RAAHI PROMISE</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOCATION & FOOTER --- */}
      <footer id="location" className="bg-[#050403] border-t border-white/10 pt-20 pb-10 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-black/40 backdrop-blur-md mx-auto shadow-xl">
            <span className="text-[#D4AF37] text-xs animate-pulse">✦</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-white">Join us at Raahi</h2>
          <p className="text-[#D3CEC5] text-xs sm:text-sm font-light leading-relaxed">
            Outer Ring Rd, JP Nagar, Bengaluru, Karnataka<br />
            Open Daily: 12:00 PM – 11:30 PM
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsReservationOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-7 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              <span>Reserve a Table</span>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-500 font-mono gap-3">
          <span>© 2026 RAAHI BENGALURU. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/kds" className="hover:text-[#D4AF37] transition-colors">Staff KDS</Link>
            <button onClick={() => setIsQrModalOpen(true)} className="hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none">Table QR Menu</button>
            <Link href="/admin" className="hover:text-[#D4AF37] transition-colors">Owner Portal 🔒</Link>
          </div>
        </div>
      </footer>

      {/* --- FULL SCREEN MENU DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#080706]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
          <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37]">✦</span>
              <span className="font-serif text-lg tracking-[0.3em] text-white">RAAHI</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white font-semibold cursor-pointer">
              CLOSE [ ✕ ]
            </button>
          </div>

          <div className="text-center space-y-6 my-auto py-10">
            <div>
              <Link href="/kds" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-2xl sm:text-4xl text-[#D4AF37] hover:text-white transition-all duration-300 inline-block">
                Staff KDS Station 👨‍🍳
              </Link>
            </div>
            <div>
              <button onClick={() => { setIsMenuOpen(false); setIsQrModalOpen(true); }} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 cursor-pointer bg-transparent border-none">
                Table QR Menu ↗
              </button>
            </div>
            <div>
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 inline-block">
                Owner Executive Portal 🔒
              </Link>
            </div>
            <div>
              <a href="#location" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 inline-block">
                Location & Hours
              </a>
            </div>
          </div>

          <div className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono">
            JP Nagar, Bengaluru
          </div>
        </div>
      )}

      {/* --- TABLE QR MODAL --- */}
      {isQrModalOpen && (
        <div onClick={() => setIsQrModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-[#12100E] border border-white/15 rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center">
            <button onClick={() => setIsQrModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-sm font-bold bg-white/5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-1 font-semibold">Table QR Simulation</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">Select Your Table</h2>
            <p className="text-gray-400 text-xs mb-6">Choose your table number to launch the interactive dining and bar menu.</p>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"].map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => setTableNum(tbl)}
                  className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    tableNum === tbl ? "bg-[#D4AF37] text-black shadow-lg scale-105" : "bg-[#1F1C18] border border-white/10 text-gray-300 hover:border-[#D4AF37]"
                  }`}
                >
                  #{tbl}
                </button>
              ))}
            </div>

            <Link
              href={`/order?table=${tableNum}`}
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg text-center"
            >
              <span>Launch Table #{tableNum} Menu</span>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* --- RESERVATION MODAL --- */}
      {isReservationOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm sm:max-w-md bg-[#141210] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 relative shadow-2xl">
            <button onClick={() => setIsReservationOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-xs cursor-pointer">✕</button>
            <h3 className="font-serif text-2xl text-white mb-2">Reserve a Table</h3>
            <p className="text-[#B5B0A6] text-xs mb-6">Experience an unforgettable evening at Raahi.</p>

            {reservationSuccess ? (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-6 text-center text-sm">
                ✓ Table reserved successfully! We'll see you soon.
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} className="space-y-3.5">
                <input required name="name" type="text" placeholder="Your Full Name" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                <input required name="phone" type="tel" placeholder="Phone Number" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                <div className="grid grid-cols-2 gap-3">
                  <input required name="date" type="date" min={new Date().toISOString().split("T")[0]} className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                  <input required name="time" type="time" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                </div>
                {reservationError && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">{reservationError}</p>
                )}
                <button
                  type="submit"
                  disabled={reservationSubmitting}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all mt-3 cursor-pointer disabled:opacity-50"
                >
                  {reservationSubmitting ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
