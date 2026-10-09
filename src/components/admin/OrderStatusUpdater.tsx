"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    "PENDING_PAYMENT",
    "PAID",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_ORDER_STATUS",
          data: {
            orderId,
            status: newStatus,
            note: `Status adjusted to ${newStatus} via Admin Portal`,
            changedBy: "Super Administrator Gayathri",
          },
        }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      disabled={isUpdating}
      onChange={(e) => handleStatusChange(e.target.value)}
      className="text-[11px] font-sans font-semibold uppercase tracking-wider px-2 py-1 bg-ivory-50 border border-border focus:outline-none focus:border-gold-500 rounded-xs cursor-pointer"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

