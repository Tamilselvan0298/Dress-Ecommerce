"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/ecommerce/ProductGallery";
import { AddToBagButton } from "@/components/ecommerce/AddToBagButton";
import { WishlistButton } from "@/components/ecommerce/WishlistButton";
import DeliveryPinChecker from "@/components/ecommerce/DeliveryPinChecker";
import SizeGuideModal from "@/components/ecommerce/SizeGuideModal";
import MobileStickyAtc from "@/components/ecommerce/MobileStickyAtc";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";

export interface VariantData {
  id: string;
  title: string;
  sku: string;
  color: string;
  colorHex: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  image?: string | null;
}

export interface ProductData {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  fabric: string;
  description: string;
  images: Array<{ id: string; url: string; alt?: string }>;
  variants: VariantData[];
  reviewsCount: number;
}

interface ProductInteractiveSuiteProps {
  product: ProductData;
}

export default function ProductInteractiveSuite({ product }: ProductInteractiveSuiteProps) {
  // 1. Gather all unique image URLs, ensuring variant images are included
  const allImages = useMemo(() => {
    const urls: string[] = product.images.map((img) => img.url);
    product.variants.forEach((v) => {
      if (v.image && !urls.includes(v.image)) {
        urls.push(v.image);
      }
    });
    return urls.length > 0
      ? urls
      : [
          "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/marble-print-tie-dye-cotton-suit-set-unstitched-8692842.jpg?v=1787159890",
        ];
  }, [product.images, product.variants]);

  // 2. Active variant & image state
  const [selectedVariant, setSelectedVariant] = useState<VariantData | null>(
    product.variants[0] || null
  );

  // Active gallery index
  const initialIndex = useMemo(() => {
    if (selectedVariant?.image) {
      const idx = allImages.indexOf(selectedVariant.image);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  }, [allImages, selectedVariant]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(initialIndex);

  // 3. Color click handler: Immediately switches gallery to this color's photo!
  const handleColorClick = (variant: VariantData) => {
    setSelectedVariant(variant);

    if (variant.image) {
      const targetIndex = allImages.indexOf(variant.image);
      if (targetIndex !== -1) {
        setActiveImageIndex(targetIndex);
      }
    }
  };

  // Pricing based on selected variant
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentCompareAtPrice = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const isOnSale = Boolean(currentCompareAtPrice && currentCompareAtPrice > currentPrice);
  const savedAmount = isOnSale && currentCompareAtPrice ? currentCompareAtPrice - currentPrice : 0;

  const currentImage = allImages[activeImageIndex] || allImages[0];

  const isMultiColor =
    selectedVariant?.colorHex?.toLowerCase() === "multicolor" ||
    selectedVariant?.color?.toLowerCase().includes("multi") ||
    selectedVariant?.title?.toLowerCase().includes("multi");

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery with animated transition */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={allImages}
            productTitle={product.title}
            externalActiveIndex={activeImageIndex}
            onSelectImageIndex={setActiveImageIndex}
          />
        </div>

        {/* Right Column: Details & Purchase Suite */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-5">
          <div>
            {/* Vendor & Rating */}
            <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
              <span className="uppercase tracking-widest text-[#86412D] font-bold text-[10px]">
                Vaishiri Clothing
              </span>
              <div className="flex items-center gap-1 text-[#B57359]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B57359]" />
                ))}
                <span className="text-[11px] text-charcoal-600 ml-1 font-semibold">
                  5.0 ({product.reviewsCount || 18} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal leading-snug">
              {product.title}
            </h1>

            {/* Price section with Sale Badge & Saved amount */}
            <div className="mt-3 flex items-center flex-wrap gap-2.5">
              <span className="text-2xl font-sans text-charcoal-950 font-bold">
                {formatPrice(currentPrice)}
              </span>
              {isOnSale && (
                <>
                  <span className="text-sm font-sans text-charcoal-400 line-through">
                    {formatPrice(currentCompareAtPrice!)}
                  </span>
                  <span className="px-2 py-0.5 bg-[#86412D] text-white text-[10px] uppercase font-bold tracking-wider rounded-2xs">
                    Sale
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">
                    Save {formatPrice(savedAmount)}
                  </span>
                </>
              )}
            </div>

            <p className="text-[11px] text-charcoal-500 mt-1">
              Inclusive of all taxes. Free shipping on orders above ₹999.
            </p>
          </div>

          {/* Color & Multi-Color Swatches Selector */}
          {product.variants.length > 0 && (
            <div className="p-4 bg-white border border-[#E8E2D8] rounded-xs space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
                    Color:
                  </span>
                  <span className="font-serif text-sm font-bold text-[#86412D]">
                    {selectedVariant?.color || "Standard"}
                  </span>
                  {isMultiColor && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-2xs shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      Multi-Color
                    </span>
                  )}
                </div>

                {selectedVariant && (
                  <span
                    className={`text-[11px] font-medium ${
                      selectedVariant.stock <= 5
                        ? "text-red-700 font-bold"
                        : "text-emerald-700"
                    }`}
                  >
                    {selectedVariant.stock <= 5
                      ? `Only ${selectedVariant.stock} left in stock`
                      : "In Stock"}
                  </span>
                )}
              </div>

              {/* Swatches List */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isMulti =
                    v.colorHex?.toLowerCase() === "multicolor" ||
                    v.color?.toLowerCase().includes("multi") ||
                    v.title?.toLowerCase().includes("multi");

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleColorClick(v)}
                      className={`group relative p-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-[#86412D] scale-110"
                          : "opacity-80 hover:opacity-100 hover:scale-105"
                      }`}
                      title={`${v.color} - Click to view image`}
                    >
                      {/* Color Circle Swatch */}
                      <span
                        className="block w-8 h-8 rounded-full border border-charcoal-300 shadow-sm relative overflow-hidden flex items-center justify-center transition-transform"
                        style={{
                          background: isMulti
                            ? "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)"
                            : v.colorHex || "#86412D",
                        }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 drop-shadow-md ${
                              v.colorHex === "#FFFFFF" || v.colorHex === "#F5F2EB"
                                ? "text-charcoal-900"
                                : "text-white"
                            }`}
                          />
                        )}
                      </span>

                      {/* Tooltip on hover */}
                      <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-charcoal-950 text-white text-[10px] px-2 py-0.5 rounded-2xs opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md">
                        {v.color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Specifications Box with Size Guide */}
          <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs space-y-2 text-xs text-charcoal-800">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-1.5">
              <span className="text-charcoal-500">Fabric Composition:</span>
              <span className="font-semibold text-charcoal-900">{product.fabric}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-1.5">
              <span className="text-charcoal-500">Suit Type:</span>
              <span className="font-semibold text-charcoal-900">Unstitched 3-Piece Set</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-1.5">
              <span className="text-charcoal-500">Top & Bottom Length:</span>
              <span className="font-semibold text-charcoal-900">2.50 Meters Each</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-charcoal-500">Dupatta Length:</span>
              <span className="font-semibold text-charcoal-900">2.25 Meters Cotton Dupatta</span>
            </div>
            <div className="pt-1 border-t border-[#E8E2D8] flex justify-end">
              <SizeGuideModal />
            </div>
          </div>

          {/* Action Buttons: Add to Bag & Buy Now */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <AddToBagButton
                  productId={product.id}
                  variantId={selectedVariant?.id}
                  title={
                    selectedVariant
                      ? `${product.title} - ${selectedVariant.color}`
                      : product.title
                  }
                  price={currentPrice}
                  image={currentImage}
                  fabric={product.fabric}
                />
              </div>
              <WishlistButton
                productId={product.id}
                title={product.title}
                image={currentImage}
                className="h-full py-3 px-3.5 border border-charcoal-300"
              />
            </div>

            <Link
              href="/checkout"
              className="block w-full py-3.5 bg-[#86412D] text-white hover:bg-[#6B3323] text-center text-xs tracking-wider uppercase font-bold transition-colors shadow-sm"
            >
              Buy It Now — Cash on Delivery Available
            </Link>
          </div>

          {/* Indian Postal PIN Delivery Checker */}
          <DeliveryPinChecker />

          {/* Trust Guarantees */}
          <div className="p-4 bg-white border border-[#E8E2D8] space-y-2.5 text-xs text-charcoal-700">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#86412D] shrink-0" />
              <span>
                <strong>Free Delivery:</strong> Dispatched in 24 hours. Estimated 3-5 days.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#86412D] shrink-0" />
              <span>
                <strong>Easy 7-Day Exchange:</strong> Hassle-free return & replacement policy.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#86412D] shrink-0" />
              <span>
                <strong>100% Authentic Handcraft:</strong> Tested pure cotton & organic batik dyes.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart synchronizing with active color & image */}
      <MobileStickyAtc
        productId={product.id}
        title={
          selectedVariant
            ? `${product.title} - ${selectedVariant.color}`
            : product.title
        }
        price={currentPrice}
        image={currentImage}
        fabric={product.fabric}
      />
    </>
  );
}

