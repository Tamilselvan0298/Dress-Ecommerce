"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cartContext";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Lock, CreditCard, Banknote, CheckCircle, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, discount, total, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "Radhika Mehra",
    email: "radhika.mehra@example.com",
    phone: "+91 98112 87654",
    addressLine1: "Penthouse 14B, The Amaltas Residences",
    addressLine2: "Prithviraj Road, Lutyens",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110011",
    country: "India",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "STRIPE" | "COD">("RAZORPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            fullName: formData.name,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
          },
          couponCode: appliedCoupon?.code || null,
          paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process order.");
      }

      // Order created successfully on server
      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err: any) {
      console.error("Checkout submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center font-sans">
        <h1 className="font-serif text-3xl text-charcoal-900">Your cart is empty</h1>
        <p className="text-xs text-charcoal-500 mt-2">Please add a Vaishiri creation to proceed with checkout.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mb-8">
        <span className="text-[10px] tracking-wider uppercase text-terracotta font-semibold block mb-1">
          Secure Vaishiri Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950">
          Complete Your Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckoutSubmit} className="space-y-8">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Step 1: Contact Information */}
            <div className="p-6 bg-ivory-50 border border-border space-y-4">
              <h2 className="font-serif text-xl text-charcoal-900 flex items-center justify-between">
                <span>1. Contact & Recipient</span>
                <Lock className="w-4 h-4 text-charcoal-400" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                    Phone (For Delivery SMS / WhatsApp)
                  </label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                    Email Address (For Order Confirmation & Tracking)
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="p-6 bg-ivory-50 border border-border space-y-4">
              <h2 className="font-serif text-xl text-charcoal-900">
                2. Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                    Address Line 1 (House/Flat No., Street)
                  </label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                    Address Line 2 (Apartment, Area, Landmark)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                      Postal Code (PIN)
                    </label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 block mb-1">
                    Delivery Instructions / Order Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Specific delivery instructions or requests..."
                    className="w-full px-3 py-2.5 bg-ivory-100/60 border border-border text-xs focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 bg-ivory-50 border border-border space-y-4">
              <h2 className="font-serif text-xl text-charcoal-900">
                3. Payment Method
              </h2>
              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "RAZORPAY"
                      ? "border-terracotta bg-terracotta/5"
                      : "border-border bg-ivory-100/40 hover:border-charcoal-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "RAZORPAY"}
                      onChange={() => setPaymentMethod("RAZORPAY")}
                      className="accent-terracotta"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 block">
                        Razorpay Secure (Cards, UPI, NetBanking)
                      </span>
                      <span className="text-[11px] text-charcoal-500">
                        Supports instant UPI, GPay, PhonePe, Credit/Debit cards & NetBanking
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-terracotta" />
                </label>

                <label
                  onClick={() => setPaymentMethod("STRIPE")}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "STRIPE"
                      ? "border-terracotta bg-terracotta/5"
                      : "border-border bg-ivory-100/40 hover:border-charcoal-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "STRIPE"}
                      onChange={() => setPaymentMethod("STRIPE")}
                      className="accent-terracotta"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 block">
                        Stripe Global Payments
                      </span>
                      <span className="text-[11px] text-charcoal-500">
                        Supports International Cards (Visa, Mastercard, Amex, Apple Pay)
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-terracotta" />
                </label>

                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                    paymentMethod === "COD"
                      ? "border-terracotta bg-terracotta/5"
                      : "border-border bg-ivory-100/40 hover:border-charcoal-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-terracotta"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-charcoal-500">
                        Pay with cash or UPI on doorstep delivery
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-charcoal-600" />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-terracotta text-white text-xs tracking-wider uppercase hover:bg-terracotta-dark transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              <span>{isSubmitting ? "Processing Order..." : `Place Order — ${formatPrice(total)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ivory-100/70 p-6 border border-border space-y-4">
            <h3 className="font-serif text-lg text-charcoal-950 pb-3 border-b border-border">
              Order Review ({items.length})
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map((i) => (
                <div key={i.id} className="flex gap-4 text-xs">
                  <div className="relative w-16 aspect-[3/4] bg-ivory-200 shrink-0 border border-border">
                    <Image src={i.image} alt={i.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif font-medium text-charcoal-900 line-clamp-1">
                      {i.title}
                    </h4>
                    <span className="text-[10px] text-charcoal-500 block">{i.fabric}</span>
                    <span className="text-[11px] text-charcoal-600 block mt-1">
                      Qty: {i.quantity} × {formatPrice(i.price)}
                    </span>
                  </div>
                  <span className="font-semibold text-charcoal-900">
                    {formatPrice(i.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-charcoal-700 border-t border-border pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

