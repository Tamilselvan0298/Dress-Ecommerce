"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ShoppingBag, ArrowRight, Eye, Sparkles, X, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cartContext";
import { useToast } from "@/lib/store/toastContext";

interface ReelStory {
  id: string;
  title: string;
  lookNumber: string;
  sareeTitle: string;
  price: number;
  fabric: string;
  image: string;
  categorySlug: string;
  productSlug: string;
  hotspots: Array<{
    id: string;
    top: string;
    left: string;
    label: string;
    detail: string;
  }>;
}

const REEL_STORIES: ReelStory[] = [
  {
    id: "reel-01",
    lookNumber: "CAMPAIGN LOOK 01",
    title: "The Sovereign Muhurtham",
    sareeTitle: "Aura Crimson Sovereign Kanchipuram",
    price: 84500,
    fabric: "Pure Heavy 3-Ply Mulberry Silk",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=956&q=85",
    categorySlug: "kanchipuram-silk",
    productSlug: "aura-crimson-sovereign-kanchipuram",
    hotspots: [
      {
        id: "h1",
        top: "34%",
        left: "58%",
        label: "Korvai Interlock Pallu",
        detail: "Three shuttles interlock body silk with emerald contrast without trailing threads.",
      },
      {
        id: "h2",
        top: "62%",
        left: "42%",
        label: "24K Dipped Mayil Zari",
        detail: "Real silver electroplated in 24K gold baths depicting eternal temple swans.",
      },
    ],
  },
  {
    id: "reel-02",
    lookNumber: "CAMPAIGN LOOK 02",
    title: "Gossamer Champagne Tissue",
    sareeTitle: "Ivory Pearl & Muted Gold Tissue Drape",
    price: 68900,
    fabric: "Fine Mulberry Silk Glass Tissue",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=956&q=85",
    categorySlug: "organza-tissue",
    productSlug: "ivory-pearl-muted-gold-tissue-drape",
    hotspots: [
      {
        id: "h3",
        top: "40%",
        left: "50%",
        label: "Glass Weft Sheen",
        detail: "Catches ambient candle and twilight luminosity with understated radiance.",
      },
      {
        id: "h4",
        top: "78%",
        left: "52%",
        label: "Scalloped Antique Edge",
        detail: "Hand-cut scallop champagne border with micro seed-pearl detailing.",
      },
    ],
  },
  {
    id: "reel-03",
    lookNumber: "CAMPAIGN LOOK 03",
    title: "Obsidian Kadwa Brocade",
    sareeTitle: "Varanasi Imperial Midnight Noir Kadwa",
    price: 92000,
    fabric: "Pure Handspun Katan Silk",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=956&q=85",
    categorySlug: "banarasi-brocade",
    productSlug: "varanasi-imperial-midnight-noir-kadwa",
    hotspots: [
      {
        id: "h5",
        top: "28%",
        left: "48%",
        label: "Authentic Kadwa Weave",
        detail: "Every gold motif engraved individually into body silk without loose floats.",
      },
      {
        id: "h6",
        top: "70%",
        left: "60%",
        label: "Antique Matte Zari",
        detail: "Deep burnished copper-gold metallic tones for evening galas.",
      },
    ],
  },
];

