"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function AvantikaHeritageStory() {
  return (
    <section className="py-16 sm:py-24 bg-[#F5F1EC] font-sans border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Media Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden shadow-lg border border-[#E8E2D8]">
              <Image
                src="https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_14_2026_02_05_11_PM.png?v=1786696562&width=1500"
                alt="Artisan Handcrafted Wax Batik"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Floating Trust Badge */}
            <div className="absolute bottom-3 right-3 sm:-bottom-8 sm:right-6 bg-white p-3.5 sm:p-5 rounded-md shadow-xl border border-[#E8E2D8] max-w-[190px] sm:max-w-[220px]">
              <span className="text-[10px] uppercase tracking-wider text-[#86412D] font-bold block">
                Artisan Handloom
              </span>
              <p className="font-serif text-base sm:text-lg text-charcoal-950 font-normal leading-tight mt-1">
                Pure Cotton 60×60 Weave
              </p>
              <span className="text-[10px] sm:text-[11px] text-charcoal-600 block mt-1">
                Zero synthetic fibers.
              </span>
            </div>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-luxury text-[#86412D] font-bold block mb-2">
                The Vaishiri Promise
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-950 leading-tight">
                Authentic Batik Artistry, <br />
                <span className="italic font-normal text-[#86412D]">Crafted By Human Hands.</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
              At Vaishiri, we believe true luxury lives in authenticity. Every unstitched suit set and flowing dupatta is brought to life using traditional melted wax dipping, hand-carved copper blocks, and cracked dye baths across India&apos;s master artisan clusters.
            </p>

            {/* Quality Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#86412D]/10 text-[#86412D] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900">
                    Hand-Pressed Copper Block & Wax Resist
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal-600 mt-0.5">
                    Authentic organic crackle veins that cannot be replicated by digital machine printers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#86412D]/10 text-[#86412D] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900">
                    Generous 3-Piece Meterage for Bespoke Tailoring
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal-600 mt-0.5">
                    2.50m top, 2.50m bottom, and 2.25m flowing cotton dupatta for customized fit up to 5XL.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#86412D]/10 text-[#86412D] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal-900">
                    Direct Artisan Support & Fair Wages
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal-600 mt-0.5">
                    Your purchase directly preserves generations of indigenous Indian handicraft traditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-[#86412D] hover:text-[#4A190B] font-bold"
              >
                <span>Read Our Heritage Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

