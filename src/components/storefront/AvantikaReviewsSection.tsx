"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  product: string;
  review: string;
  date: string;
}

const REVIEWS: Testimonial[] = [
  {
    id: "1",
    name: "Ananya Deshmukh",
    location: "Pune, Maharashtra",
    rating: 5,
    product: "Ruby Marigold Katha Batik Cotton Unstitched Suit Set",
    review: "The cotton 60×60 fabric is so soft and lightweight! The wax batik crackle effect is authentic handcraft, not machine printed. Dupatta length is very generous.",
    date: "2 days ago",
  },
  {
    id: "2",
    name: "Meera Nair",
    location: "Bengaluru, Karnataka",
    rating: 5,
    product: "Cotton Hand Batik Block Print Suit Unstitched Set",
    review: "Received my parcel within 3 days. The colors are even more graceful in person than on photos. Best online store for genuine batik ethnic wear!",
    date: "1 week ago",
  },
  {
    id: "3",
    name: "Sumanthika Roy",
    location: "Kolkata, West Bengal",
    rating: 5,
    product: "Slate Grey Floral Hand Block Print Cotton Suit",
    review: "Got stitched with straight pants and received countless compliments at my office gathering. Doesn't bleed color on washing. Pure 100% cotton.",
    date: "2 weeks ago",
  },
];

export function AvantikaReviewsSection() {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-[#E8E2D8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1.5 text-[#B57359] mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#B57359]" />
            ))}
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-950 font-normal">
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 font-light">
            Rated <span className="font-semibold text-charcoal-950">5.0 / 5.0</span> based on 250+ verified customer experiences across India
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] p-6 sm:p-7 border border-[#E8E2D8] rounded-xs flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-[#B57359] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B57359]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed italic mb-4">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D8]/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-charcoal-900">{rev.name}</span>
                  <span className="text-[11px] text-charcoal-500">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#86412D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#86412D]" />
                  <span>Verified Buyer • {rev.location}</span>
                </div>
                <p className="text-[11px] text-charcoal-500 line-clamp-1">
                  Item: {rev.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

