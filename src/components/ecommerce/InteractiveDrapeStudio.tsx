"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sliders, Check, Eye, ShieldCheck, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DrapeStyle {
  id: string;
  name: string;
  provenance: string;
  description: string;
  pleatCount: number;
  palluLength: string;
  image: string;
  accentColor: string;
}

const DRAPE_STYLES: DrapeStyle[] = [
  {
    id: "nivi",
    name: "Classical Nivi Drape",
    provenance: "Andhra Deccan & Modern Standard",
    description: "7 to 9 hand-folded waist pleats anchored at the navel with a sweeping 2.2-meter pallu draped gracefully over the left shoulder.",
    pleatCount: 8,
    palluLength: "Floor-Grazing (2.2m)",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#C5A880",
  },
  {
    id: "seedha",
    name: "Seedha Pallu Royal Front",
    provenance: "Gujarat & Rajasthan Court Tradition",
    description: "The pallu is brought from the back over the right shoulder to splay the 12-inch pure gold zari Korvai border across the chest.",
    pleatCount: 7,
    palluLength: "Chest Spanned (1.8m)",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#DFC28D",
  },
  {
    id: "atpoure",
    name: "Bengali Atpoure Heritage",
    provenance: "Traditional Bengal Zamindari",
    description: "Box pleating along front with the ornate pallu thrown over the left shoulder, then tucked over the right shoulder with an ornamental key.",
    pleatCount: 6,
    palluLength: "Double-Wrap Shoulder (2.5m)",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#E8D7BE",
  },
  {
    id: "contemporary",
    name: "Sculptural Gala Dhoti Drape",
    provenance: "Contemporary Haute Couture",
    description: "Weightless pre-pleated bifurcation paired with a cascade pallu, designed for seamless movement at modern nuptial receptions.",
    pleatCount: 10,
    palluLength: "Cape Cascade (2.0m)",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=85",
    accentColor: "#D4AF37",
  },
];

export function InteractiveDrapeStudio() {
  const [activeDrape, setActiveDrape] = useState<DrapeStyle>(DRAPE_STYLES[0]);
  const [pleatTension, setPleatTension] = useState(7); // 5 to 10 pleats
  const [ambientLight, setAmbientLight] = useState<"salon" | "sunset" | "chandelier">("salon");

  return (
    <div className="bg-charcoal-900 text-ivory-100 p-6 sm:p-10 border border-charcoal-800 shadow-2xl font-sans select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: Motion Silhouette Canvas */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full bg-charcoal-950 overflow-hidden border border-gold-500/30 shadow-2xl">
            {/* Interactive Image with Framer Motion AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDrape.id}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={activeDrape.image}
                  alt={activeDrape.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Ambient Lighting Atmosphere Filter */}
            <div
              className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${
                ambientLight === "sunset"
                  ? "bg-amber-900/25 mix-blend-color-burn"
                  : ambientLight === "chandelier"
                  ? "bg-yellow-950/20 mix-blend-overlay"
                  : "bg-transparent"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-charcoal-950/40 pointer-events-none" />

            {/* Top Indicator */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-charcoal-950/80 backdrop-blur-xs border border-charcoal-700 text-[10px] uppercase tracking-luxury text-gold-300">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Interactive Silhouette Studio</span>
            </div>

            {/* Bottom Status Pill */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 p-3 bg-charcoal-950/85 backdrop-blur-md border border-charcoal-700 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-gold-400 block font-semibold">
                  {activeDrape.provenance}
                </span>
                <span className="font-serif text-sm font-semibold text-ivory-50">
                  {activeDrape.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-charcoal-400 block">Pallu Fall</span>
                <span className="text-xs text-gold-300 font-medium font-sans">
                  {activeDrape.palluLength}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Draping Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
              Section 03 • Silhouette Laboratory
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-ivory-50 leading-tight">
              Select Your Draping Discipline
            </h3>
            <p className="text-xs text-charcoal-400 mt-2 font-light leading-relaxed">
              {activeDrape.description}
            </p>
          </div>

          {/* Draping Style Buttons with Framer Motion layoutId */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-luxury text-charcoal-400 block font-semibold">
              Select Drape Method
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DRAPE_STYLES.map((drape) => {
                const isSelected = activeDrape.id === drape.id;
                return (
                  <button
                    key={drape.id}
                    onClick={() => setActiveDrape(drape)}
                    className={`p-3 text-left border text-xs transition-all relative ${
                      isSelected
                        ? "border-gold-400 bg-charcoal-800 text-ivory-50"
                        : "border-charcoal-700 bg-charcoal-900/80 text-charcoal-400 hover:text-ivory-200"
                    }`}
                  >
                    <span className="font-serif font-medium text-sm block text-ivory-100">
                      {drape.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-gold-400 mt-0.5 block truncate">
                      {drape.provenance}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pleat Tension & Fall Slider */}
          <div className="p-4 bg-charcoal-800/80 border border-charcoal-700 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-charcoal-400 font-sans">Waist Pleat Density</span>
              <span className="text-gold-300 font-semibold">{pleatTension} Hand-Folded Pleats</span>
            </div>
            <input
              type="range"
              min={5}
              max={10}
              value={pleatTension}
              onChange={(e) => setPleatTension(Number(e.target.value))}
              className="w-full accent-gold-500 bg-charcoal-900 h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400">
              <span>Minimal Streamlined (5)</span>
              <span>Architectural Full (10)</span>
            </div>
          </div>

          {/* Ambiance Lighting Mode */}
          <div className="flex items-center justify-between pt-2 border-t border-charcoal-800 text-xs">
            <span className="text-[10px] uppercase tracking-luxury text-charcoal-400 font-semibold">
              Ambiance Light:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setAmbientLight("salon")}
                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                  ambientLight === "salon"
                    ? "border-gold-500 text-gold-300 bg-charcoal-800"
                    : "border-charcoal-700 text-charcoal-400"
                }`}
              >
                Daylight
              </button>
              <button
                onClick={() => setAmbientLight("sunset")}
                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                  ambientLight === "sunset"
                    ? "border-gold-500 text-gold-300 bg-charcoal-800"
                    : "border-charcoal-700 text-charcoal-400"
                }`}
              >
                Sunset
              </button>
              <button
                onClick={() => setAmbientLight("chandelier")}
                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors ${
                  ambientLight === "chandelier"
                    ? "border-gold-500 text-gold-300 bg-charcoal-800"
                    : "border-charcoal-700 text-charcoal-400"
                }`}
              >
                Gala
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

