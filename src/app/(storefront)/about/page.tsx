import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Heart } from "lucide-react";

export const metadata = {
  title: "About Us - Vaishiri Clothing",
  description: "Discover Vaishiri Clothing – authentic handcrafted Batik suits, sarees, dresses & ethnic wear crafted with traditional artistry and timeless elegance.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[10px] sm:text-xs tracking-wider uppercase text-[#86412D] font-bold block mb-2">
          Our Story
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-normal leading-tight">
          Elegance in Every Thread, <br />
          <span className="italic text-[#86412D]">Artistry in Every Motif.</span>
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-4 leading-relaxed font-light">
          Discover Vaishiri Clothing – authentic handcrafted Batik suits, sarees, dresses & ethnic wear blending traditional craftsmanship with modern comfort.
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full bg-[#FAF7F2] border border-[#E8E2D8] mb-14 overflow-hidden rounded-xs">
        <Image
          src="https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_24_10_AM.png?v=1786913696&width=3840"
          alt="Vaishiri Clothing Artisan Batik Craftsmanship"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="prose prose-stone max-w-none text-charcoal-800 font-sans text-sm sm:text-base leading-relaxed space-y-5 font-light">
        <p>
          At Vaishiri Clothing, we are dedicated to celebrating the rich heritage of handcrafted Indian textiles. Our journey began with a singular passion: to make authentic wax-resist Batik, delicate hand block printing, and pure breathable cotton accessible to women who value graceful individuality over synthetic fast fashion.
        </p>
        <p>
          Every unstitched suit set in our vault is spun in high-grade <strong>Pure Cotton 60×60</strong>. This superior weave count ensures featherweight softness on the skin, natural breathability in tropical heat, and longevity wash after wash.
        </p>
        <p>
          From the intricate hand-carved copper block stamps to the multi-temperature wax resist baths and sun-bleached natural drying grounds, every piece is sculpted by human hands with immense devotion and patience.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-14 pt-6 border-t border-[#E8E2D8]">
        <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs text-center space-y-2">
          <Sparkles className="w-6 h-6 text-[#86412D] mx-auto" />
          <h3 className="font-semibold text-xs sm:text-sm text-charcoal-900">100% Handcrafted</h3>
          <p className="text-[11px] text-charcoal-600">Traditional wax resist techniques and copper block craftsmanship.</p>
        </div>
        <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs text-center space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#86412D] mx-auto" />
          <h3 className="font-semibold text-xs sm:text-sm text-charcoal-900">Cotton 60×60 Purity</h3>
          <p className="text-[11px] text-charcoal-600">Pure combed cotton providing cloud-soft breathability all day.</p>
        </div>
        <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs text-center space-y-2">
          <Heart className="w-6 h-6 text-[#86412D] mx-auto" />
          <h3 className="font-semibold text-xs sm:text-sm text-charcoal-900">Artisan Empowerment</h3>
          <p className="text-[11px] text-charcoal-600">Sustaining livelihoods of master block carvers and rural dyers.</p>
        </div>
      </div>

      <div className="p-8 bg-[#F5F1EC] border border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xs">
        <div>
          <h3 className="font-serif text-2xl text-charcoal-950 font-normal">Need Sizing or Styling Guidance?</h3>
          <p className="text-xs text-charcoal-600 mt-1">Our support team is delighted to assist you with tailoring meterage and color advice.</p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3.5 bg-[#86412D] text-white text-xs uppercase font-bold tracking-wider hover:bg-[#6B3323] transition-colors shrink-0 shadow-xs"
        >
          Contact Vaishiri Team
        </Link>
      </div>
    </div>
  );
}
