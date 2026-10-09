import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string | null | undefined,
  options: {
    currency?: "INR" | "USD" | "EUR" | "GBP";
    notation?: "compact" | "standard";
  } = {}
) {
  const { currency = "INR", notation = "standard" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : Number(price) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
    notation: notation,
  }).format(numericPrice);
}

export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `AVN-${year}-${random}`;
}

