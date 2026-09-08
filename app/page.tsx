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
  const [activeHoverIndex, setActiveHoverIndex] = useState<number>(0);

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
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main className="bg-[#080706] text-[#F4F0EA] min-h-screen selection:bg-[#D4AF37] selection:text-black font-sans overflow-x-hidden">
      
      <style jsx global>{`
        html { scroll-behavior: auto; }
        body { background: #080706; margin: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes autoSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-auto-slide {
          display: flex;
          width: max-content;
          animation: autoSlide 25s linear infinite;
        }
        .animate-auto-slide:hover {
          animation-play-state: paused;
        }
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
          <button 
            onClick={() => setIsQrModalOpen(true)}
            className="border border-[#D4AF37]/40 px-3.5 sm:px-5 py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-semibold cursor-pointer"
          >
            TABLE QR ↗
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
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-7 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl hover:opacity-90 transition-all cursor-pointer"
            >
              Open Table QR Menu ↗
            </button>
            <Link 
              href="/admin"
              className="w-full sm:w-auto border border-white/20 bg-black/30 backdrop-blur-md text-white px-7 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all font-semibold text-center"
            >
              Manager Portal
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
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">
              — THE STORY —
            </span>
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
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono">
                — THE RAAHI PROMISE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- HIGHLIGHTS GRID --- */}
      <section className="py-16 md:py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center mb-12 reveal">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2">— THE CULINARY & BAR PROGRAM —</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white">Crafted for Connoisseurs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          <div className="bg-[#12100E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all">
            <div>
              <span className="text-[#D4AF37] text-2xl block mb-3">🍸</span>
              <h3 className="font-serif text-xl text-white mb-2">Artisanal Bar & LIITs</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Signature cocktails, craft gin infusions, chilled shooters, and legendary LIITs.</p>
            </div>
            <button onClick={() => setIsQrModalOpen(true)} className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold text-left hover:underline cursor-pointer">
              Explore Drinks →
            </button>
          </div>

          <div className="bg-[#12100E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all">
            <div>
              <span className="text-[#D4AF37] text-2xl block mb-3">🔥</span>
              <h3 className="font-serif text-xl text-white mb-2">Tandoor & Grills</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Charcoal-smoked tikkas, succulent kebabs, and whole roasted coastal catches.</p>
            </div>
            <button onClick={() => setIsQrModalOpen(true)} className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold text-left hover:underline cursor-pointer">
              Explore Grills →
            </button>
          </div>

          <div className="bg-[#12100E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all">
            <div>
              <span className="text-[#D4AF37] text-2xl block mb-3">🦐</span>
              <h3 className="font-serif text-xl text-white mb-2">Coastal Specials</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Mangalorean ghee roasts, neer dosas, and aromatic country chicken donne biryani.</p>
            </div>
            <button onClick={() => setIsQrModalOpen(true)} className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold text-left hover:underline cursor-pointer">
              Explore Specials →
            </button>
          </div>

          <div className="bg-[#12100E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all">
            <div>
              <span className="text-[#D4AF37] text-2xl block mb-3">🍕</span>
              <h3 className="font-serif text-xl text-white mb-2">Pizzas & Pastas</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Hand-tossed wood-fired pizzas, rich alfredo pastas, and continental comfort classics.</p>
            </div>
            <button onClick={() => setIsQrModalOpen(true)} className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold text-left hover:underline cursor-pointer">
              Explore Mains →
            </button>
          </div>
        </div>
      </section>

      {/* --- MASTERPIECES SLIDER --- */}
      <section className="py-20 bg-[#080706] border-t border-white/10 overflow-hidden">
        <div className="text-center mb-10 px-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">— THE MASTERPIECES —</span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight mb-6">Crafted icons & signature plates.</h2>
          <Link 
            href="/gallery"
            className="inline-flex items-center gap-2 border border-[#D4AF37]/50 text-[#D4AF37] px-7 py-3 rounded-full text-xs uppercase tracking-[0.3em] font-semibold hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg"
          >
            <span>VIEW FULL GALLERY ↓</span>
          </Link>
        </div>

        <div className="w-full overflow-hidden relative">
          <div className="animate-auto-slide flex gap-6 sm:gap-8 py-4">
            {[
              { name: "Truffle & Wild Mushroom Tartine", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=85", desc: "Whipped truffle ricotta" },
              { name: "Signature Artisanal Curry Bowl", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=85", desc: "Slow-cooked spices" },
              { name: "Botanical Saffron Infusion", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=85", desc: "Hand-crafted spirits" },
              { name: "Cardamom Orange Brioche", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=85", desc: "Freshly baked house special" },
              { name: "Truffle & Wild Mushroom Tartine", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=85", desc: "Whipped truffle ricotta" },
              { name: "Signature Artisanal Curry Bowl", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=85", desc: "Slow-cooked spices" },
              { name: "Botanical Saffron Infusion", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=85", desc: "Hand-crafted spirits" },
              { name: "Cardamom Orange Brioche", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=85", desc: "Freshly baked house special" }
            ].map((plate, idx) => (
              <div key={idx} className="w-[260px] sm:w-[320px] flex-shrink-0 flex flex-col items-center text-center group">
                <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative bg-black mb-5">
                  <img src={plate.img} alt={plate.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-white mb-1 px-2">{plate.name}</h3>
                <p className="text-[#D3CEC5] text-xs font-light">{plate.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOCUS CAROUSEL SECTION --- */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10 overflow-hidden">
        <div className="text-center mb-12 reveal">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-2">— THE CUISINE & BAR —</span>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white">Explore the menu, <span className="italic font-light text-[#D4AF37]">course by course.</span></h2>
        </div>

        <div className="relative max-w-5xl mx-auto px-8 sm:px-16">
          <button 
            onClick={() => {
              const container = document.getElementById("focus-carousel");
              if (container) container.scrollBy({ left: -280, behavior: "smooth" });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/90 border border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all shadow-2xl backdrop-blur-md cursor-pointer"
          >
            ←
          </button>

          <div id="focus-carousel" className="flex items-center gap-4 h-[420px] sm:h-[460px] w-full overflow-x-auto py-4 px-2 scrollbar-none scroll-smooth">
            {[
              { title: "Grills & Tandoor", subtitle: "Smoky, charred, straight from the clay oven.", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=85" },
              { title: "Traditional Curries", subtitle: "Slow-simmered & spice-forward, choose your protein.", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85" },
              { title: "Biryani & Rice", subtitle: "Fragrant basmati, sealed & slow-cooked.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=85" },
              { title: "Bar Bites & Starters", subtitle: "Small plates & bar snacks to begin the tale.", img: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=85" },
              { title: "Craft Cocktails & LIITs", subtitle: "Botanical spirits, sangrias & signature drinks.", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85" },
              { title: "Wines & Spirits", subtitle: "Whiskeys, single malts, wine & cellared spirits.", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85" }
            ].map((cat, idx) => {
              const isHovered = activeHoverIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setIsQrModalOpen(true)}
                  onMouseEnter={() => setActiveHoverIndex(idx)}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-700 ease-out flex-shrink-0 cursor-pointer group flex flex-col justify-end p-6 sm:p-8 border border-white/10 shadow-2xl text-left ${
                    isHovered ? "w-[300px] sm:w-[420px] md:w-[480px] h-full" : "w-[130px] sm:w-[170px] h-[380px]"
                  }`}
                  style={{ background: "#12100E" }}
                >
                  <div className="absolute inset-0 z-0">
                    <img src={cat.img} alt={cat.title} className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? "filter brightness-95 scale-100" : "filter brightness-[0.55] scale-105"}`} />
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${isHovered ? "from-black/90 via-black/40 to-transparent" : "from-black/95 via-black/70 to-black/40"}`}></div>
                  </div>

                  <div className="relative z-10 transition-all duration-500">
                    {isHovered ? (
                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-2 leading-tight">{cat.title}</h3>
                        <p className="text-[#D3CEC5] text-xs font-light leading-relaxed max-w-sm">{cat.subtitle}</p>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <h3 className="font-serif text-xs sm:text-sm md:text-lg text-gray-200 tracking-wider whitespace-nowrap transform -rotate-90 origin-center py-16 drop-shadow-md">
                          {cat.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => {
              const container = document.getElementById("focus-carousel");
              if (container) container.scrollBy({ left: 280, behavior: "smooth" });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/90 border border-[#D4AF37]/60 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all shadow-2xl backdrop-blur-md cursor-pointer"
          >
            →
          </button>
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
              className="bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-7 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              Reserve a Table ↗
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-500 font-mono gap-3">
          <span>© 2026 RAAHI BENGALURU. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4 sm:gap-6">
            <button onClick={() => setIsQrModalOpen(true)} className="hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none">Table QR Menu</button>
            <a href="/gallery" className="hover:text-[#D4AF37] transition-colors">Gallery</a>
            <a href="/admin" className="hover:text-[#D4AF37] transition-colors">Manager Portal</a>
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
              <button onClick={() => { setIsMenuOpen(false); setIsQrModalOpen(true); }} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 cursor-pointer bg-transparent border-none">
                Table QR Menu <span className="text-[#D4AF37] text-lg">↗</span>
              </button>
            </div>
            <div>
              <a href="/gallery" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 inline-block">
                Full Gallery
              </a>
            </div>
            <div>
              <a href="/admin" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 inline-block">
                Manager Operations Control
              </a>
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
              className="block w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg text-center"
            >
              Launch Table #{tableNum} Menu ↗
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
            <form onSubmit={(e) => { e.preventDefault(); alert("Table reserved successfully!"); setIsReservationOpen(false); }} className="space-y-3.5">
              <input required type="text" placeholder="Your Full Name" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
              <input required type="tel" placeholder="Phone Number" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                <input required type="time" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all mt-3 cursor-pointer">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}