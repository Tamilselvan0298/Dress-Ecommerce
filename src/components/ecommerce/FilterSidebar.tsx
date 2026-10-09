"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  selectedCategory?: string;
  selectedOccasion?: string;
  sortBy?: string;
  totalCount: number;
}

export function FilterSidebar({
  categories,
  selectedCategory = "",
  selectedOccasion = "",
  sortBy = "featured",
  totalCount,
}: FilterSidebarProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateParam = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const occasions = [
    "All Occasions",
    "Bridal / Wedding",
    "Reception",
    "Festive",
    "Royal Gala",
  ];

  const sortOptions = [
    { label: "Featured Atelier Curation", value: "featured" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest Off-Loom", value: "newest" },
  ];

  const filterContent = (
    <div className="space-y-8 font-sans">
      {/* Categories */}
      <div>
        <h4 className="text-xs uppercase tracking-luxury text-charcoal-900 font-medium mb-3 pb-2 border-b border-border">
          By Weave & Origin
        </h4>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => updateParam("category", "")}
              className={`text-xs text-left w-full transition-colors ${
                !selectedCategory
                  ? "text-gold-700 font-semibold"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              All Handlooms
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateParam("category", cat.slug)}
                className={`text-xs text-left w-full transition-colors ${
                  selectedCategory === cat.slug
                    ? "text-gold-700 font-semibold"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Occasions */}
      <div>
        <h4 className="text-xs uppercase tracking-luxury text-charcoal-900 font-medium mb-3 pb-2 border-b border-border">
          By Occasion
        </h4>
        <ul className="space-y-2">
          {occasions.map((occ) => (
            <li key={occ}>
              <button
                onClick={() => updateParam("occasion", occ === "All Occasions" ? "" : occ)}
                className={`text-xs text-left w-full transition-colors ${
                  (occ === "All Occasions" && !selectedOccasion) || selectedOccasion === occ
                    ? "text-gold-700 font-semibold"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                {occ}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort By */}
      <div>
        <h4 className="text-xs uppercase tracking-luxury text-charcoal-900 font-medium mb-3 pb-2 border-b border-border">
          Sort Order
        </h4>
        <ul className="space-y-2">
          {sortOptions.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => updateParam("sort", opt.value)}
                className={`text-xs text-left w-full transition-colors ${
                  sortBy === opt.value
                    ? "text-gold-700 font-semibold"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Column */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8">
        <div className="sticky top-28">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
            <span className="text-xs uppercase tracking-luxury font-medium text-charcoal-900">
              Filter Archive
            </span>
            <span className="text-[11px] text-charcoal-500 font-sans">
              {totalCount} Pieces
            </span>
          </div>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filter Trigger Button */}
      <div className="lg:hidden flex items-center justify-between py-3 mb-6 border-y border-border">
        <span className="text-xs font-sans text-charcoal-600">
          Showing {totalCount} Pieces
        </span>
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs uppercase tracking-luxury text-charcoal-900 hover:bg-ivory-200"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-charcoal-950/60 z-50 lg:hidden backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-ivory-50 z-50 p-6 rounded-t-xl border-t border-border lg:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <span className="font-serif text-lg text-charcoal-900">Refine Collection</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-charcoal-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="mt-8 w-full py-3 bg-charcoal-900 text-ivory-100 text-xs uppercase tracking-luxury"
              >
                Apply Filters ({totalCount})
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

