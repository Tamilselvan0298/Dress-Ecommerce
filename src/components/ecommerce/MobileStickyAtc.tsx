"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cartContext";
import { ShoppingBag, Check } from "lucide-react";

interface MobileStickyAtcProps {
  productId: string;
  title: string;
  price: number;
  image: string;
  fabric: string;
}

export default function MobileStickyAtc({
  productId,
  title,
  price,
  image,
  fabric,
}: MobileStickyAtcProps) {
  const { addItem, setIsCartOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 500px on mobile
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdd = () => {
    addItem({
      productId,
      title,
      price,
      image,
      fabric,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E2D8] p-3 shadow-2xl flex items-center gap-3">
      <div className="relative w-12 h-12 bg-ivory-100 border border-[#E8E2D8] shrink-0 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-serif font-medium text-charcoal-900 truncate">
          {title}
        </h4>
        <span className="text-xs font-bold text-charcoal-950 block">
          {formatPrice(price)}
        </span>
      </div>

      <button
        onClick={handleAdd}
        className="px-4 py-2.5 bg-[#86412D] text-white text-xs uppercase tracking-wider font-bold shrink-0 flex items-center gap-1.5 hover:bg-[#6B3323] transition-colors"
      >
        {isAdded ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </>
        )}
      </button>
    </div>
  );
}

