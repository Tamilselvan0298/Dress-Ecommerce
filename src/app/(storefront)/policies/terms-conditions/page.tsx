import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions - Vaishiri Clothing",
  description: "Terms and conditions of Vaishiri Clothing online storefront.",
};

export default function TermsConditionsPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-[#86412D] font-semibold">Terms & Conditions</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-6 font-normal">
        Terms & Conditions
      </h1>

      <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 space-y-4 font-light leading-relaxed">
        <p>
          Welcome to Vaishiri Clothing (https://vaishiri.com). By accessing our website, browsing our collections, or placing an order, you agree to comply with the following terms and conditions.
        </p>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Handcrafted Variations</h3>
        <p>
          Our batik and hand-block items are crafted individually by artisans using organic wax resist and hand block printing. Slight variations in color tones, dye crackles, and print placement are the hallmarks of authentic handcrafted artistry, not defects.
        </p>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Pricing & Inventory</h3>
        <p>
          All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST taxes. We reserve the right to correct any typographical pricing errors or adjust product availability at our discretion.
        </p>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Governing Law</h3>
        <p>
          These terms and transactions conducted on this website are governed by the laws of India and subject to the exclusive jurisdiction of the courts of Mumbai/Surat.
        </p>
      </div>
    </div>
  );
}

