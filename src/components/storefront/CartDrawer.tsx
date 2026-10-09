"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { drawerSlideRight } from "@/components/animations/motionVariants";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplying(true);
    setCouponMessage(null);
    const result = await applyCoupon(couponCodeInput);
    setIsApplying(false);
    setCouponMessage({
      text: result.message,
      isError: !result.success,
    });
    if (result.success) {
      setCouponCodeInput("");
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50"
          />

          {/* Slide-out Drawer */}
          <motion.div
            variants={drawerSlideRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 bottom-0 right-0 w-full sm:max-w-md bg-ivory-50 z-50 flex flex-col justify-between border-l border-border shadow-2xl font-sans"
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-[#F5F1EC]">
              <div>
                <h2 className="font-serif text-xl tracking-wide text-charcoal-900 font-normal">
                  Your Shopping Bag
                </h2>
                <span className="text-[11px] uppercase tracking-wider text-charcoal-500 font-medium">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-charcoal-600 hover:text-charcoal-950 transition-colors"
                aria-label="Close Bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar (Threshold: Rs 999) */}
            {items.length > 0 && (
              <div className="bg-white px-5 py-2.5 border-b border-[#E8E2D8] text-[11px] font-sans">
                {subtotal >= 999 ? (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unlocked: Free Delivery Across India!</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-charcoal-700">
                      Add <strong>{formatPrice(999 - subtotal)}</strong> more for <strong>Free Shipping</strong>
                    </span>
                    <div className="w-full bg-[#FAF7F2] h-1.5 mt-1.5 rounded-full overflow-hidden border border-[#E8E2D8]">
                      <motion.div
                        className="bg-[#86412D] h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-4 text-[#86412D]">
                    <Tag className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-serif text-xl text-charcoal-800 font-normal">Your Bag is Empty</h3>
                  <p className="text-xs text-charcoal-500 mt-2 max-w-xs font-sans font-light">
                    Discover authentic handcrafted Batik suits, sarees, and pure cotton ethnic wear.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 inline-flex items-center px-6 py-3 bg-[#86412D] text-white text-xs tracking-wider uppercase font-bold hover:bg-[#6B3323] transition-colors shadow-xs"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border/60 group"
                  >
                    <div className="relative w-20 aspect-[3/4] bg-ivory-200 overflow-hidden shrink-0 border border-border/80">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm text-charcoal-900 line-clamp-1 group-hover:text-gold-700 transition-colors">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-charcoal-400 hover:text-red-700 transition-colors ml-2"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.fabric && (
                          <span className="text-[10px] tracking-wide text-charcoal-500 block mt-0.5">
                            {item.fabric}
                          </span>
                        )}
                        <span className="text-xs font-medium text-charcoal-900 block mt-1">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center border border-border bg-ivory-100/50">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-charcoal-600 hover:text-charcoal-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs text-charcoal-900 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-charcoal-600 hover:text-charcoal-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-medium text-charcoal-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border bg-ivory-100/70 space-y-4">
                {/* Coupon Code Input */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-gold-50 border border-gold-300 text-gold-900 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-gold-700" />
                        <span className="font-semibold uppercase tracking-wider">{appliedCoupon.code}</span>
                        <span className="text-[11px] text-gold-800">(-{formatPrice(discount)})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-gold-800 hover:text-red-700 underline ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Privilege Voucher (e.g. ROYAL10)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-ivory-50 border border-border focus:outline-none focus:border-gold-500 uppercase tracking-widest placeholder:tracking-normal placeholder:normal-case"
                      />
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="px-4 py-2 bg-charcoal-800 text-ivory-100 text-xs uppercase tracking-luxury hover:bg-gold-600 transition-colors shrink-0 disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponMessage && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        couponMessage.isError ? "text-red-600" : "text-emerald-700"
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Subtotal, Shipping, Tax, Total */}
                <div className="space-y-1.5 text-xs text-charcoal-700 pt-2 border-t border-border/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-charcoal-900">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-gold-700">
                      <span>Privilege Benefit</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-charcoal-900">
                      {subtotal >= 999 ? "Free Delivery" : "₹79"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applicable GST</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border text-sm font-bold text-charcoal-950">
                    <span>Total Amount</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Secure Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#86412D] text-white text-xs tracking-wider uppercase font-bold hover:bg-[#6B3323] transition-all duration-300 group shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Pure Cotton 60×60 • Cash on Delivery Available</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

