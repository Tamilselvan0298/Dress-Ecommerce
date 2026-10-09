"use client";

import React, { useState } from "react";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { QuickViewModal, QuickViewProduct } from "./QuickViewModal";

interface ProductGridProps {
  products: ProductCardProps[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [activeQuickView, setActiveQuickView] = useState<QuickViewProduct | null>(null);

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="font-serif text-2xl text-charcoal-700">No creations found</h3>
        <p className="text-xs text-charcoal-500 mt-2 font-sans">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onQuickView={() =>
              setActiveQuickView({
                id: product.id,
                title: product.title,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                fabric: product.fabric,
                description: "Handcrafted pure silk drape with certified authentic zari and generational artisan weaving.",
                images: [
                  product.primaryImage,
                  product.secondaryImage || product.primaryImage,
                ],
              })
            }
          />
        ))}
      </div>

      <QuickViewModal
        product={activeQuickView}
        onClose={() => setActiveQuickView(null)}
      />
    </>
  );
}
