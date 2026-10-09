"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export function AvantikaNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] font-sans border-b border-[#E8E2D8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#86412D]/10 text-[#86412D] text-[11px] uppercase tracking-wider font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Welcome Privilege</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal mb-3">
          Join the Vaishiri Family
        </h2>

        <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto font-light leading-relaxed mb-6">
          Subscribe to receive early access to fresh artisan drop releases, styling inspirations, and <span className="font-semibold text-charcoal-900">10% OFF</span> your first order.
        </p>

        {subscribed ? (
          <div className="p-4 bg-white border border-[#86412D]/30 max-w-md mx-auto text-xs text-[#86412D] font-medium shadow-xs">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">You are subscribed!</span>
            </div>
            Use coupon code <span className="font-bold underline tracking-wider">VAISHIRI10</span> at checkout for 10% off.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full sm:flex-1 px-4 py-3 bg-white border border-[#E8E2D8] text-charcoal-900 placeholder:text-charcoal-400 text-xs focus:outline-none focus:border-[#86412D]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#86412D] text-white text-xs uppercase tracking-luxury hover:bg-[#6B3323] transition-colors font-semibold flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

