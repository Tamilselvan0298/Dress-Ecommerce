"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";

interface StockAdjusterProps {
  productId: string;
  currentStock: number;
}

export function StockAdjuster({ productId, currentStock }: StockAdjusterProps) {
  const router = useRouter();
  const [stock, setStock] = useState(currentStock);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleAdjust = async (delta: number) => {
    setIsAdjusting(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADJUST_STOCK",
          data: {
            productId,
            adjustment: delta,
            note: `Manual stock adjustment of ${delta > 0 ? "+" : ""}${delta} units`,
          },
        }),
      });

      if (res.ok) {
        setStock((prev) => prev + delta);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 font-sans">
      <button
        onClick={() => handleAdjust(-1)}
        disabled={isAdjusting || stock <= 0}
        className="w-6 h-6 border border-border bg-ivory-100/70 hover:bg-ivory-200 text-charcoal-700 flex items-center justify-center rounded-xs disabled:opacity-40"
        title="Reduce stock by 1"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center text-xs font-semibold text-charcoal-900">
        {stock}
      </span>
      <button
        onClick={() => handleAdjust(1)}
        disabled={isAdjusting}
        className="w-6 h-6 border border-border bg-ivory-100/70 hover:bg-ivory-200 text-charcoal-700 flex items-center justify-center rounded-xs disabled:opacity-40"
        title="Increase stock by 1"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

