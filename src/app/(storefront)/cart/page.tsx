"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponFeedback({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-4 text-center font-sans">
        <div className="w-16 h-16 mx-auto rounded-full bg-ivory-200 flex items-center justify-center mb-6 text-charcoal-400">
          <Tag className="w-7 h-7 stroke-[1.2]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900">Your Shopping Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-2 max-w-sm mx-auto font-light">
          No items have been added yet. Discover our handcrafted batik suits, sarees and pure cotton 60×60 collections.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block px-8 py-4 bg-terracotta text-white text-xs tracking-wider uppercase hover:bg-terracotta-dark transition-colors font-medium"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-8 pb-4 border-b border-border">
        Your Atelier Bag ({items.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items List */}
        <div className="lg:col-span-8 divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex gap-6 items-start">
              <div className="relative w-24 sm:w-28 aspect-[3/4] bg-ivory-200 shrink-0 border border-border">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-base sm:text-lg text-charcoal-900">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-charcoal-400 hover:text-red-700 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.fabric && (
                    <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block mt-1">
                      {item.fabric}
                    </span>
                  )}
                  <span className="text-sm font-medium text-charcoal-950 block mt-2">
                    {formatPrice(item.price)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2">
                  <div className="flex items-center border border-border bg-ivory-100/50">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 text-charcoal-600 hover:text-charcoal-950"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-medium text-charcoal-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 text-charcoal-600 hover:text-charcoal-950"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-semibold text-charcoal-950">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-ivory-100/70 p-6 border border-border h-fit space-y-6">
          <h2 className="font-serif text-xl text-charcoal-950 pb-3 border-b border-border">
            Order Summary
          </h2>

          {/* Coupon Code Input */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-terracotta/10 border border-terracotta/30 text-charcoal-900 text-xs">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-terracotta">{appliedCoupon.code}</span>
                  <p className="text-[10px] text-charcoal-600">Discount applied: -{formatPrice(discount)}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. VAISHIRI10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-xs bg-ivory-50 border border-border uppercase tracking-widest focus:outline-none focus:border-terracotta"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-terracotta text-white text-xs uppercase tracking-wider hover:bg-terracotta-dark transition-colors font-medium"
                >
                  Apply
                </button>
              </form>
            )}
            {couponFeedback && (
              <p className={`text-[11px] mt-1.5 ${couponFeedback.isError ? "text-red-600" : "text-emerald-700"}`}>
                {couponFeedback.text}
              </p>
            )}
          </div>

          <div className="space-y-2.5 text-xs text-charcoal-700 border-t border-border pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-charcoal-900">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-terracotta font-medium">
                <span>Coupon Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Standard Express Shipping</span>
              <span>{shipping === 0 ? "FREE (Orders > ₹999)" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Applicable GST (5%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border text-base font-semibold text-charcoal-950">
              <span>Total Amount</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 bg-terracotta text-white text-center text-xs tracking-wider uppercase hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2 font-medium shadow-md"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-500 text-center pt-2">
            <ShieldCheck className="w-4 h-4 text-terracotta" />
            <span>100% Pure Cotton 60×60 • 7-Day Easy Exchange</span>
          </div>
        </div>
      </div>
    </div>
  );
}

