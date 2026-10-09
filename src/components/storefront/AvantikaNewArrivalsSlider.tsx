"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ecommerce/ProductCard";

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  fabric: string;
  categoryName: string;
  primaryImage: string;
  secondaryImage?: string | null;
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

interface Props {
  products: ProductItem[];
}

export function AvantikaNewArrivalsSlider({ products }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const offset = direction === "left" ? -320 : 320;
      containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 sm:py-20 bg-white font-sans border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-12">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-luxury text-[#86412D] font-bold block mb-1">
              Fresh Off The Dye Table
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-950 font-normal">
              New Arrivals
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/collections/new-arrivals"
              className="text-xs uppercase tracking-wider text-[#86412D] hover:underline font-bold flex items-center gap-1.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Slider Controls */}
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <button
                onClick={() => scroll("left")}
                aria-label="Previous products"
                className="w-9 h-9 rounded-full border border-charcoal-200 hover:border-charcoal-900 bg-white text-charcoal-800 flex items-center justify-center transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Next products"
                className="w-9 h-9 rounded-full border border-charcoal-200 hover:border-charcoal-900 bg-white text-charcoal-800 flex items-center justify-center transition-colors shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Sliding Products List */}
        <div
          ref={containerRef}
          className="flex gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar scrollbar-none pb-4 scroll-smooth snap-x snap-mandatory"
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="flex-none w-[200px] sm:w-[260px] lg:w-[280px] snap-start"
            >
              <ProductCard
                id={p.id}
                title={p.title}
                slug={p.slug}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                fabric={p.fabric}
                categoryName={p.categoryName}
                primaryImage={p.primaryImage}
                secondaryImage={p.secondaryImage}
                isNewArrival={p.isNewArrival}
                isBestseller={p.isBestseller}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

