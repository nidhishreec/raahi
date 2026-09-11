"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const SIGNATURE_PLATES = [
  "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565895405312-ea6b835904e2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80"
];

const AMBIENCE_COL_1 = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80"
];

const AMBIENCE_COL_2 = [
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
];

// Luxury Cutlery Sunburst Emblem Component
function RaahiBrandLogo({ large = false }: { large?: boolean }) {
  return (
    <div className={`flex ${large ? "flex-col items-center gap-4" : "items-center gap-2 sm:gap-3"}`}>
      <div className={`relative flex items-center justify-center ${large ? "w-20 h-20 sm:w-24 sm:h-24" : "w-9 h-9 sm:w-11 sm:h-11"}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg" fill="url(#goldGrad)">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9F1D8" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#85530F" />
            </linearGradient>
          </defs>
          <g transform="translate(60, 60)">
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle})`}>
                <ellipse cx="0" cy="-38" rx="3.2" ry="5" />
                <rect x="-1" y="-32" width="2" height="25" rx="1" />
              </g>
            ))}
            <circle cx="0" cy="0" r="14" fill="#070e22" stroke="url(#goldGrad)" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
      <div className={`flex flex-col ${large ? "items-center text-center" : "text-left"}`}>
        <span className={`font-serif tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#E5C58A] font-normal ${large ? "text-4xl sm:text-6xl tracking-[0.45em]" : "text-xs sm:text-sm"}`}>
          RAAHI
        </span>
        <span className={`uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37]/80 font-light font-sans ${large ? "text-xs tracking-[0.35em] mt-1.5" : "text-[8px] sm:text-[9px]"}`}>
          A Tale of Food
        </span>
      </div>
    </div>
  );
}

