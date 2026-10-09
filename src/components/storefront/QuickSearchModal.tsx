"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { modalScale } from "@/components/animations/motionVariants";

export function QuickSearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    products: Array<{ id: string; title: string; slug: string; price: number; fabric: string; image: string }>;
    categories: Array<{ name: string; slug: string }>;
    collections: Array<{ name: string; slug: string }>;
  }>({ products: [], categories: [], collections: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults({ products: [], categories: [], collections: [] });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [], collections: [] });
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const trendingTags = [
    "Kanchipuram Silk",
    "Kadwa Banarasi",
    "Organza Tissue",
    "Royal Paithani",
    "Ivory & Gold",
    "Muhurtham Wedding",
  ];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-ivory-50 shadow-2xl border border-border p-6 z-10"
          >
            {/* Input Header */}
            <div className="relative flex items-center border-b border-border pb-4">
              <Search className="w-5 h-5 text-charcoal-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by weave, fabric, motif, or occasion..."
                className="w-full bg-transparent text-charcoal-900 placeholder:text-charcoal-400 text-sm sm:text-base focus:outline-none font-serif tracking-wide"
              />
              {isLoading && (
                <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin shrink-0 mx-2" />
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-charcoal-400 hover:text-charcoal-900 ml-2"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trending Tags when query is empty */}
            {!query && (
              <div className="pt-5">
                <span className="text-[10px] uppercase tracking-luxury text-charcoal-500 block mb-2.5">
                  Suggested Curations
                </span>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-ivory-200/70 text-xs text-charcoal-800 hover:bg-gold-500 hover:text-charcoal-900 transition-colors border border-border/80"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Results */}
            {query && (
              <div className="mt-5 max-h-[60vh] overflow-y-auto space-y-4">
                {results.products.length === 0 && !isLoading ? (
                  <p className="text-center py-8 text-xs text-charcoal-500 font-sans">
                    No atelier pieces matching &quot;{query}&quot;. Try exploring &quot;Silk&quot; or &quot;Tissue&quot;.
                  </p>
                ) : (
                  <>
                    {results.categories.length > 0 && (
                      <div className="pb-3 border-b border-border/60">
                        <span className="text-[10px] uppercase tracking-luxury text-charcoal-500 block mb-2">
                          Categories
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {results.categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/shop?category=${cat.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="text-xs text-gold-700 hover:underline flex items-center gap-1 font-medium"
                            >
                              {cat.name} <ArrowRight className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] uppercase tracking-luxury text-charcoal-500 block pt-1">
                      Matching Creations ({results.products.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {results.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-2 bg-ivory-100/60 hover:bg-ivory-200/80 transition-colors border border-border/60 group"
                        >
                          <div className="relative w-14 aspect-[3/4] bg-ivory-200 shrink-0 overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-serif text-xs text-charcoal-900 truncate group-hover:text-gold-700">
                              {p.title}
                            </h4>
                            <span className="text-[10px] text-charcoal-500 block mt-0.5 truncate">
                              {p.fabric}
                            </span>
                            <span className="text-xs font-medium text-charcoal-950 block mt-1">
                              {formatPrice(p.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

