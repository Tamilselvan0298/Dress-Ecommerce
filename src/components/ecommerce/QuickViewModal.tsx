"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Star, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cartContext";
import { useToast } from "@/lib/store/toastContext";
import { modalScale } from "@/components/animations/motionVariants";

export interface QuickViewProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  fabric: string;
  weaveType?: string;
  borderType?: string;
  description: string;
  images: string[];
  variants?: Array<{
    id: string;
    color: string;
    colorHex: string;
    image?: string | null;
    price?: number;
  }>;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { showToast } = useToast();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
  ];

  const handleSelectColor = (v: any) => {
    setSelectedVariant(v);
    if (v.image) {
      const idx = images.indexOf(v.image);
      if (idx !== -1) {
        setSelectedImageIdx(idx);
      }
    }
  };

  const currentPrice = selectedVariant?.price || product.price;

  const handleAdd = () => {
    const activeImg = images[selectedImageIdx] || images[0];
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      title: selectedVariant ? `${product.title} - ${selectedVariant.color}` : product.title,
      price: currentPrice,
      image: activeImg,
      fabric: product.fabric,
      quantity: 1,
    });
    setIsAdded(true);
    showToast({
      type: "cart",
      title: "Added to Bag",
      message: `${product.title} (${formatPrice(currentPrice)})`,
      image: activeImg,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          variants={modalScale}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-3xl bg-ivory-50 border border-border shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-ivory-50/80 backdrop-blur-xs text-charcoal-700 hover:text-charcoal-950 rounded-full"
            aria-label="Close Quick View"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Images with Thumbnail Selector */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-ivory-100/60 border-r border-border">
            <div className="relative aspect-[3/4] w-full bg-ivory-200 overflow-hidden border border-border">
              <Image
                src={images[selectedImageIdx] || images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-14 aspect-[3/4] shrink-0 border transition-all ${
                      selectedImageIdx === idx
                        ? "border-gold-500 scale-105"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-gold-600 block mb-1">
                  {product.fabric}
                </span>
                <h3 className="font-serif text-2xl text-charcoal-950 leading-snug">
                  {product.title}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-sans text-xl font-semibold text-charcoal-950">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="font-sans text-xs text-charcoal-400 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed font-light line-clamp-3">
                {product.description}
              </p>

              {/* Color Swatches if product has variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-500 uppercase tracking-wider text-[10px]">
                      Color: <strong className="text-[#86412D]">{selectedVariant?.color || "Standard"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.variants.map((v) => {
                      const isSel = selectedVariant?.id === v.id;
                      const isMulti =
                        v.colorHex?.toLowerCase() === "multicolor" ||
                        v.color?.toLowerCase().includes("multi");

                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleSelectColor(v)}
                          className={`relative p-0.5 rounded-full transition-all ${
                            isSel ? "ring-2 ring-offset-1 ring-[#86412D] scale-110" : "opacity-80 hover:opacity-100"
                          }`}
                          title={v.color}
                        >
                          <span
                            className="block w-6 h-6 rounded-full border border-charcoal-300 shadow-2xs flex items-center justify-center"
                            style={{
                              background: isMulti
                                ? "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)"
                                : v.colorHex,
                            }}
                          >
                            {isSel && (
                              <Check
                                className={`w-3 h-3 ${
                                  v.colorHex === "#FFFFFF" || v.colorHex === "#F5F2EB"
                                    ? "text-charcoal-900"
                                    : "text-white"
                                }`}
                              />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-border mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 bg-charcoal-900 text-ivory-100 text-xs uppercase tracking-luxury hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    showToast({
                      type: "wishlist",
                      title: inWishlist ? "Removed from Wishlist" : "Saved to Wishlist",
                      message: inWishlist
                        ? `${product.title} removed from your wishlist.`
                        : `${product.title} saved to your private wishlist.`,
                      image: images[0],
                      actionText: "View Wishlist",
                      onAction: () => {
                        window.location.href = "/account/wishlist";
                      },
                    });
                  }}
                  className={`p-3.5 border border-border transition-colors ${
                    inWishlist ? "text-red-600 bg-red-50" : "text-charcoal-700 hover:bg-ivory-100"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full py-2.5 text-center text-xs uppercase tracking-wider text-[#86412D] hover:underline flex items-center justify-center gap-1 font-semibold"
              >
                <span>View Full Product Details & Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

