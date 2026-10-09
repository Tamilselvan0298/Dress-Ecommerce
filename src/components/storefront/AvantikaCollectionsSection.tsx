"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  countText: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: "1",
    name: "Batik Cloth",
    slug: "batik-cloth",
    image: "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_14_2026_02_05_11_PM.png?v=1786696562&width=1500",
    countText: "16+ Fabrics",
  },
  {
    id: "2",
    name: "Batik Suits Stitched",
    slug: "batik-suits-stitched",
    image: "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_14_2026_02_10_40_PM.webp?v=1787045278&width=1500",
    countText: "Ready-to-Wear",
  },
  {
    id: "3",
    name: "Batik Saree",
    slug: "cotton-coat-sets",
    image: "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_14_2026_02_13_11_PM.webp?v=1787045362&width=1500",
    countText: "Handcrafted Drapes",
  },
  {
    id: "4",
    name: "Batik Suits Unstitched",
    slug: "batik-suits-unstitched",
    image: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-marigold-katha-batik-cotton-unstitched-suit-set-3481440.png?v=1787159890",
    countText: "22+ Designs",
  },
  {
    id: "5",
    name: "Cotton Batik Bedsheet",
    slug: "cotton-batik-bedsheet",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85",
    countText: "Artisanal Home",
  },
];

export function AvantikaCollectionsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 sm:py-20 bg-white font-sans border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Avantika */}
        <div className="flex items-center justify-between mb-6 sm:mb-12">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-luxury text-[#86412D] font-bold block mb-1">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-950 font-normal uppercase tracking-wider">
              COLLECTIONS
            </h2>
          </div>

          {/* Navigation Prev / Next Arrows */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll collections left"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-charcoal-200 hover:border-charcoal-900 bg-white text-charcoal-800 flex items-center justify-center transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll collections right"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-charcoal-200 hover:border-charcoal-900 bg-white text-charcoal-800 flex items-center justify-center transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Collection Cards Grid */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar scrollbar-none pb-4 scroll-smooth snap-x snap-mandatory"
        >
          {COLLECTIONS.map((item) => (
            <Link
              key={item.id}
              href={`/collections/${item.slug}`}
              className="group relative flex-none w-[220px] sm:w-[280px] lg:w-[300px] aspect-[3/4] rounded-md overflow-hidden bg-charcoal-900 snap-start shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 260px, 300px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent transition-opacity group-hover:opacity-90" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-[10px] uppercase tracking-wider text-gold-300 block mb-1 font-medium">
                  {item.countText}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-gold-200 transition-colors leading-snug">
                  {item.name}
                </h3>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] uppercase tracking-luxury text-white/90 font-medium group-hover:text-gold-300">
                  <span>Explore Vault</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

