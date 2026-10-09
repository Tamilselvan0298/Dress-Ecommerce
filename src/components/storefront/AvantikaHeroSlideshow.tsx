"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  image: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_03_00_AM.png?v=1786912868&width=3840",
    heading: "Authentic Wax Batik & Copper Block",
    subheading: "Handcrafted 3-Piece Unstitched Suits in Pure Breathable Cotton 60×60",
    ctaText: "Shop Batik Suits",
    ctaLink: "/collections/batik-suits-unstitched",
  },
  {
    id: 2,
    image: "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_24_10_AM.png?v=1786913696&width=3840",
    heading: "The Artisan Batik Cloth Vault",
    subheading: "Centuries of Wax-Resist Craftsmanship in Earthy Organic Pigments",
    ctaText: "Explore Batik Cloth",
    ctaLink: "/collections/batik-cloth",
  },
  {
    id: 3,
    image: "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_20_12_AM.png?v=1786913771&width=3840",
    heading: "Pure Elegance in Every Thread",
    subheading: "Lightweight, Breathable & Handcrafted For Festive & Daily Grace",
    ctaText: "Discover New Arrivals",
    ctaLink: "/collections/new-arrivals",
  },
  {
    id: 4,
    image: "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_39_28_AM.png?v=1786914608&width=3840",
    heading: "Batik Sarees & Hand-Block Sets",
    subheading: "Timeless Indian Heritage Reimagined for the Modern Woman",
    ctaText: "View Complete Catalog",
    ctaLink: "/shop",
  },
];

export function AvantikaHeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) {
      handleNext(); // swipe left
    } else if (diff < -40) {
      handlePrev(); // swipe right
    }
    setTouchStart(null);
  };

  const currentSlide = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden bg-[#FAF7F2] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Responsive Aspect Ratio matching authentic Vaishiri / Avantika banners */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.35/1] lg:aspect-[2.71/1] min-h-[195px] sm:min-h-[320px] max-h-[720px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Link href={currentSlide.ctaLink} className="block w-full h-full relative cursor-pointer">
              <Image
                src={currentSlide.image}
                alt={currentSlide.heading}
                fill
                priority={current === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Floating Brand CTA Button - Crisp terracotta with white text */}
        <div className="absolute bottom-2.5 sm:bottom-8 lg:bottom-12 left-3 sm:left-8 lg:left-14 z-20 pointer-events-auto">
          <motion.div
            key={`btn-${currentSlide.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <Link
              href={currentSlide.ctaLink}
              className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3.5 py-1.5 sm:px-7 sm:py-3.5 bg-[#86412D] text-white hover:bg-[#682E1E] transition-all duration-300 text-[11px] sm:text-xs uppercase tracking-wider font-bold shadow-md hover:shadow-xl rounded-2xs group border border-[#86412D]"
            >
              <span className="text-white drop-shadow-xs">{currentSlide.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Prev / Next Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-1.5 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-charcoal-900 flex items-center justify-center transition-all shadow-sm sm:shadow-md hover:scale-105"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-charcoal-900" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-1.5 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-charcoal-900 flex items-center justify-center transition-all shadow-sm sm:shadow-md hover:scale-105"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-charcoal-900" />
        </button>

        {/* Slide Pagination Indicator Dots */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 transition-all duration-300 rounded-full ${
                current === idx ? "w-5 sm:w-8 bg-[#86412D]" : "w-1.5 sm:w-2 bg-charcoal-800/30 hover:bg-charcoal-800/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
