"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  image: string;
  fabric?: string;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // UI state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Hydration state
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("vaishiri_cart") || localStorage.getItem("avantika_cart") || localStorage.getItem("avanya_cart");
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("vaishiri_wishlist") || localStorage.getItem("avantika_wishlist") || localStorage.getItem("avanya_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCoupon = localStorage.getItem("vaishiri_coupon") || localStorage.getItem("avantika_coupon") || localStorage.getItem("avanya_coupon");
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch {
      // Fallback
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("vaishiri_cart", JSON.stringify(items));
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("vaishiri_wishlist", JSON.stringify(wishlist));
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (appliedCoupon) {
      localStorage.setItem("vaishiri_coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("vaishiri_coupon");
    }
  }, [appliedCoupon, isHydrated]);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [
        ...prev,
        {
          ...newItem,
          id: `${newItem.productId}-${newItem.variantId || "default"}-${Date.now()}`,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Dynamic calculations:
  // Vaishiri Clothing Policy: Free shipping on orders above ₹999, else standard flat ₹79
  const shipping = subtotal > 0 && subtotal < 999 ? 79 : 0;
  // Indian GST for textiles (5% standard rate)
  const tax = Math.round(subtotal * 0.05);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
    // Cap discount to subtotal
    discount = Math.min(discount, subtotal);
  }

  const total = Math.max(0, subtotal - discount + shipping + tax);

  const applyCoupon = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "VAISHIRI10" || trimmed === "AVANTIKA10" || trimmed === "ROYAL10") {
      if (subtotal < 899) {
        return { success: false, message: "VAISHIRI10 requires a minimum order value of ₹899" };
      }
      const disc = Math.min(Math.round(subtotal * 0.1), 500);
      setAppliedCoupon({
        code: "VAISHIRI10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        discountAmount: disc,
      });
      return { success: true, message: "10% Vaishiri Welcome discount applied" };
    } else if (trimmed === "BATIK15") {
      if (subtotal < 1999) {
        return { success: false, message: "BATIK15 requires a minimum order value of ₹1,999" };
      }
      const disc = Math.min(Math.round(subtotal * 0.15), 1000);
      setAppliedCoupon({
        code: "BATIK15",
        discountType: "PERCENTAGE",
        discountValue: 15,
        discountAmount: disc,
      });
      return { success: true, message: "15% Handcrafted Batik special discount applied" };
    } else if (trimmed === "FIRSTORDER") {
      const disc = Math.min(100, subtotal);
      setAppliedCoupon({
        code: "FIRSTORDER",
        discountType: "FIXED",
        discountValue: disc,
        discountAmount: disc,
      });
      return { success: true, message: "₹100 First Order welcome discount applied" };
    }

    return { success: false, message: "Invalid or expired coupon code" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isSearchOpen,
        setIsSearchOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

