"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, Sparkles, Layers, Sliders } from "lucide-react";

interface SwatchPreset {
  id: string;
  name: string;
  origin: string;
  density: string;
  zariPurity: string;
  image: string;
  magnifiedImage: string;
  description: string;
}

const SWATCHES: SwatchPreset[] = [
  {
    id: "korvai",
    name: "Double-Warp Korvai Mulberry Silk",
    origin: "Kanchipuram, Tamil Nadu",
    density: "320 Threads/Inch • Heavy 3-Ply",
    zariPurity: "24-Karat Pure Gold Bath Electroplated",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
    magnifiedImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=95",
    description: "Notice the interlocking 'Petni' sawtooth teeth where the crimson body silk warp merges seamlessly with the emerald border.",
  },
  {
    id: "kadwa",
    name: "Kadwa Gold Meenakari Brocade",
    origin: "Varanasi Atelier",
    density: "280 Threads/Inch • Pure Katan",
    zariPurity: "Tested Antique Copper-Gold Zari",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
    magnifiedImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=95",
    description: "Each floral meenakari motif is hand-engraved individually with miniature wooden spools; reverse side is smooth without loose threads.",
  },
  {
    id: "tissue",
    name: "Gossamer Glass Silk Tissue",
    origin: "Chanderi Looms",
    density: "190 High-Twist Translucent Weft",
    zariPurity: "Champagne Metallic Spun Filament",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
    magnifiedImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=95",
    description: "Micro-spun metallic filaments interlace with open silk warps to yield an ethereal, liquid light reflection.",
  },
];

export function WeaveInspector() {
  const [selectedSwatch, setSelectedSwatch] = useState<SwatchPreset>(SWATCHES[0]);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 }); // percentage
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setCoords({ x, y });
  };

  return (
    <div className="bg-charcoal-900 text-ivory-100 p-6 sm:p-10 border border-charcoal-800 shadow-2xl font-sans select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Loupe Container */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onPointerDown={() => setIsMagnifying(true)}
            onPointerUp={() => setIsMagnifying(false)}
            onPointerLeave={() => setIsMagnifying(false)}
            onPointerMove={handlePointerMove}
            className="relative aspect-[4/3] w-full bg-charcoal-950 overflow-hidden border border-gold-500/30 cursor-crosshair group shadow-xl"
          >
            {/* Standard Image */}
            <Image
              src={selectedSwatch.image}
              alt={selectedSwatch.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />

            {/* Magnifier Glass Lens (Framer Motion) */}
            <AnimatePresence>
              {isMagnifying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    top: `${coords.y}%`,
                    left: `${coords.x}%`,
                    backgroundImage: `url(${selectedSwatch.magnifiedImage})`,
                    backgroundPosition: `${coords.x}% ${coords.y}%`,
                    backgroundSize: "320%",
                  }}
                  className="pointer-events-none absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-400 shadow-[0_0_30px_rgba(212,175,55,0.4)] z-20 overflow-hidden bg-no-repeat bg-charcoal-900"
                >
                  {/* Crosshair indicator inside lens */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-4 h-[1px] bg-gold-400" />
                    <div className="h-4 w-[1px] bg-gold-400 absolute" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Helper Overlay Hint */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-charcoal-950/80 backdrop-blur-xs border border-charcoal-700 text-[10px] uppercase tracking-luxury text-gold-300">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Press & Drag to Magnify (3x Weave Loupe)</span>
            </div>

            <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 bg-charcoal-950/80 text-[10px] text-charcoal-400 font-mono">
              X: {Math.round(coords.x)}% • Y: {Math.round(coords.y)}%
            </div>
          </div>
        </div>

        {/* Right Switcher & Weave Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
              Micro-Textile Inspection
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 leading-tight">
              {selectedSwatch.name}
            </h3>
            <p className="text-xs text-charcoal-400 mt-2 font-light leading-relaxed">
              {selectedSwatch.description}
            </p>
          </div>

          {/* Weave Specifications Panel */}
          <div className="p-4 bg-charcoal-800/80 border border-charcoal-700 text-xs space-y-2">
            <div className="flex justify-between pb-1.5 border-b border-charcoal-700">
              <span className="text-charcoal-400">Provenance</span>
              <span className="font-medium text-ivory-100">{selectedSwatch.origin}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-charcoal-700">
              <span className="text-charcoal-400">Thread Count</span>
              <span className="font-medium text-gold-300">{selectedSwatch.density}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-400">Zari Standard</span>
              <span className="font-medium text-ivory-100">{selectedSwatch.zariPurity}</span>
            </div>
          </div>

          {/* Swatch Selector Buttons */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] uppercase tracking-luxury text-charcoal-400 block font-semibold">
              Select Weave Architecture
            </span>
            <div className="flex flex-col gap-2">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch.id}
                  onClick={() => setSelectedSwatch(swatch)}
                  className={`p-3 text-left border text-xs transition-all flex items-center justify-between ${
                    selectedSwatch.id === swatch.id
                      ? "border-gold-500 bg-charcoal-800 text-ivory-50"
                      : "border-charcoal-700/80 bg-charcoal-900/60 text-charcoal-400 hover:text-ivory-200"
                  }`}
                >
                  <div>
                    <span className="font-serif font-medium text-sm block text-ivory-100">
                      {swatch.name}
                    </span>
                    <span className="text-[10px] text-gold-400 uppercase tracking-wider">
                      {swatch.origin}
                    </span>
                  </div>
                  {selectedSwatch.id === swatch.id && (
                    <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

