"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cartContext";
import { useToast } from "@/lib/store/toastContext";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  fabric: string;
  categoryName?: string;
  image: string;
  secondaryImage?: string;
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItem, isHydrated, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    async function loadWishlistProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const queryIds = encodeURIComponent(wishlist.join(","));
        const res = await fetch(`/api/wishlist?ids=${queryIds}`);
        
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          // Fallback to POST in case URL string was too long
          const postRes = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: wishlist }),
          });
          if (postRes.ok) {
            const data = await postRes.json();
            setProducts(data.products || []);
          }
        }
      } catch (err) {
        console.error("Failed to load wishlist items:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlist, isHydrated]);

  const handleMoveToBag = (p: WishlistProduct) => {
    addItem({
      productId: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      fabric: p.fabric,
      quantity: 1,
    });
    toggleWishlist(p.id);
    showToast({
      type: "cart",
      title: "Moved to Bag",
      message: `${p.title} has been moved to your shopping bag.`,
      image: p.image,
      actionText: "Open Bag",
      onAction: () => setIsCartOpen(true),
    });
  };

  const handleRemove = (p: WishlistProduct) => {
    toggleWishlist(p.id);
    showToast({
      type: "wishlist",
      title: "Removed from Wishlist",
      message: `${p.title} removed.`,
    });
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-[#86412D] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <Link href="/account" className="hover:text-[#86412D] transition-colors">Account</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-[#86412D] font-semibold">Wishlist</span>
      </nav>

      {/* Page Header */}
      <div className="pb-6 border-b border-[#E8E2D8] mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-wider uppercase text-[#86412D] font-bold block mb-1">
            Vaishiri Personal Vault
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal">
            Your Wishlist {isHydrated && `(${wishlist.length})`}
          </h1>
          <p className="text-xs text-charcoal-600 mt-1 font-light">
            Bookmark and manage your favorite handcrafted Batik suits, sarees, and dresses.
          </p>
        </div>

        {wishlist.length > 0 && (
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider text-[#86412D] font-bold hover:underline self-start sm:self-auto flex items-center gap-1"
          >
            Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Loading Skeleton */}
      {!isHydrated || isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#FAF7F2] border border-[#E8E2D8] p-3 space-y-3">
              <div className="aspect-[3/4] bg-[#E8E2D8]/60 w-full" />
              <div className="h-3 bg-[#E8E2D8]/60 w-2/3" />
              <div className="h-4 bg-[#E8E2D8]/60 w-full" />
              <div className="h-4 bg-[#E8E2D8]/60 w-1/3" />
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 || products.length === 0 ? (
        /* Empty State */
        <div className="py-20 sm:py-24 text-center bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#86412D]/10 text-[#86412D] flex items-center justify-center">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-md mx-auto font-light leading-relaxed">
            Explore our curated collections of pure cotton 60×60 handcrafted Batik suits and tap the heart icon to save your favorites.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[#86412D] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#6B3323] transition-colors shadow-xs"
            >
              Explore All Collections
            </Link>
            <Link
              href="/collections/batik-suits-unstitched"
              className="px-6 py-3.5 border border-[#86412D] text-[#86412D] text-xs uppercase tracking-wider font-bold hover:bg-[#86412D] hover:text-white transition-colors"
            >
              Batik Suits Unstitched
            </Link>
          </div>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-[#FAF7F2] border border-[#E8E2D8] p-3 flex flex-col justify-between hover:border-[#86412D]/50 transition-colors"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] w-full bg-[#F5F1EC] overflow-hidden mb-3">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(p)}
                      className="absolute top-2 right-2 p-1.5 bg-white/95 text-charcoal-600 hover:text-red-600 rounded-full shadow-xs transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Compare At Discount Badge */}
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#86412D] text-white text-[10px] font-bold uppercase tracking-wider">
                        {Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}% Off
                      </span>
                    )}
                  </div>

                  {/* Fabric / Category Tag */}
                  <span className="text-[10px] uppercase tracking-wider text-[#86412D] font-bold block mb-1">
                    {p.categoryName || p.fabric}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-sm text-charcoal-900 line-clamp-2 leading-snug group-hover:text-[#86412D] transition-colors">
                    <Link href={`/product/${p.slug}`}>{p.title}</Link>
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-semibold text-charcoal-950 text-sm">
                      {formatPrice(p.price)}
                    </span>
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <span className="text-xs text-charcoal-400 line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Bag Action */}
                <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex gap-2">
                  <button
                    onClick={() => handleMoveToBag(p)}
                    className="flex-1 py-2.5 bg-[#86412D] text-white text-[11px] uppercase tracking-wider hover:bg-[#6B3323] transition-colors flex items-center justify-center gap-1.5 font-bold shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