function StatCounter({ end, decimals = 0, suffix = "" }: { end: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: end,
      duration: 2.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        setCount(obj.val);
      },
    });

    return () => {
      tween.kill();
    };
  }, [end]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function RaahiHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [tableNum, setTableNum] = useState("01");

  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const [reservationError, setReservationError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power3.inOut",
          onComplete: () => setIsLoading(false),
        });
      } else {
        setIsLoading(false);
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, scale: 0.96, y: 25 }, { opacity: 1, scale: 1, y: 0, duration: 1.4 });

    gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });

    let animationFrameId: number;
    const updatePlateCenterTilt = () => {
      if (trackRef.current) {
        const plates = trackRef.current.querySelectorAll<HTMLElement>(".plate-item");
        const screenCenter = window.innerWidth / 2;

        plates.forEach((plate) => {
          const rect = plate.getBoundingClientRect();
          const plateCenter = rect.left + rect.width / 2;
          const distance = Math.abs(screenCenter - plateCenter);

          if (distance < 220) {
            plate.style.transform = "rotate(-6deg) scale(1.08)";
            plate.style.borderColor = "#D4AF37";
            plate.style.boxShadow = "0 15px 35px rgba(212, 175, 55, 0.25)";
          } else {
            plate.style.transform = "rotate(0deg) scale(1)";
            plate.style.borderColor = "rgba(212, 175, 55, 0.25)";
            plate.style.boxShadow = "0 10px 20px rgba(0,0,0,0.4)";
          }
        });
      }
      animationFrameId = requestAnimationFrame(updatePlateCenterTilt);
    };

    animationFrameId = requestAnimationFrame(updatePlateCenterTilt);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading]);

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
    <main className="bg-[#070e22] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#17275c] via-[#091128] to-[#040713] text-[#F4F0EA] min-h-screen selection:bg-[#D4AF37] selection:text-black font-sans overflow-x-hidden relative">
      <style jsx global>{`
        html { scroll-behavior: auto; }
        body { background: #040713; margin: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* iOS Safari: force native date/time controls to respect the modal width. */
        input[type="date"].reservation-date,
        input[type="time"].reservation-time {
          display: block;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
          overflow: hidden;
          line-height: 1.25;
          color: #F4F0EA;
          background-color: #1F1C18;
        }

        input[type="date"].reservation-date::-webkit-date-and-time-value,
        input[type="time"].reservation-time::-webkit-date-and-time-value {
          min-height: 1.25em;
          text-align: left;
        }

        input[type="date"].reservation-date::-webkit-datetime-edit,
        input[type="time"].reservation-time::-webkit-datetime-edit {
          display: inline-flex;
          min-width: 0;
          padding: 0;
        }

        input[type="date"].reservation-date::-webkit-datetime-edit-fields-wrapper,
        input[type="time"].reservation-time::-webkit-datetime-edit-fields-wrapper {
          padding: 0;
          min-width: 0;
        }

        .reservation-field {
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }

        @media (max-width: 639px) {
          .reservation-modal {
            width: 100%;
            max-width: 24rem;
            max-height: calc(100dvh - 2rem);
            overflow-y: auto;
          }

          .reservation-form {
            width: 100%;
            min-width: 0;
          }
        }


        @keyframes plateSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-plate-track {
          display: flex;
          width: max-content;
          animation: plateSlide 75s linear infinite;
        }

        .animate-plate-track:hover {
          animation-play-state: paused;
        }

        .plate-item {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.6s ease, box-shadow 0.6s ease;
        }

        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: scrollUp 28s linear infinite;
        }
        .animate-scroll-down {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: scrollDown 28s linear infinite;
        }
      `}</style>

      {/* --- LUXURY PRELOADER --- */}
      {isLoading && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 z-[200] bg-[#040713] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#17275c] via-[#070e22] to-[#030408] flex flex-col items-center justify-center text-[#F4F0EA]"
        >
          <div className="flex flex-col items-center text-center px-4 animate-pulse">
            <RaahiBrandLogo large={true} />
            <div className="w-24 h-[1px] bg-[#D4AF37]/50 my-6"></div>
            <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37]/80 font-light">
              JP Nagar • Bengaluru
            </span>
          </div>
        </div>
      )}

      {/* --- FIXED STICKY TOP NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 py-3.5 sm:py-4 flex justify-between items-center backdrop-blur-md bg-[#040713]/90 border-b border-white/10 shadow-2xl">
        <div className="flex items-center z-10">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors font-medium cursor-pointer"
          >
            <span className="text-2xl leading-none">☰</span> <span className="hidden xs:inline">MENU</span>
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 cursor-pointer z-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <RaahiBrandLogo />
        </div>

        <div className="flex items-center gap-3 sm:gap-5 z-10">
          <Link
            href="/gallery"
            className="hidden md:inline-block text-xs uppercase tracking-[0.2em] text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
          >
            Gallery
          </Link>
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="hidden sm:inline-block border border-[#D4AF37]/50 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-semibold cursor-pointer"
          >
            ORDER
          </button>
          <button
            onClick={() => setIsReservationOpen(true)}
            className="bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            RESERVE
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden px-4 pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=95"
            alt="Raahi Luxury Interior Atmosphere"
            className="w-full h-full object-cover filter brightness-[0.32] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070e22] via-[#070e22]/40 to-black/80"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 mt-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/90 font-light mb-4 block">
            JP Nagar • Bengaluru
          </span>

          <h1
            ref={titleRef}
            className="font-serif font-light text-6xl sm:text-8xl md:text-9xl tracking-[0.06em] mb-6 text-[#F9F6F0] drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
          >
            Raahi
          </h1>

          <p className="text-[#D3CEC5] text-sm sm:text-base font-light tracking-wide leading-relaxed mb-10 max-w-lg mx-auto">
            Celebrating the flavors of India with dishes inspired by different regions and creating a dining experience full of variety.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="w-full sm:w-auto border border-white/20 bg-black/30 backdrop-blur-md text-white px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all font-semibold cursor-pointer"
            >
              VIEW MENU
            </button>
            <button
              onClick={() => setIsReservationOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>RESERVE A TABLE</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* --- WHAT IS RAAHI --- */}
      <section className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="reveal relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85"
              alt="Raahi Open Bar with Night Light and Great Ambience"
              className="w-full h-full object-cover filter brightness-95 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="reveal space-y-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">
              — WHAT IS RAAHI? —
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
              A word that means <span className="italic font-light text-[#D4AF37]">a tale.</span>
            </h2>
            <p className="text-[#D3CEC5] font-light leading-relaxed text-sm md:text-base">
              Food is all about its story — the origin, the spices, the texture and the taste of every dish. It is the cornerstone of daily life, of culture, of history.
            </p>
            <p className="text-[#B5B0A6] font-light leading-relaxed text-xs sm:text-sm">
              'Raahi' tells the extraordinary stories behind the foods we eat: the finest Indian cuisine, served with careful attention to every detail of food, service and ambience.
            </p>
          </div>
        </div>
      </section>

      {/* --- MASTERPIECES TRACK --- */}
      <section className="py-24 border-t border-white/10 overflow-hidden bg-black/30">
        <div className="text-center max-w-3xl mx-auto mb-16 px-6 reveal">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">— THE MASTERPIECES —</span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white mb-4">Crafted icons & signature plates.</h2>
          <p className="text-gray-400 text-sm">Dishes that automatically turn and present themselves as they glide past.</p>
        </div>

        <div className="relative w-full overflow-hidden py-12" ref={trackRef}>
          <div className="animate-plate-track flex gap-8 md:gap-14 items-center">
            {[...SIGNATURE_PLATES, ...SIGNATURE_PLATES].map((plateImg, idx) => (
              <div
                key={idx}
                className="plate-item w-60 h-60 sm:w-76 sm:h-76 shrink-0 rounded-full overflow-hidden border-4 border-[#D4AF37]/30 shadow-2xl relative bg-black cursor-pointer"
                onClick={() => setIsQrModalOpen(true)}
              >
                <img
                  src={plateImg}
                  alt={`Signature plate ${idx}`}
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/gallery"
            className="inline-block border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg"
          >
            VIEW THE FULL GALLERY →
          </Link>
        </div>
      </section>

      {/* --- MENU CATEGORIES --- */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">— THE CUISINE —</span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white mb-4">Explore the menu, course by course.</h2>
          <p className="text-gray-400 text-sm">From smoky tandoor grills to slow-simmered curries, biryani, vegetarian specials and more — each category tells its own part of the story.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 reveal">
          {[
            { title: "Grills & Tandoor", desc: "Smoky, charred, straight from clay ovens", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
            { title: "Traditional Curries", desc: "Slow-simmered & spice-forward richness", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80" },
            { title: "Biryani & Rice", desc: "Fragrant basmati, sealed & slow-cooked", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
            { title: "Vegetarian Specials", desc: "Rich, comforting, full of flavor", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" },
            { title: "Drinks & Cocktails", desc: "Crafted cocktails, mocktails & spirits", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80" }
          ].map((cat, idx) => (
            <div key={idx} onClick={() => setIsQrModalOpen(true)} className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xl">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
                <h3 className="font-serif text-lg text-white mb-1 group-hover:text-[#D4AF37] transition-colors">{cat.title}</h3>
                <p className="text-[11px] text-gray-300 font-light">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- THE ROOM --- */}
      <section className="py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal">
          <div className="relative h-[550px] overflow-hidden rounded-3xl bg-black/20 p-4 flex gap-4">
            <div className="w-1/2 overflow-hidden h-full relative">
              <div className="animate-scroll-up absolute top-0 left-0 w-full">
                {[...AMBIENCE_COL_1, ...AMBIENCE_COL_1, ...AMBIENCE_COL_1].map((imgUrl, i) => (
                  <div key={i} className="h-64 rounded-2xl overflow-hidden shadow-2xl shrink-0">
                    <img src={imgUrl} alt="Raahi Luxury Ambience" className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/2 overflow-hidden h-full relative">
              <div className="animate-scroll-down absolute top-0 left-0 w-full">
                {[...AMBIENCE_COL_2, ...AMBIENCE_COL_2, ...AMBIENCE_COL_2].map((imgUrl, i) => (
                  <div key={i} className="h-64 rounded-2xl overflow-hidden shadow-2xl shrink-0">
                    <img src={imgUrl} alt="Raahi Luxury Ambience" className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#091128] to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#091128] to-transparent pointer-events-none z-10"></div>
          </div>

          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">— THE ROOM —</span>
            <h2 className="font-serif text-4xl sm:text-6xl text-white leading-tight">Beneath the blossoms.</h2>
            <p className="text-[#D3CEC5] font-light leading-relaxed text-sm md:text-base">
              Step inside and the everyday falls away. A canopy of blossom drifts overhead; navy velvet, warm brass light and marble set the scene for the evening ahead.
            </p>
            <p className="text-[#B5B0A6] font-light leading-relaxed text-xs sm:text-sm">
              A place of gathering and celebration — designed so the story of every meal feels like an occasion.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setIsReservationOpen(true)}
                className="inline-flex items-center gap-2 border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-lg"
              >
                <span>Book Your Table</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-black/40 border-t border-white/10 text-center px-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">— THE TALE SO FAR —</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-white mb-16">A story worth telling.</h2>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <p className="font-serif text-5xl sm:text-6xl text-[#D4AF37]">
              <StatCounter end={4.8} decimals={1} /> ★
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Google Rating</p>
          </div>
          <div className="space-y-2">
            <p className="font-serif text-5xl sm:text-6xl text-[#D4AF37]">
              <StatCounter end={410} suffix="+" />
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Reviews & Counting</p>
          </div>
          <div className="space-y-2">
            <p className="font-serif text-5xl sm:text-6xl text-[#D4AF37]">
              <StatCounter end={100} suffix="+" />
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Dishes on the Menu</p>
          </div>
          <div className="space-y-2">
            <p className="font-serif text-5xl sm:text-6xl text-[#D4AF37]">∞</p>
            <p className="text-xs uppercase tracking-widest text-gray-400">Stories Told</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="location" className="bg-[#030408] border-t border-white/10 pt-20 pb-10 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <h2 className="font-serif text-3xl sm:text-5xl text-white">Join us at Raahi</h2>
          <p className="text-[#D3CEC5] text-xs sm:text-sm font-light leading-relaxed">
            Outer Ring Rd, JP Nagar, Bengaluru, Karnataka<br />
            Open Daily: 12:00 PM – 11:30 PM
          </p>
          <button
            onClick={() => setIsReservationOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-8 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            <span>Reserve a Table</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-500 font-mono gap-3">
          <span>© 2026 RAAHI BENGALURU. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/gallery" className="hover:text-[#D4AF37] transition-colors">Gallery</Link>
            <button onClick={() => setIsQrModalOpen(true)} className="hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none">Table QR Menu</button>
          </div>
        </div>
      </footer>

      {/* --- MENU DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#070e22]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
          <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <span className="font-serif text-lg tracking-[0.3em] text-white">RAAHI</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white font-semibold cursor-pointer">
              CLOSE [ ✕ ]
            </button>
          </div>

          <div className="text-center space-y-6 my-auto py-10">
            <div>
              <button onClick={() => { setIsMenuOpen(false); setIsQrModalOpen(true); }} className="font-serif italic text-3xl sm:text-5xl text-white hover:text-[#D4AF37] transition-all cursor-pointer bg-transparent border-none">
                Interactive Menu ↗
              </button>
            </div>
            <div>
              <Link href="/gallery" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-3xl sm:text-5xl text-white hover:text-[#D4AF37] transition-all inline-block">
                Full Gallery
              </Link>
            </div>
            <div>
              <button onClick={() => { setIsMenuOpen(false); setIsReservationOpen(true); }} className="font-serif italic text-3xl sm:text-5xl text-[#D4AF37] hover:text-white transition-all cursor-pointer bg-transparent border-none">
                Reserve a Table
              </button>
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
            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">Select Your Table</h2>
            <p className="text-gray-400 text-xs mb-6">Choose your table number to launch the interactive dining menu.</p>

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
            </Link>
          </div>
        </div>
      )}

      {/* --- RESERVATION MODAL --- */}
      {isReservationOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="reservation-modal w-full max-w-sm sm:max-w-md bg-[#141210] border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-8 relative shadow-2xl">
            <button onClick={() => setIsReservationOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-sm font-bold bg-white/5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>
            <h3 className="font-serif text-2xl text-white mb-2">Reserve a Table</h3>
            <p className="text-[#B5B0A6] text-xs mb-6">Experience an unforgettable evening at Raahi.</p>

            {reservationSuccess ? (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-6 text-center text-sm">
                ✓ Table reserved successfully! We'll see you soon.
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} className="reservation-form space-y-3">
                <input required name="name" type="text" placeholder="Your Full Name" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                <input required name="phone" type="tel" placeholder="Phone Number" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                
                {/* Date & Time — stacked on mobile to prevent iOS Safari overflow.
                    Visible labels are used because empty native date/time inputs
                    do not reliably show a placeholder on iPhone Safari. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
                  <div className="reservation-field">
                    <label htmlFor="reservation-date" className="block text-[10px] uppercase tracking-[0.18em] text-[#B5B0A6] mb-2">
                      Date
                    </label>
                    <input
                      id="reservation-date"
                      required
                      name="date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="reservation-date w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-base text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="reservation-field">
                    <label htmlFor="reservation-time" className="block text-[10px] uppercase tracking-[0.18em] text-[#B5B0A6] mb-2">
                      Time
                    </label>
                    <input
                      id="reservation-time"
                      required
                      name="time"
                      type="time"
                      className="reservation-time w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-base text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
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