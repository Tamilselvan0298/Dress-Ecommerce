"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductViewer360 } from "@/components/ecommerce/ProductViewer360";
import { RefreshCw, Image as ImageIcon, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
  externalActiveIndex?: number;
  onSelectImageIndex?: (index: number) => void;
}

export function ProductGallery({
  images,
  productTitle,
  externalActiveIndex,
  onSelectImageIndex,
}: ProductGalleryProps) {
  const [activeMode, setActiveMode] = useState<"gallery" | "360" | "zoom">("gallery");
  const [internalIndex, setInternalIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  const selectedImageIndex =
    externalActiveIndex !== undefined ? externalActiveIndex : internalIndex;

  const handleSelectIndex = (idx: number) => {
    setActiveMode("gallery");
    setInternalIndex(idx);
    if (onSelectImageIndex) {
      onSelectImageIndex(idx);
    }
  };

  const currentImage =
    images[selectedImageIndex] ||
    images[0] ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85";

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isZooming) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomCoords({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 font-sans select-none">
      {/* Thumbnails list on desktop */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto no-scrollbar scrollbar-none lg:overflow-visible shrink-0 pb-2 lg:pb-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectIndex(idx)}
              className={`relative w-16 sm:w-20 aspect-[3/4] shrink-0 border transition-all ${
                activeMode === "gallery" && selectedImageIndex === idx
                  ? "border-[#86412D] ring-2 ring-[#86412D]/40 scale-102 shadow-sm"
                  : "border-border hover:border-charcoal-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${productTitle} thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col">
        {/* Interactive Mode Toggles */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveMode("gallery")}
            className={`px-3 py-1.5 text-xs font-sans tracking-luxury uppercase border transition-colors flex items-center gap-1.5 ${
              activeMode === "gallery"
                ? "bg-charcoal-900 text-ivory-100 border-charcoal-900 font-medium"
                : "bg-ivory-100 text-charcoal-700 border-border hover:border-charcoal-500"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Editorial Photography</span>
          </button>

          <button
            onClick={() => setActiveMode("360")}
            className={`px-3 py-1.5 text-xs font-sans tracking-luxury uppercase border transition-colors flex items-center gap-1.5 ${
              activeMode === "360"
                ? "bg-gold-500 text-charcoal-900 border-gold-500 font-medium"
                : "bg-ivory-100 text-charcoal-700 border-border hover:border-charcoal-500"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>360° Studio View</span>
          </button>

          <button
            onClick={() => setActiveMode("zoom")}
            className={`px-3 py-1.5 text-xs font-sans tracking-luxury uppercase border transition-colors flex items-center gap-1.5 ${
              activeMode === "zoom"
                ? "bg-gold-500 text-charcoal-900 border-gold-500 font-medium"
                : "bg-ivory-100 text-charcoal-700 border-border hover:border-charcoal-500"
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Weave Loupe</span>
          </button>
        </div>

        {/* Display Container */}
        <div className="relative w-full aspect-[3/4] bg-ivory-100 border border-border overflow-hidden">
          {activeMode === "gallery" && (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0.7, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.7, scale: 0.99 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentImage}
                    alt={productTitle}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-3 left-3 bg-charcoal-900/80 backdrop-blur-xs text-ivory-100 text-[10px] tracking-luxury uppercase px-2.5 py-1 z-10">
                Image {selectedImageIndex + 1} of {images.length}
              </div>
            </div>
          )}

          {activeMode === "360" && (
            <ProductViewer360 images={images} productTitle={productTitle} />
          )}

          {activeMode === "zoom" && (
            <div
              onPointerDown={() => setIsZooming(true)}
              onPointerUp={() => setIsZooming(false)}
              onPointerLeave={() => setIsZooming(false)}
              onPointerMove={handlePointerMove}
              className="relative w-full h-full cursor-crosshair overflow-hidden"
            >
              <Image
                src={currentImage}
                alt={productTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              <AnimatePresence>
                {isZooming && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      top: `${zoomCoords.y}%`,
                      left: `${zoomCoords.x}%`,
                      backgroundImage: `url(${currentImage})`,
                      backgroundPosition: `${zoomCoords.x}% ${zoomCoords.y}%`,
                      backgroundSize: "300%",
                    }}
                    className="pointer-events-none absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.4)] z-20 overflow-hidden bg-no-repeat bg-charcoal-950"
                  />
                )}
              </AnimatePresence>

              <div className="absolute top-3 left-3 bg-charcoal-900/80 backdrop-blur-xs text-gold-300 text-[10px] tracking-luxury uppercase px-2.5 py-1">
                Press & Drag To Inspect 3X Weave Density
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
