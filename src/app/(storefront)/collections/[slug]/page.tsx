import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { ChevronRight, Sparkles, ArrowLeft } from "lucide-react";

import { Pagination } from "@/components/ecommerce/Pagination";

interface CollectionPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  if (params.slug === "all") {
    return {
      title: "All Handcrafted Collections - Vaishiri Clothing",
      description: "Explore all authentic handcrafted Batik suits, sarees, and ethnic wear in pure cotton 60x60.",
    };
  }

  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
  });

  if (collection) {
    return {
      title: `${collection.name} - Vaishiri Clothing`,
      description: collection.description || collection.tagline || "Authentic handcrafted Batik clothing.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (category) {
    return {
      title: `${category.name} - Vaishiri Clothing`,
      description: category.description || "Authentic handcrafted Batik clothing.",
    };
  }

  return {
    title: "Collection Not Found - Vaishiri Clothing",
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  let name = "";
  let tagline = "";
  let description = "";
  let bannerImage = "https://avantikaclothing.com/cdn/shop/files/ChatGPT_Image_Aug_17_2026_02_03_00_AM.png?v=1786912868&width=3840";
  let products: any[] = [];

  if (params.slug === "all") {
    name = "Shop All Products";
    tagline = "Handcrafted with Traditional Artistry & Timeless Elegance";
    description = "Browse our complete catalog of authentic wax batik, copper block print unstitched suit sets, sarees, and meterage fabrics.";
    products = await prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
  } else {
    // 1. Check collection
    const collection = await prisma.collection.findUnique({
      where: { slug: params.slug },
      include: {
        products: {
          where: { isPublished: true },
          include: {
            category: true,
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
      },
    });

    if (collection) {
      name = collection.name;
      tagline = collection.tagline || "";
      description = collection.description || "";
      bannerImage = collection.bannerImage || bannerImage;
      products = collection.products;
    } else {
      // 2. Check category
      const category = await prisma.category.findUnique({
        where: { slug: params.slug },
        include: {
          products: {
            where: { isPublished: true },
            include: {
              category: true,
              images: { orderBy: { displayOrder: "asc" } },
            },
          },
        },
      });

      if (category) {
        name = category.name;
        tagline = "Artisan Craftsmanship & Pure Cotton 60×60";
        description = category.description || "";
        bannerImage = category.image || bannerImage;
        products = category.products;
      } else {
        notFound();
      }
    }
  }

  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const pageSize = 12;
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="pt-24 pb-20 font-sans">
      {/* Editorial Hero Banner */}
      <div className="relative min-h-[42vh] sm:min-h-[50vh] flex items-center justify-center text-center overflow-hidden bg-charcoal-950 px-4">
        <Image
          src={bannerImage}
          alt={name}
          fill
          priority
          className="object-cover opacity-45 scale-102"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto py-12 sm:py-16">
          <nav className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/80 mb-4 bg-black/60 px-3.5 py-1 backdrop-blur-xs border border-white/10 rounded-xs">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C47B69]" />
            <Link href="/shop" className="hover:text-white transition-colors">
              Collections
            </Link>
            <ChevronRight className="w-3 h-3 text-[#C47B69]" />
            <span className="text-white font-semibold">{name}</span>
          </nav>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-3">
            {name}
          </h1>

          {tagline && (
            <p className="font-sans text-xs sm:text-base text-gold-200 font-light max-w-lg mx-auto mb-3">
              {tagline}
            </p>
          )}

          {description && (
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light leading-relaxed">
              {description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#C47B69]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase text-[11px] font-semibold tracking-wider text-white">
              {products.length} Handcrafted Pieces Available
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8] mb-8 sm:mb-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-charcoal-700 hover:text-[#86412D] transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Collections</span>
          </Link>
          <span className="text-xs text-charcoal-500 font-medium">
            100% Pure Cotton 60×60 • Free Delivery Above ₹999
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl text-charcoal-800">Fresh Pieces Currently Being Dyed</h3>
            <p className="text-xs text-charcoal-500 mt-2 max-w-md mx-auto">
              Our artisans are currently crafting new items for this collection. Explore pieces across our other collections.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block px-6 py-3 bg-[#86412D] text-white text-xs uppercase font-bold tracking-wider hover:bg-[#6B3323] transition-colors"
            >
              Browse Complete Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  slug={p.slug}
                  price={p.price}
                  compareAtPrice={p.compareAtPrice}
                  fabric={p.fabric}
                  categoryName={p.category?.name || name}
                  primaryImage={
                    p.images[0]?.url ||
                    "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-marigold-katha-batik-cotton-unstitched-suit-set-3481440.png?v=1787159890"
                  }
                  secondaryImage={p.images[1]?.url}
                  isNewArrival={p.isNewArrival}
                  isBestseller={p.isBestseller}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              baseUrl={`/collections/${params.slug}`}
              searchParams={searchParams}
            />
          </div>
        )}
      </div>
    </div>
  );
}