export function CinematicReelsSection() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [selectedHotspot, setSelectedHotspot] = useState<{
    label: string;
    detail: string;
  } | null>(null);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const currentStory = REEL_STORIES[activeStoryIndex];

  // 39-second timer loop recreating the reference video runtime
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 100; // ms
    const totalDuration = 39000; // 39s
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Switch to next reel
          setActiveStoryIndex((idx) => (idx + 1) % REEL_STORIES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleQuickAdd = () => {
    addItem({
      productId: currentStory.id,
      title: currentStory.sareeTitle,
      price: currentStory.price,
      image: currentStory.image,
      fabric: currentStory.fabric,
      quantity: 1,
    });
    showToast({
      type: "cart",
      title: "Added to Atelier Bag",
      message: `${currentStory.sareeTitle} (${formatPrice(currentStory.price)})`,
      image: currentStory.image,
    });
  };

  return (
    <section className="py-24 bg-charcoal-950 text-ivory-100 overflow-hidden font-sans border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              <span className="text-[10px] tracking-luxury uppercase text-gold-400 font-semibold font-sans">
                Interactive Runway Reel • 39s Campaign Experience
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-ivory-50 leading-tight">
              The Vertical Runway
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-400 mt-2 max-w-lg font-light">
              Tap the interactive gold pins on the model&apos;s drape to inspect the generational weave architecture and shop directly off-runway.
            </p>
          </div>

          {/* Reel Story Switchers */}
          <div className="mt-6 md:mt-0 flex items-center gap-2">
            {REEL_STORIES.map((story, i) => (
              <button
                key={story.id}
                onClick={() => {
                  setActiveStoryIndex(i);
                  setProgress(0);
                }}
                className={`px-3 py-1.5 text-xs uppercase tracking-luxury border transition-all ${
                  activeStoryIndex === i
                    ? "bg-gold-500 text-charcoal-950 border-gold-400 font-semibold"
                    : "bg-charcoal-900 text-charcoal-400 border-charcoal-800 hover:text-ivory-200"
                }`}
              >
                Look 0{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 478x850 Vertical Cinematic Video Frame Display */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[430px] aspect-[478/850] bg-charcoal-900 border border-gold-500/30 shadow-2xl overflow-hidden select-none">
            {/* Background Editorial Visual with Subtle Motion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: isPlaying ? 1.02 : 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentStory.image}
                  alt={currentStory.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 430px"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-charcoal-950/60 pointer-events-none" />

            {/* Top 39-second Progress Bar (Exact reference video timeline) */}
            <div className="absolute top-0 left-0 right-0 p-3 z-20 flex flex-col gap-1.5 bg-gradient-to-b from-charcoal-950/80 to-transparent">
              <div className="w-full bg-charcoal-800/80 h-1 overflow-hidden rounded-full">
                <motion.div
                  className="bg-gold-400 h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase tracking-luxury text-gold-300">
                <span>{currentStory.lookNumber}</span>
                <span>00:{Math.floor((progress / 100) * 39).toString().padStart(2, "0")} / 00:39</span>
              </div>
            </div>

            {/* Play/Pause Center Overlay on Tap */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause Campaign Reel" : "Play Campaign Reel"}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-charcoal-900/60 backdrop-blur-sm text-ivory-100 border border-charcoal-700 hover:bg-gold-500 hover:text-charcoal-900 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Interactive Hotspot Pins on Model's Saree */}
            {currentStory.hotspots.map((spot) => (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  onClick={() =>
                    setSelectedHotspot(
                      selectedHotspot?.label === spot.label ? null : spot
                    )
                  }
                  aria-label={`Inspect ${spot.label}`}
                  className="group relative flex items-center justify-center"
                >
                  {/* Pulsing Aura */}
                  <span className="absolute w-8 h-8 rounded-full bg-gold-400/40 animate-ping" />
                  {/* Center Dot */}
                  <span className="relative w-5 h-5 rounded-full bg-gold-500 text-charcoal-950 font-bold text-[10px] flex items-center justify-center shadow-lg border border-ivory-100 group-hover:scale-125 transition-transform">
                    +
                  </span>
                </button>
              </div>
            ))}

            {/* Floating Hotspot Detail Card */}
            <AnimatePresence>
              {selectedHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-28 left-4 right-4 z-30 p-4 bg-charcoal-900/95 backdrop-blur-md border border-gold-400/60 shadow-2xl text-ivory-100"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-luxury text-gold-400 font-semibold block">
                        Artisan Architecture
                      </span>
                      <h4 className="font-serif text-sm text-ivory-100 font-bold mt-0.5">
                        {selectedHotspot.label}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedHotspot(null)}
                      className="text-charcoal-400 hover:text-ivory-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-charcoal-300 font-light mt-1.5 leading-relaxed">
                    {selectedHotspot.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Quick-Shop Dock on Runway */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-charcoal-950 via-charcoal-950/90 to-transparent flex flex-col gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-gold-400 block mb-0.5">
                  {currentStory.fabric}
                </span>
                <h3 className="font-serif text-lg text-ivory-50 line-clamp-1 leading-snug">
                  {currentStory.sareeTitle}
                </h3>
                <span className="font-serif text-base text-gold-300 font-medium block mt-0.5">
                  {formatPrice(currentStory.price)}
                </span>
              </div>

              {/* Instant Runway Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickAdd}
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-charcoal-950 text-xs font-semibold uppercase tracking-luxury flex items-center justify-center gap-1.5 transition-colors shadow-lg active:scale-98"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Claim from Runway</span>
                </button>

                <Link
                  href={`/product/${currentStory.productSlug}`}
                  className="p-3 bg-charcoal-900 border border-charcoal-700 text-ivory-100 hover:border-gold-500 transition-colors"
                  title="View Piece Details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

