import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Shipping Policy - Vaishiri Clothing",
  description: "Shipping and delivery policy of Vaishiri Clothing.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-[#86412D] font-semibold">Shipping Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-6 font-normal">
        Shipping & Delivery Policy
      </h1>

      <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 space-y-4 font-light leading-relaxed">
        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Free Shipping Threshold</h3>
        <p>
          We offer <strong>Free Standard Shipping on all orders above ₹999</strong> across all serviceable pincodes in India. For orders below ₹999, a nominal flat shipping fee of ₹79 applies.
        </p>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Dispatch & Delivery Timeline</h3>
        <p>
          All unstitched suit sets and batik fabrics are thoroughly quality-checked and dispatched within <strong>24 to 48 business hours</strong> from our central hub. Delivery generally takes <strong>3 to 5 business days</strong> for metro cities and <strong>5 to 7 business days</strong> for rest of India.
        </p>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Cash on Delivery (COD)</h3>
        <p>
          Cash on Delivery is available across most Indian postal codes. Please keep the exact cash amount ready upon arrival of the delivery associate.
        </p>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Order Tracking</h3>
        <p>
          Once your package is handed over to our courier partner (Blue Dart / Delhivery / Xpressbees), a real-time tracking link and SMS update will be sent directly to your registered phone number and email address.
        </p>
      </div>
    </div>
  );
}

