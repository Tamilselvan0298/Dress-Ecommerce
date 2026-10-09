"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is this fabric 100% pure cotton?",
    a: "Yes. All our suits are crafted from pure 60×60 combed cotton yarn, ensuring superior softness, breathability, and durability for all-day comfort even in warm climates.",
  },
  {
    q: "Will the natural batik wax dye bleed during washing?",
    a: "Our fabrics undergo fixative washing at the cluster. For best longevity, we recommend dry cleaning for the first wash or hand washing separately in cold water with mild detergent. Avoid harsh scrubbing or direct sunlight.",
  },
  {
    q: "Is Cash on Delivery (COD) available?",
    a: "Yes! Cash on Delivery is available across all serviceable pincodes in India. You can inspect your parcel and pay either by cash or UPI on delivery.",
  },
  {
    q: "What is your exchange and return policy?",
    a: "We offer an easy 7-day exchange guarantee. If there is any defect or size concern, contact our WhatsApp hotline (+91 93026 80590) or support email to initiate a doorstep exchange.",
  },
];

export default function ProductFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="pt-4 border-t border-[#E8E2D8] space-y-2">
      <h3 className="text-xs uppercase tracking-wider font-bold text-charcoal-900 mb-2">
        Frequently Asked Questions
      </h3>
      <div className="divide-y divide-[#E8E2D8] border border-[#E8E2D8] bg-[#FAF7F2]">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-3">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left text-xs font-medium text-charcoal-900"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-charcoal-500 transition-transform ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === idx && (
              <p className="mt-2 text-xs text-charcoal-600 font-light leading-relaxed">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

