import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ReturnsPolicyPage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-luxury text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Atelier</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-gold-700 font-semibold">Returns & Exchanges</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-6">
        Returns, Authentication & Exchange Guarantee
      </h1>

      <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 space-y-4 font-light leading-relaxed">
        <p>
          Each Vaishiri creation is an artisanal, one-of-a-kind handcrafted piece that undergoes a rigorous inspection prior to sealing.
        </p>
        <h3 className="font-serif text-lg text-charcoal-900 pt-2 font-semibold">7-Day Nuptial Exchange Guarantee</h3>
        <p>
          If for any reason you wish to exchange your unused drape for an alternative weave or colorway, you may notify our concierge within 7 calendar days of receipt. The piece must remain completely unworn, with intact Silk Mark security tags, unstitched blouse piece in original condition, and original muslin wrapping.
        </p>
        <h3 className="font-serif text-lg text-charcoal-900 pt-2 font-semibold">Bespoke Orders & Stitched Blouses</h3>
        <p>
          Custom tailored Ready-to-Wear pre-stitched pleating or customized blouse cuts are hand-tailored to individual measurements and are therefore non-returnable once work has commenced.
        </p>
      </div>
    </div>
  );
}

