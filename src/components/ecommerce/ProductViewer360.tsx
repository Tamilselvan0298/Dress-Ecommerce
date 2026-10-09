"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";

interface ProductViewer360Props {
  images: string[];
  productTitle: string;
}

export function ProductViewer360({ images, productTitle }: ProductViewer360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const frameCount = images.length > 0 ? images.length : 1;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    // Step index every 25px of dragging
    if (Math.abs(deltaX) > 25) {
      const step = deltaX > 0 ? 1 : -1;
      setCurrentIndex((prev) => (prev + step + frameCount) % frameCount);
      startXRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const currentImage = images[currentIndex] || images[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85";

  return (
    <div
      className="relative w-full aspect-[3/4] bg-ivory-100 overflow-hidden cursor-ew-resize select-none border border-border"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Image
        src={currentImage}
        alt={`${productTitle} - Angle ${currentIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-opacity duration-150"
        priority
      />

      {/* Floating 360 degree indicator badge */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-charcoal-900/85 backdrop-blur-sm text-ivory-100 text-xs font-sans tracking-editorial uppercase">
        <RefreshCw className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: "12s" }} />
        <span>360° Studio View ({currentIndex + 1}/{frameCount})</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[11px] text-charcoal-600 bg-ivory-50/80 px-2.5 py-1">
        Drag horizontally to rotate
      </div>
    </div>
  );
}

