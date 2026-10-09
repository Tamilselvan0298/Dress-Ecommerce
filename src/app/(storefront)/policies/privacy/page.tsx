import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-luxury text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Atelier</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-gold-700 font-semibold">Privacy Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-6">
        Client Privacy & Data Discretion Policy
      </h1>

      <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 space-y-4 font-light leading-relaxed">
        <p>
          Vaishiri Clothing treats client discretion and personal data security with uncompromising reverence. We will never monetize, lease, or distribute your bridal dates, measurement profiles, contact information, or purchasing histories to third-party advertisers.
        </p>
        <h3 className="font-serif text-lg text-charcoal-900 pt-2 font-semibold">Secure Payment Encryption</h3>
        <p>
          All credit card and banking credentials are processed directly through PCI-DSS Level 1 certified gateways (Razorpay and Stripe). Vaishiri servers never view, store, or transmit your unencrypted credit card numbers or security CVVs.
        </p>
        <h3 className="font-serif text-lg text-charcoal-900 pt-2 font-semibold">Concierge Communications</h3>
        <p>
          We contact you strictly regarding order fulfillment, delivery tracking, and invitations to private salon releases if opted-in. You may opt out of salon communiqués at any time.
        </p>
      </div>
    </div>
  );
}

