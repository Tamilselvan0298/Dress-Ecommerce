"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { useToast } from "@/lib/store/toastContext";
import { motion } from "framer-motion";

interface WishlistButtonProps {
  productId: string;
  title?: string;
  image?: string;
  className?: string;
}

export function WishlistButton({ productId, title, image, className }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useCart();
  const { showToast } = useToast();
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    showToast({
      type: "wishlist",
      title: inWishlist ? "Removed from Wishlist" : "Saved to Wishlist",
      message: inWishlist
        ? `${title || "Item"} removed from your wishlist.`
        : `${title || "Item"} saved to your private wishlist.`,
      image: image,
      actionText: "View Wishlist",
      onAction: () => {
        window.location.href = "/account/wishlist";
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-3 border border-border transition-colors hover:border-charcoal-800 flex items-center justify-center ${
        inWishlist ? "bg-red-50 text-red-600 border-red-200" : "bg-ivory-50 text-charcoal-700"
      } ${className || ""}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div whileTap={{ scale: 0.85 }}>
        <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
      </motion.div>
    </button>
  );
}
