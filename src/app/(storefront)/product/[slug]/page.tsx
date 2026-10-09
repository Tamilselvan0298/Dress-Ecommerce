import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/ecommerce/ProductGallery";
import { AddToBagButton } from "@/components/ecommerce/AddToBagButton";
import { WishlistButton } from "@/components/ecommerce/WishlistButton";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import ProductInteractiveSuite from "@/components/ecommerce/ProductInteractiveSuite";
import DeliveryPinChecker from "@/components/ecommerce/DeliveryPinChecker";
import SizeGuideModal from "@/components/ecommerce/SizeGuideModal";
import ProductFaqAccordion from "@/components/ecommerce/ProductFaqAccordion";
import RecentlyViewedTracker from "@/components/ecommerce/RecentlyViewedTracker";
import RecentlyViewedSection from "@/components/ecommerce/RecentlyViewedSection";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true },
  });

  if (!product) return { title: "Product Not Found - Vaishiri Clothing" };

  return {
    title: `${product.title} - Vaishiri Clothing`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} - Vaishiri Clothing`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [{ url: product.images[0]?.url || "" }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      collection: true,
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
      inventory: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from same category or collection
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      isPublished: true,
    },
    take: 4,
    include: {
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
    },
  });

  const imageUrls = product.images.map((img) => img.url);
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const savedAmount = isOnSale ? product.compareAtPrice! - product.price : 0;

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Breadcrumbs matching Avantika */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-charcoal-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <Link href="/shop" className="hover:text-charcoal-900 transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <Link
          href={`/collections/${product.category.slug}`}
          className="hover:text-charcoal-900 transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-[#86412D] font-semibold truncate max-w-[220px]">
          {product.title}
        </span>
      </nav>

      {/* LocalStorage Tracker for Recently Viewed */}
      <RecentlyViewedTracker
        item={{
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images[0]?.url || "",
        }}
      />

      {/* Interactive Main Product Layout: Gallery + Color Swatches with Instant Image Swap */}
      <ProductInteractiveSuite
        product={{
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          fabric: product.fabric,
          description: product.description,
          images: product.images,
          variants: product.variants,
          reviewsCount: product.reviews.length,
        }}
      />

      {/* Description & Full Accordion */}
      <div className="mt-14 pt-8 border-t border-[#E8E2D8] grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-xl font-normal text-charcoal-900">
            Artisan Craftsmanship & Details
          </h3>
          <p className="text-xs text-charcoal-700 leading-relaxed font-light whitespace-pre-line">
            {product.description}
          </p>
          <div className="p-4 bg-[#FAF7F2] text-xs text-charcoal-700 rounded-xs space-y-1.5 border border-[#E8E2D8]">
            <span className="font-semibold text-charcoal-900 block uppercase tracking-wider text-[11px]">
              Care & Maintenance:
            </span>
            <p>{product.careInstructions}</p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ProductFaqAccordion />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-20 pt-12 border-t border-[#E8E2D8]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-serif text-2xl text-charcoal-950 font-normal">
              Customer Reviews
            </h3>
            <div className="flex items-center gap-2 text-xs text-charcoal-600 mt-1">
              <div className="flex items-center text-[#B57359]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#B57359]" />
                ))}
              </div>
              <span className="font-semibold text-charcoal-900">5.0 out of 5 stars</span>
              <span>Based on {product.reviews.length || 1} verified review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal-900">{rev.userName}</span>
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Buyer
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#B57359]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B57359]" />
                ))}
              </div>
              <h4 className="text-xs font-semibold text-charcoal-800">{rev.title}</h4>
              <p className="text-xs text-charcoal-600 font-light leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewedSection currentProductId={product.id} />

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-14 pt-12 border-t border-[#E8E2D8]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
              You May Also Like
            </h3>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-wider text-[#86412D] hover:underline font-bold"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                slug={p.slug}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                fabric={p.fabric}
                categoryName={p.category?.name}
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
        </div>
      )}
    </div>
  );
}
