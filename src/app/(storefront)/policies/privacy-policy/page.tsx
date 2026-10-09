import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Vaishiri Clothing",
  description: "Privacy and data protection policy of Vaishiri Clothing.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-[#86412D] font-semibold">Privacy Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-6 font-normal">
        Privacy Policy
      </h1>

      <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 space-y-4 font-light leading-relaxed">
        <p>
          At Vaishiri Clothing (https://vaishiri.com), we respect your privacy and are committed to protecting any personal information you share with us.
        </p>
        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Information We Collect</h3>
        <p>
          We collect your name, shipping address, contact phone number, email address, and order transaction details solely to fulfill your purchases, deliver parcels safely, and provide customer support.
        </p>
        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Payment Security</h3>
        <p>
          All electronic transactions are processed through encrypted 256-bit SSL secured payment partners (Razorpay / Stripe / UPI). We never store or view your credit card details or bank account passwords.
        </p>
        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Contact</h3>
        <p>
          For any questions concerning privacy or data deletion requests, contact us at <strong>care@vaishiri.com</strong>.
        </p>
      </div>
    </div>
  );
}

