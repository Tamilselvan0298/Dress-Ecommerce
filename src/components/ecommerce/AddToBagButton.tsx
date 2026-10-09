"use client";

import React, { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/store/cartContext";

interface AddToBagButtonProps {
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  image: string;
  fabric?: string;
  className?: string;
}

export function AddToBagButton({
  productId,
  variantId,
  title,
  price,
  image,
  fabric,
  className,
}: AddToBagButtonProps) {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = () => {
    addItem({
      productId,
      variantId,
      title,
      price,
      image,
      fabric,
      quantity: 1,
    });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-4 px-6 bg-charcoal-900 text-ivory-100 hover:bg-gold-600 transition-all duration-300 font-sans text-xs tracking-luxury uppercase flex items-center justify-center gap-2 group shadow-lg active:scale-[0.99] ${className}`}
    >
      {isSuccess ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added to Atelier Bag</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Add to Bag</span>
        </>
      )}
    </button>
  );
}

