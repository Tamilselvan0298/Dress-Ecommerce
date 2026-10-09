import React from "react";
import { prisma } from "@/lib/db/prisma";
import { AvantikaHeroSlideshow } from "@/components/storefront/AvantikaHeroSlideshow";
import { AvantikaFeaturesSection } from "@/components/storefront/AvantikaFeaturesSection";
import { AvantikaNewArrivalsSlider } from "@/components/storefront/AvantikaNewArrivalsSlider";
import { AvantikaCollectionsSection } from "@/components/storefront/AvantikaCollectionsSection";
import { AvantikaFeaturedCatalog } from "@/components/storefront/AvantikaFeaturedCatalog";
import { AvantikaHeritageStory } from "@/components/storefront/AvantikaHeritageStory";
import { AvantikaReviewsSection } from "@/components/storefront/AvantikaReviewsSection";
import { AvantikaNewsletter } from "@/components/storefront/AvantikaNewsletter";
import AvantikaInstagramGallery from "@/components/storefront/AvantikaInstagramGallery";
import RecentlyViewedSection from "@/components/ecommerce/RecentlyViewedSection";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // Fetch real Avantika products from the database
  const allProducts = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  const formattedProducts = allProducts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    fabric: p.fabric,
    categoryName: p.category.name,
    primaryImage:
      p.images[0]?.url ||
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/ruby-marigold-katha-batik-cotton-unstitched-suit-set-3481440.png?v=1787159890",
    secondaryImage: p.images[1]?.url || null,
    isNewArrival: p.isNewArrival,
    isBestseller: p.isBestseller,
  }));

  const newArrivals = formattedProducts.filter((p) => p.isNewArrival);

  return (
    <div className="bg-white text-charcoal-900 overflow-hidden font-sans pt-[106px] sm:pt-[116px] lg:pt-[122px]">
      {/* 1. HERO SLIDESHOW MATCHING AVANTIKA CLOTHING */}
      <AvantikaHeroSlideshow />

      {/* 2. TRUST FEATURES GRID (HANDPICKED STYLES, PREMIUM QUALITY, EASY EXCHANGE, 5.0 GOOGLE REVIEWS) */}
      <AvantikaFeaturesSection />

      {/* 3. NEW ARRIVALS HORIZONTAL PRODUCT SLIDER */}
      <AvantikaNewArrivalsSlider
        products={newArrivals.length > 0 ? newArrivals : formattedProducts.slice(0, 8)}
      />

      {/* 4. COLLECTIONS SWIPER GALLERY */}
      <AvantikaCollectionsSection />

      {/* 5. NEW COLLECTION (TABBED COMPLETE CATALOG GRID) */}
      <AvantikaFeaturedCatalog products={formattedProducts} />

      {/* 6. ARTISANAL HERITAGE & WAX BATIK STORY */}
      <AvantikaHeritageStory />

      {/* 7. CUSTOMER REVIEWS & TESTIMONIALS (JUDGE.ME 5.0 RATING) */}
      <AvantikaReviewsSection />

      {/* 8. INSTAGRAM SOCIAL GALLERY */}
      <AvantikaInstagramGallery />

      {/* 9. RECENTLY VIEWED PRODUCTS */}
      <RecentlyViewedSection />

      {/* 10. NEWSLETTER PRIVILEGE BANNER */}
      <AvantikaNewsletter />
    </div>
  );
}
