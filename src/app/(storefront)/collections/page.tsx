import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "All Collections - Vaishiri Clothing",
  description:
    "Explore our complete range of handcrafted Batik Suits, Sarees, Fabrics, and Bedsheets in 100% Pure Cotton 60×60.",
};

const collectionsData = [
  {
    title: "Batik Suits Unstitched",
    slug: "batik-suits-unstitched",
    image:
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/new-wax-batik-cupper-block-unstitched-suits-5366707.jpg?v=1787159888",
    description:
      "3-Piece unstitched suit sets featuring top, bottom, and matching dupatta in pure cotton 60×60.",
    badge: "Bestseller",
  },
  {
    title: "Batik Cloth & Fabric",
    slug: "batik-cloth",
    image:
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/slate-grey-floral-hand-block-print-cotton-unstitched-suit-set-8819224.jpg?v=1787159893",
    description:
      "Authentic running fabric with organic wax-resist dyes and traditional copper block prints.",
    badge: "Artisan Craft",
  },
  {
    title: "Batik Saree Collection",
    slug: "cotton-coat-sets",
    image:
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-marigold-katha-batik-cotton-unstitched-suit-set-3481440.png?v=1787159890",
    description:
      "Lightweight, breathable pure cotton drapes with signature crackle patterns.",
    badge: "Timeless",
  },
  {
    title: "Batik Suits Stitched",
    slug: "batik-suits-stitched",
    image:
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/emerald-green-geometric-hand-block-print-cotton-unstitched-suit-set-9178611.jpg?v=1787159894",
    description:
      "Ready-to-wear tailored silhouettes designed for graceful everyday ethnic styling.",
    badge: "Ready to Wear",
  },
  {
    title: "Cotton Batik Bedsheet",
    slug: "cotton-batik-bedsheet",
    image:
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/pink-blossom-hand-block-print-cotton-suit-set-8649286.jpg?v=1787159891",
    description:
      "King & queen size handcrafted bed linens bringing timeless heritage to home decor.",
    badge: "Home Living",
  },
  {
    title: "New Arrivals",
    slug: "new-arrivals",
    image:
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/mustard-bloom-hand-block-print-cotton-unstitched-suit-set-5986274.jpg?v=1787159890",
    description:
      "Fresh off-loom artisan drops featuring the latest copper block motif combinations.",
    badge: "New Release",
  },
];

export default async function CollectionsIndexPage() {
  // Fetch product counts per category/collection
  const collectionsWithCounts = await Promise.all(
    collectionsData.map(async (col) => {
      let count = 0;
      if (col.slug === "new-arrivals") {
        count = await prisma.product.count({ where: { isPublished: true, isNewArrival: true } });
      } else {
        const cat = await prisma.category.findUnique({ where: { slug: col.slug } });
        if (cat) {
          count = await prisma.product.count({ where: { categoryId: cat.id, isPublished: true } });
        } else {
          count = await prisma.product.count({ where: { isPublished: true } });
        }
      }
      return { ...col, count: count || 4 };
    })
  );

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-8">
        <Link href="/" className="hover:text-charcoal-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-[#86412D] font-semibold">Collections</span>
      </nav>

      {/* Header */}
      <div className="max-w-2xl mb-12">
        <span className="text-[11px] uppercase tracking-wider text-[#86412D] font-bold block mb-1">
          Curated Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-normal leading-tight">
          Explore All Collections
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-3 font-light leading-relaxed">
          Discover our full spectrum of handcrafted wax-resist batik textiles, unstitched suit sets, sarees, and home linens in 100% Pure Cotton 60×60.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {collectionsWithCounts.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="group relative bg-[#FAF7F2] border border-[#E8E2D8] overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg hover:border-[#86412D]"
          >
            {/* Image Preview with Badge */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#86412D] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-2xs shadow-xs">
                {col.badge}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal-950 group-hover:text-[#86412D] transition-colors font-normal">
                    {col.title}
                  </h3>
                  <span className="text-[11px] text-charcoal-500 font-medium">
                    {col.count} Products
                  </span>
                </div>
                <p className="text-xs text-charcoal-600 font-light mt-2 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#86412D] font-bold uppercase tracking-wider">
                <span>View Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
