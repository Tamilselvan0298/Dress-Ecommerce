import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-luxury text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Atelier</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-gold-700 font-semibold">Shipping Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-6">
        White-Glove Shipping & Transit Policy
      </h1>

      <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 space-y-4 font-light leading-relaxed">
        <p>
          At Vaishiri, every handcrafted creation is carefully packaged to protect delicate natural cotton, dyes, and artisanal details during transit.
        </p>
        <h3 className="font-serif text-lg text-charcoal-900 pt-2 font-semibold">Domestic Delivery (India)</h3>
        <p>
          We partner with Blue Dart Couture Express to deliver insured, tamper-evident sealed packages directly to your door. Orders above ₹25,000 enjoy complimentary white-glove express shipping. Standard domestic delivery timeline is 2 to 4 business days from the moment of dispatch.
        </p>
        <h3 className="font-serif text-lg text-charcoal-900 pt-2 font-semibold">International Shipping</h3>
        <p>
          Worldwide delivery is facilitated through DHL Express across the United States, UAE, United Kingdom, Singapore, and Australia. Transit typically takes 4 to 7 business days. Import duties and local tariffs are handled transparently upon entry according to territorial regulations.
        </p>
        <h3 className="font-serif text-lg text-charcoal-900 pt-2 font-semibold">Tamper-Proof Verification</h3>
        <p>
          All deliveries arrive in serialized tamper-evident security bags. Do not accept any delivery if the outer serial seal appears broken or modified.
        </p>
      </div>
    </div>
  );
}

