import React from "react";
import { prisma } from "@/lib/db/prisma";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { FilterSidebar } from "@/components/ecommerce/FilterSidebar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Pagination } from "@/components/ecommerce/Pagination";

export const revalidate = 60;

interface ShopPageProps {
  searchParams: {
    category?: string;
    collection?: string;
    occasion?: string;
    sort?: string;
    q?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, collection, occasion, sort, q, page: rawPage } = searchParams;
  const page = Math.max(1, parseInt(rawPage || "1", 10));
  const pageSize = 12;

  // Build filter where query
  const where: any = { isPublished: true };

  if (category) {
    where.category = { slug: category };
  }

  if (collection) {
    where.collection = { slug: collection };
  }

  if (occasion) {
    where.occasion = { contains: occasion };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { fabric: { contains: q } },
      { description: { contains: q } },
    ];
  }

  // Build sorting query
  let orderBy: any = { isFeatured: "desc" };
  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  const [totalCount, products, categories, collections] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
        collection: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.collection.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const activeCategoryObj = categories.find((c) => c.slug === category);
  const activeCollectionObj = collections.find((c) => c.slug === collection);

  return (
    <div className="pt-24 sm:pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <Link href="/shop" className="hover:text-charcoal-900 transition-colors">
          Shop
        </Link>
        {activeCategoryObj && (
          <>
            <ChevronRight className="w-3 h-3 text-charcoal-400" />
            <span className="text-[#86412D] font-semibold">{activeCategoryObj.name}</span>
          </>
        )}
      </nav>

      {/* Page Header */}
      <div className="pb-8 border-b border-[#E8E2D8] mb-10">
        <span className="text-[10px] tracking-wider uppercase text-[#86412D] font-bold block mb-1">
          Authentic Artisan Handcraft
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 font-normal">
          {activeCollectionObj?.name || activeCategoryObj?.name || "All Collections"}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-2xl font-light">
          {activeCollectionObj?.description ||
            activeCategoryObj?.description ||
            "Discover authentic handcrafted Batik suits, sarees, dresses & ethnic wear crafted with traditional artistry and pure 60×60 cotton."}
        </p>
      </div>

      {/* Catalog Layout: Filter + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          categories={categories}
          selectedCategory={category || ""}
          selectedOccasion={occasion || ""}
          sortBy={sort || "featured"}
          totalCount={totalCount}
        />

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-24 text-center">
              <h3 className="font-serif text-2xl text-charcoal-700">No creations found</h3>
              <p className="text-xs text-charcoal-500 mt-2">
                We are constantly weaving new pieces. Try clearing your filters or viewing all handlooms.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-block px-6 py-3 bg-charcoal-900 text-ivory-100 text-xs uppercase tracking-luxury hover:bg-gold-600 transition-colors"
              >
                Clear All Filters
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    slug={p.slug}
                    price={p.price}
                    compareAtPrice={p.compareAtPrice}
                    fabric={p.fabric}
                    categoryName={p.category.name}
                    primaryImage={p.images[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"}
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
                baseUrl="/shop"
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

