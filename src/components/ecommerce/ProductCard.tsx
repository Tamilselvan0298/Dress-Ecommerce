"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { useToast } from "@/lib/store/toastContext";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  fabric: string;
  categoryName?: string;
  primaryImage: string;
  secondaryImage?: string | null;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  onQuickView?: () => void;
}

export function ProductCard({
  id,
  title,
  slug,
  price,
  compareAtPrice,
  fabric,
  categoryName,
  primaryImage,
  secondaryImage,
  isNewArrival,
  isBestseller,
  onQuickView,
}: ProductCardProps) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(id);
  const isOnSale = compareAtPrice && compareAtPrice > price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      productId: id,
      title,
      price,
      image: primaryImage,
      fabric,
      quantity: 1,
    });
    showToast({
      type: "cart",
      title: "Added to Bag",
      message: `${title} (${formatPrice(price)})`,
      image: primaryImage,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    showToast({
      type: "wishlist",
      title: inWishlist ? "Removed from Wishlist" : "Saved to Wishlist",
      message: inWishlist ? `${title} removed.` : `${title} saved to your private wishlist.`,
      image: primaryImage,
      actionText: "View Wishlist",
      onAction: () => {
        window.location.href = "/account/wishlist";
      },
    });
  };

  return (
    <article
      className="group relative flex flex-col font-sans select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs">
        <Link href={`/product/${slug}`} className="block w-full h-full relative">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-500 ease-out ${
              isHovered && secondaryImage ? "opacity-0" : "opacity-100"
            } group-hover:scale-104 transition-transform duration-500`}
            priority={false}
          />

          {/* Secondary Hover Image */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${title} detail`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-500 ease-out ${
                isHovered ? "opacity-100 scale-104" : "opacity-0 scale-100"
              } transition-transform duration-500`}
            />
          )}
        </Link>

        {/* Sale / Sold Out Badges (Matching Avantika's terracotta badge) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {isOnSale && (
            <span className="bg-[#86412D] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-2xs shadow-xs">
              Sale
            </span>
          )}
          {isNewArrival && !isOnSale && (
            <span className="bg-[#121212] text-white text-[9px] font-medium tracking-wider uppercase px-2 py-0.5">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full transition-all duration-200 ${
            inWishlist
              ? "bg-white text-red-600 shadow-md scale-105"
              : "bg-white/80 backdrop-blur-xs text-charcoal-700 hover:text-red-600 hover:bg-white shadow-xs"
          }`}
        >
          <motion.div whileTap={{ scale: 0.8 }}>
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-current text-red-600" : ""}`} />
          </motion.div>
        </button>

        {/* Desktop Quick Add Bar on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 hidden sm:flex items-center justify-between gap-2 z-20">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="flex-1 py-2.5 bg-white text-charcoal-900 hover:bg-[#86412D] hover:text-white text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdding ? "Adding..." : "Quick Add"}</span>
          </button>
          {onQuickView ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="p-2.5 bg-white/90 hover:bg-white text-charcoal-900 hover:text-[#86412D] transition-colors"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href={`/product/${slug}`}
              className="p-2.5 bg-white/90 hover:bg-white text-charcoal-900 hover:text-[#86412D] transition-colors"
              aria-label="View product"
            >
              <Eye className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3 flex flex-col flex-1">
        {/* Star Rating (Judge.me 5.0 style) */}
        <div className="flex items-center gap-1 text-[#B57359] mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#B57359]" />
          ))}
          <span className="text-[10px] text-charcoal-500 ml-1">5.0</span>
        </div>

        {/* Title */}
        <h3 className="font-sans text-xs sm:text-sm font-medium text-charcoal-900 line-clamp-2 leading-snug group-hover:text-[#86412D] transition-colors">
          <Link href={`/product/${slug}`}>{title}</Link>
        </h3>

        {/* Price matching Avantika's regular + sale strikethrough */}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-sans text-xs sm:text-sm font-bold text-charcoal-950">
            {formatPrice(price)}
          </span>
          {isOnSale && (
            <span className="font-sans text-[11px] text-charcoal-400 line-through">
              {formatPrice(compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-2.5 sm:hidden">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2 bg-[#86412D] text-white text-[10px] uppercase font-bold tracking-wider hover:bg-[#6B3323] transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
