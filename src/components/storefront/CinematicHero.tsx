"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Volume2, VolumeX, Sparkles, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface HeroLook {
  id: string;
  tag: string;
  headlineMain: string;
  headlineItalic: string;
  subheadline: string;
  image: string;
  categorySlug: string;
  sareeTitle: string;
  price: number;
}

const HERO_LOOKS: HeroLook[] = [
  {
    id: "look-01",
    tag: "Vol. 2026 • Sovereign Nuptials",
    headlineMain: "THE ART OF",
    headlineItalic: "DRAPING.",
    subheadline: "Woven over 48 artisan days on Tamil Nadu heritage pit looms. Pure 3-ply mulberry silk interlocked with 24K real gold dipped zari.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=90",
    categorySlug: "kanchipuram-silk",
    sareeTitle: "Aura Crimson Sovereign Kanchipuram",
    price: 84500,
  },
  {
    id: "look-02",
    tag: "Monochromatic Splendor",
    headlineMain: "TIMELESS",
    headlineItalic: "WHISPER.",
    subheadline: "Translucent glass tissue saree threaded with micro-warp spun gold metallic fibers. Understated quiet radiance for evening cocktails.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=90",
    categorySlug: "organza-tissue",
    sareeTitle: "Ivory Pearl & Muted Gold Tissue Drape",
    price: 68900,
  },
  {
    id: "look-03",
    tag: "Midnight Gala Noir",
    headlineMain: "IMPERIAL",
    headlineItalic: "OBSIDIAN.",
    subheadline: "Deep obsidian Katan silk with raised antique gold Kadwa jaal without trailing threads on reverse. The zenith of Varanasi craftsmanship.",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=90",
    categorySlug: "banarasi-brocade",
    sareeTitle: "Varanasi Imperial Midnight Noir Kadwa",
    price: 92000,
  },
];

export function CinematicHero() {
  const [currentLookIndex, setCurrentLookIndex] = useState(0);
  const [isAtmosphereOn, setIsAtmosphereOn] = useState(false);

  // Auto-advance looks every 8 seconds unless user interacts
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLookIndex((prev) => (prev + 1) % HERO_LOOKS.length);
    }, 8500);
    return () => clearInterval(timer);
  }, []);

  const currentLook = HERO_LOOKS[currentLookIndex];

  return (
    <section className="relative min-h-[96vh] sm:min-h-screen flex flex-col justify-between pt-32 pb-10 px-4 sm:px-6 lg:px-8 bg-charcoal-950 text-ivory-100 overflow-hidden font-sans select-none">
      {/* Background Animated Layer with Framer Motion AnimatePresence */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLook.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.58, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentLook.image}
              alt={currentLook.headlineMain}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-charcoal-950/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-charcoal-950/80 pointer-events-none" />
      </div>

      {/* Top Metadata & Atmosphere Controller */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs tracking-luxury uppercase text-gold-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping inline-block" />
          <span>AUTUMN / WINTER SALON 2026</span>
        </div>

        {/* Ambient Atmosphere Soundwave Indicator */}
        <button
          onClick={() => setIsAtmosphereOn(!isAtmosphereOn)}
          className="flex items-center gap-2 px-3 py-1 bg-charcoal-900/60 backdrop-blur-sm border border-gold-400/30 text-ivory-300 hover:text-gold-300 transition-colors"
          title="Toggle Atelier Atmosphere"
        >
          {isAtmosphereOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-gold-400" />
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-gold-400 animate-[pulse_0.6s_infinite] h-2" />
                <span className="w-0.5 bg-gold-400 animate-[pulse_0.9s_infinite] h-3" />
                <span className="w-0.5 bg-gold-400 animate-[pulse_0.4s_infinite] h-1.5" />
              </div>
              <span className="hidden sm:inline text-[9px]">Loom Acoustic Ambient</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-charcoal-400" />
              <span className="hidden sm:inline text-[9px]">Sound Atmosphere</span>
            </>
          )}
        </button>
      </div>

      {/* Center Cinematic Editorial Headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLook.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block py-1 px-3 border border-gold-400/50 bg-charcoal-900/70 backdrop-blur-xs text-[10px] sm:text-xs tracking-luxury uppercase text-gold-300 mb-6">
                {currentLook.tag}
              </span>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.04] font-light text-ivory-50">
                {currentLook.headlineMain} <br />
                <span className="italic font-normal text-gold-300">
                  {currentLook.headlineItalic}
                </span>
              </h1>

              <p className="mt-6 text-xs sm:text-sm md:text-base text-ivory-300 font-sans max-w-xl leading-relaxed font-light">
                {currentLook.subheadline}
              </p>

              {/* Action Buttons & Look Preview Pill */}
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href={`/shop?category=${currentLook.categorySlug}`}
                  className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-charcoal-950 text-xs tracking-luxury uppercase transition-all duration-300 font-medium shadow-xl flex items-center gap-2 group"
                >
                  <span>Explore Look ({formatPrice(currentLook.price)})</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/shop"
                  className="px-8 py-4 bg-transparent hover:bg-ivory-100/10 text-ivory-100 border border-ivory-100/30 text-xs tracking-luxury uppercase transition-all duration-300 backdrop-blur-xs"
                >
                  All 32 Handlooms
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Switcher: 3 Looks Navigation & Scroll Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-6 border-t border-ivory-100/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Interactive Look Selectors */}
        <div className="flex items-center gap-4">
          {HERO_LOOKS.map((look, index) => {
            const isActive = currentLookIndex === index;
            return (
              <button
                key={look.id}
                onClick={() => setCurrentLookIndex(index)}
                className={`flex items-center gap-2 text-left group transition-all pb-1 border-b-2 ${
                  isActive ? "border-gold-400 text-gold-300" : "border-transparent text-charcoal-400 hover:text-ivory-300"
                }`}
              >
                <span className="font-serif text-sm font-semibold">0{index + 1}</span>
                <span className="text-[10px] tracking-widest uppercase font-sans hidden md:inline">
                  {look.headlineItalic.replace(".", "")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll Prompt */}
        <div className="flex items-center gap-2 text-[10px] tracking-luxury uppercase text-gold-400 shrink-0">
          <span>Scroll To Runway</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

