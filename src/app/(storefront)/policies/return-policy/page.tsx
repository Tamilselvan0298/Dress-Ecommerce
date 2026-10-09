import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Return & Exchange Policy - Vaishiri Clothing",
  description: "Easy 7-day return and exchange policy of Vaishiri Clothing.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-[#86412D] font-semibold">Return & Exchange Policy</span>
      </nav>

      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 mb-6 font-normal">
        Easy 7-Day Exchange Policy
      </h1>

      <div className="prose prose-stone text-xs sm:text-sm text-charcoal-700 space-y-4 font-light leading-relaxed">
        <p>
          At Vaishiri Clothing, customer satisfaction is our highest priority. We want you to feel completely confident when shopping our handcrafted ethnic wear.
        </p>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">Eligibility for Exchange</h3>
        <p>
          You may request an exchange within <strong>7 days of delivery</strong> under the following conditions:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>The product must be unused, unwashed, and in its original fold with all brand tags intact.</li>
          <li>For unstitched suit sets, the fabric must remain uncut. Once cut or stitched by a tailor, items cannot be exchanged.</li>
          <li>In the rare event that an item arrives with a transit damage or manufacturing flaw, please notify us within 48 hours of delivery along with a photo.</li>
        </ul>

        <h3 className="text-sm font-bold text-charcoal-900 pt-2 uppercase tracking-wide">How to Initiate an Exchange</h3>
        <p>
          Simply email us at <strong>care@vaishiri.com</strong> or WhatsApp our hotline at <strong>+91 98765 43210</strong> with your Order Number and photos of the item. Our support executive will arrange a doorstep reverse pickup for you.
        </p>
      </div>
    </div>
  );
}

