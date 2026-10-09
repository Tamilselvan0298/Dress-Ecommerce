"use client";

import React from "react";
import { Gem, Sparkles, RefreshCw, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Gem,
    title: "HANDPICKED STYLES",
    description: "Curated for every occasion",
  },
  {
    icon: Sparkles,
    title: "PREMIUM QUALITY",
    description: "Made with care & attention in 60×60 Cotton",
  },
  {
    icon: RefreshCw,
    title: "EASY EXCHANGE",
    description: "Shop with confidence & seamless support",
  },
  {
    icon: ShieldCheck,
    title: "5.0 GOOGLE REVIEWS",
    description: "Customer satisfaction #1 priority",
  },
];

export function AvantikaFeaturesSection() {
  return (
    <section className="py-7 sm:py-14 bg-[#F5F1EC] border-y border-[#E8E2D8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-2.5 sm:p-4 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#86412D] mb-2 sm:mb-3 shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h4 className="text-[11px] sm:text-sm font-bold text-[#86412D] tracking-wider uppercase mb-1">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-charcoal-700 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

