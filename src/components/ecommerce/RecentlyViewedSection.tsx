"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { RecentlyViewedItem } from "./RecentlyViewedTracker";

export default function RecentlyViewedSection({ currentProductId }: { currentProductId?: string }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vaishiri_recently_viewed") || localStorage.getItem("avantika_recently_viewed");
      if (stored) {
        let parsed: RecentlyViewedItem[] = JSON.parse(stored);
        if (currentProductId) {
          parsed = parsed.filter((i) => i.id !== currentProductId);
        }
        setItems(parsed.slice(0, 4));
      }
    } catch {
      // Ignored
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="py-12 border-t border-border bg-ivory-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-terracotta font-semibold block mb-0.5">
              Personalized Browsing
            </span>
            <h3 className="font-serif text-2xl text-charcoal-950 font-normal">
              Recently Viewed Pieces
            </h3>
          </div>
          <Link
            href="/shop"
            className="text-xs text-charcoal-600 hover:text-terracotta underline font-medium"
          >
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              className="group block bg-surface border border-border p-2 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[3/4] bg-ivory-100 overflow-hidden mb-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xs font-serif text-charcoal-900 line-clamp-1 group-hover:text-terracotta transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-charcoal-950">
                  {formatPrice(item.price)}
                </span>
                {item.compareAtPrice && item.compareAtPrice > item.price && (
                  <span className="text-[10px] text-charcoal-400 line-through">
                    {formatPrice(item.compareAtPrice)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

