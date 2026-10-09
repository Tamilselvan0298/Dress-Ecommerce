"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

const instagramPosts = [
  {
    id: 1,
    image: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/new-wax-batik-cupper-block-unstitched-suits-5366707.jpg?v=1787159888",
    handle: "@vaishiri",
    caption: "The charm of authentic copper block wax batik in pure 60x60 cotton.",
  },
  {
    id: 2,
    image: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/pink-blossom-hand-block-print-cotton-suit-set-8649286.jpg?v=1787159891",
    handle: "@vaishiri",
    caption: "Pastel blush pink hues crafted for effortless elegance.",
  },
  {
    id: 3,
    image: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/emerald-green-geometric-hand-block-print-cotton-unstitched-suit-set-9178611.jpg?v=1787159894",
    handle: "@vaishiri",
    caption: "Geometric precision meets hand-carved heritage blocks.",
  },
  {
    id: 4,
    image: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/slate-grey-floral-hand-block-print-cotton-unstitched-suit-set-8819224.jpg?v=1787159893",
    handle: "@vaishiri",
    caption: "Subtle slate grey with contrasting flow dupatta.",
  },
  {
    id: 5,
    image: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-marigold-katha-batik-cotton-unstitched-suit-set-3481440.png?v=1787159890",
    handle: "@vaishiri",
    caption: "Wax crackle textures crafted one meter at a time.",
  },
  {
    id: 6,
    image: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-red-hand-block-print-cotton-unstitched-suit-set-6343600.jpg?v=1787159890",
    handle: "@vaishiri",
    caption: "Festive ruby reds ready to be tailored to your silhouette.",
  },
];

export default function AvantikaInstagramGallery() {
  return (
    <section className="py-16 bg-ivory-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-wider text-terracotta font-semibold block mb-1">
            Follow Our Journey
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
            @vaishiri on Instagram
          </h2>
          <p className="text-xs text-charcoal-500 mt-2 font-light">
            Tag us to be featured on our feed • Handcrafted with love in Madhya Pradesh
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href="https://instagram.com/vaishiri_clothing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[3/4] overflow-hidden bg-ivory-200 border border-border"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white text-center">
                <Instagram className="w-5 h-5 mb-2 text-white" />
                <span className="text-[10px] font-medium tracking-wider">VIEW POST</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

