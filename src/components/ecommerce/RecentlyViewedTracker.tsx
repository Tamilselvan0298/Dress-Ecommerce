"use client";

import { useEffect } from "react";

export interface RecentlyViewedItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
}

export default function RecentlyViewedTracker({ item }: { item: RecentlyViewedItem }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vaishiri_recently_viewed") || localStorage.getItem("avantika_recently_viewed");
      let items: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];

      // Filter out existing occurrence of this item
      items = items.filter((i) => i.id !== item.id);

      // Prepend the new item
      items.unshift(item);

      // Keep maximum 8 items
      items = items.slice(0, 8);

      localStorage.setItem("vaishiri_recently_viewed", JSON.stringify(items));
    } catch {
      // Local storage unavailable or disabled
    }
  }, [item]);

  return null;
}

