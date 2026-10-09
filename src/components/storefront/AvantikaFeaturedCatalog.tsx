"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

export function AvantikaFeaturedCatalog({ products }: Props) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterTabs = [
    { label: "All Masterpieces", value: "all" },
    { label: "Batik Suits", value: "batik" },
    { label: "Hand Block Print", value: "block" },
    { label: "Cotton 60×60", value: "cotton" },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "batik") return p.title.toLowerCase().includes("batik");
    if (selectedFilter === "block") return p.title.toLowerCase().includes("block");
    if (selectedFilter === "cotton") return p.fabric.toLowerCase().includes("cotton") || p.title.toLowerCase().includes("cotton");
    return true;
  });

  return (
    <section className="py-10 sm:py-20 bg-white font-sans border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-12">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-luxury text-[#86412D] font-bold block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-950 font-normal">
              New Collection
            </h2>
          </div>

          {/* Filter Pills - scrollable on mobile, wrapping on desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedFilter(tab.value)}
                className={`px-3 py-1.5 text-xs rounded-xs whitespace-nowrap shrink-0 transition-colors ${
                  selectedFilter === tab.value
                    ? "bg-[#86412D] text-white font-semibold shadow-xs"
                    : "bg-[#F5F1EC] text-charcoal-700 hover:bg-[#E8E2D8]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.slice(0, 8).map((p) => (
            <ProductCard
              key={p.id}
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
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121212] text-white hover:bg-[#86412D] transition-colors text-xs uppercase tracking-luxury font-bold shadow-sm hover:shadow-md"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

