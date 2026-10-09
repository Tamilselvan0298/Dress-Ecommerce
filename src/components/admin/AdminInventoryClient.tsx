"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  Filter,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Package,
  Layers,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";

export interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  location: string;
  product: {
    id: string;
    title: string;
    sku: string;
    price: number;
    fabric: string;
    images?: Array<{ url: string }>;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface AdminInventoryClientProps {
  initialInventories: InventoryItem[];
  categories: CategoryOption[];
}

export default function AdminInventoryClient({
  initialInventories,
  categories,
}: AdminInventoryClientProps) {
  const router = useRouter();
  const [inventories, setInventories] = useState<InventoryItem[]>(initialInventories);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Direct editing input state: { [productId]: number }
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({});

  // Reset pagination on filter / search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStockFilter, searchQuery, pageSize]);

  // Dynamic stock counts based on current category selection
  const stockCounts = useMemo(() => {
    const pool =
      selectedCategory === "all"
        ? inventories
        : inventories.filter(
            (i) =>
              i.product.category?.slug === selectedCategory ||
              i.product.category?.id === selectedCategory
          );

    const all = pool.length;
    const out = pool.filter((i) => i.stockQuantity === 0).length;
    const low = pool.filter(
      (i) => i.stockQuantity > 0 && i.stockQuantity <= i.lowStockThreshold
    ).length;
    const inStock = pool.filter((i) => i.stockQuantity > i.lowStockThreshold).length;

    return { all, out, low, inStock };
  }, [inventories, selectedCategory]);

  // 1. Filter logic
  const filteredInventories = useMemo(() => {
    return inventories.filter((inv) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (
          inv.product.category?.slug !== selectedCategory &&
          inv.product.category?.id !== selectedCategory
        ) {
          return false;
        }
      }

      // Stock level filter
      if (selectedStockFilter === "low") {
        if (inv.stockQuantity <= 0 || inv.stockQuantity > inv.lowStockThreshold) {
          return false;
        }
      }
      if (selectedStockFilter === "out") {
        if (inv.stockQuantity !== 0) {
          return false;
        }
      }
      if (selectedStockFilter === "in_stock") {
        if (inv.stockQuantity <= inv.lowStockThreshold) {
          return false;
        }
      }

      // Search query (title, sku, fabric, category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = inv.product.title.toLowerCase().includes(q);
        const skuMatch =
          inv.sku.toLowerCase().includes(q) ||
          inv.product.sku.toLowerCase().includes(q);
        const catMatch = inv.product.category?.name.toLowerCase().includes(q);
        const fabricMatch = inv.product.fabric?.toLowerCase().includes(q);
        return titleMatch || skuMatch || catMatch || fabricMatch;
      }

      return true;
    });
  }, [inventories, selectedCategory, selectedStockFilter, searchQuery]);

  // Dynamic metrics based on current view
  const totalStock = filteredInventories.reduce((sum, i) => sum + i.stockQuantity, 0);
  const totalValuation = filteredInventories.reduce(
    (sum, i) => sum + i.stockQuantity * i.product.price,
    0
  );
  const lowStockCount = filteredInventories.filter(
    (i) => i.stockQuantity > 0 && i.stockQuantity <= i.lowStockThreshold
  ).length;
  const outOfStockCount = filteredInventories.filter((i) => i.stockQuantity === 0).length;

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredInventories.length / pageSize));
  const paginatedInventories = filteredInventories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: inventories.length };
    categories.forEach((cat) => {
      counts[cat.slug] = inventories.filter(
        (i) => i.product.category?.slug === cat.slug
      ).length;
    });
    return counts;
  }, [inventories, categories]);

  // Adjust stock by delta (+1, -1, +5, +10, etc.)
  const handleAdjustStock = async (productId: string, delta: number) => {
    setLoadingProductId(productId);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADJUST_STOCK",
          data: {
            productId,
            adjustment: delta,
            note: `Stock adjusted by ${delta > 0 ? "+" : ""}${delta} units`,
          },
        }),
      });

      if (res.ok) {
        setInventories((prev) =>
          prev.map((i) =>
            i.productId === productId
              ? { ...i, stockQuantity: Math.max(0, i.stockQuantity + delta) }
              : i
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProductId(null);
    }
  };

  // Set direct absolute quantity
  const handleSetStock = async (productId: string) => {
    const target = editingStock[productId];
    if (target === undefined || target < 0) return;

    setLoadingProductId(productId);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SET_STOCK",
          data: {
            productId,
            newQuantity: target,
            note: `Direct stock update to ${target} units`,
          },
        }),
      });

      if (res.ok) {
        setInventories((prev) =>
          prev.map((i) => (i.productId === productId ? { ...i, stockQuantity: target } : i))
        );
        // Clear editing state for this item
        const updated = { ...editingStock };
        delete updated[productId];
        setEditingStock(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <span className="text-[10px] tracking-wider uppercase text-[#86412D] font-bold block mb-1">
            Vaishiri Inventory Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
            Inventory & Stock Allocation
          </h1>
        </div>

        <button
          onClick={() => {
            setSelectedCategory("all");
            setSelectedStockFilter("all");
            setSearchQuery("");
            router.refresh();
          }}
          className="px-3.5 py-2 border border-[#E8E2D8] text-charcoal-700 hover:bg-[#FAF7F2] text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E8E2D8] shadow-2xs">
          <span className="text-xs uppercase tracking-wider text-charcoal-500 block mb-1 font-medium">
            Total Pieces in Stock
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-charcoal-950">
              {totalStock}
            </span>
            <span className="text-xs text-charcoal-500">Units</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E8E2D8] shadow-2xs">
          <span className="text-xs uppercase tracking-wider text-charcoal-500 block mb-1 font-medium">
            Total Inventory Valuation
          </span>
          <span className="font-serif text-2xl font-bold text-charcoal-950">
            {formatPrice(totalValuation)}
          </span>
        </div>

        <div
          onClick={() => {
            setSelectedStockFilter("low");
            setCurrentPage(1);
          }}
          className={`p-4 bg-white border cursor-pointer transition-all hover:border-amber-400 shadow-2xs ${
            selectedStockFilter === "low" ? "border-amber-600 ring-1 ring-amber-600 bg-amber-50/20" : "border-[#E8E2D8]"
          }`}
          title="Click to filter low stock items"
        >
          <span className="text-xs uppercase tracking-wider text-amber-800 block mb-1 font-medium">
            Low Stock Alert
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-amber-700">
              {lowStockCount}
            </span>
            <span className="text-xs text-charcoal-500">Products</span>
          </div>
        </div>

        <div
          onClick={() => {
            setSelectedStockFilter("out");
            setCurrentPage(1);
          }}
          className={`p-4 bg-white border cursor-pointer transition-all hover:border-red-400 shadow-2xs ${
            selectedStockFilter === "out" ? "border-red-600 ring-1 ring-red-600 bg-red-50/20" : "border-[#E8E2D8]"
          }`}
          title="Click to filter out-of-stock items"
        >
          <span className="text-xs uppercase tracking-wider text-red-800 block mb-1 font-medium">
            Out of Stock
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-red-700">
              {outOfStockCount}
            </span>
            <span className="text-xs text-charcoal-500">Products</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white border border-[#E8E2D8] p-4 rounded-xs space-y-3.5 shadow-2xs">
        {/* Row 1: Search & Category Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product title, SKU, or fabric..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs text-charcoal-900 focus:outline-none focus:border-[#86412D] focus:bg-white transition-colors placeholder:text-charcoal-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 text-xs px-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#86412D]" />
              <span>Category:</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-medium text-charcoal-900 rounded-xs focus:outline-none focus:border-[#86412D] cursor-pointer"
            >
              <option value="all">All Categories ({categoryCounts["all"] || 0})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name} ({categoryCounts[cat.slug] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Stock Level Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#F0ECE1]">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 shrink-0 mr-1 hidden sm:inline">
            Stock Level:
          </span>
          <button
            onClick={() => {
              setSelectedStockFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              selectedStockFilter === "all"
                ? "bg-[#86412D] text-white shadow-xs font-semibold"
                : "bg-[#FAF7F2] text-charcoal-700 hover:bg-[#E8E2D8] border border-[#E8E2D8]"
            }`}
          >
            <span>All Items</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                selectedStockFilter === "all"
                  ? "bg-white/20 text-white"
                  : "bg-[#E8E2D8] text-charcoal-800"
              }`}
            >
              {stockCounts.all}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedStockFilter("in_stock");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              selectedStockFilter === "in_stock"
                ? "bg-emerald-700 text-white shadow-xs font-semibold"
                : "bg-[#FAF7F2] text-emerald-800 hover:bg-emerald-100/60 border border-emerald-200"
            }`}
          >
            <span>In Stock</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                selectedStockFilter === "in_stock"
                  ? "bg-white/25 text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {stockCounts.inStock}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedStockFilter("low");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              selectedStockFilter === "low"
                ? "bg-amber-700 text-white shadow-xs font-semibold"
                : "bg-[#FAF7F2] text-amber-800 hover:bg-amber-100/60 border border-amber-200"
            }`}
          >
            <span>Low Stock</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                selectedStockFilter === "low"
                  ? "bg-white/25 text-white"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {stockCounts.low}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedStockFilter("out");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              selectedStockFilter === "out"
                ? "bg-red-700 text-white shadow-xs font-semibold"
                : "bg-[#FAF7F2] text-red-800 hover:bg-red-100/60 border border-red-200"
            }`}
          >
            <span>Out of Stock</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                selectedStockFilter === "out"
                  ? "bg-white/25 text-white"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {stockCounts.out}
            </span>
          </button>
        </div>

        {/* Row 3: Category Pill Quick Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#F0ECE1]">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 shrink-0 mr-1">
            Categories:
          </span>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 text-[11px] rounded-full whitespace-nowrap transition-colors shrink-0 inline-flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-charcoal-900 text-white font-semibold shadow-2xs"
                : "bg-white border border-[#E8E2D8] text-charcoal-700 hover:border-charcoal-400"
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.2 text-[9px] rounded-full font-bold ${
                selectedCategory === "all"
                  ? "bg-white/20 text-white"
                  : "bg-[#FAF7F2] text-charcoal-600"
              }`}
            >
              {categoryCounts["all"] || 0}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-[11px] rounded-full whitespace-nowrap transition-colors shrink-0 inline-flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? "bg-[#86412D] text-white font-semibold shadow-2xs"
                  : "bg-white border border-[#E8E2D8] text-charcoal-700 hover:border-[#86412D]"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`px-1.5 py-0.2 text-[9px] rounded-full font-bold ${
                  selectedCategory === cat.slug
                    ? "bg-white/20 text-white"
                    : "bg-[#FAF7F2] text-charcoal-600"
                }`}
              >
                {categoryCounts[cat.slug] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white border border-[#E8E2D8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D8] text-charcoal-600 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Product Details & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Warehouse Location</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Reserved</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {paginatedInventories.length > 0 ? (
                paginatedInventories.map((inv) => {
                  const isCurrentLoading = loadingProductId === inv.productId;
                  const customVal = editingStock[inv.productId];
                  const hasCustomValue = customVal !== undefined && customVal !== inv.stockQuantity;

                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Product & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-ivory-100 border border-[#E8E2D8] shrink-0 overflow-hidden rounded-2xs">
                            <Image
                              src={
                                inv.product.images?.[0]?.url ||
                                "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/new-wax-batik-cupper-block-unstitched-suits-5366707.jpg?v=1787159888"
                              }
                              alt={inv.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-serif font-semibold text-charcoal-950 text-sm block line-clamp-1">
                              {inv.product.title}
                            </span>
                            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-mono">
                              SKU: {inv.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#86412D] text-[10px] font-semibold uppercase tracking-wider rounded-2xs whitespace-nowrap">
                          {inv.product.category?.name || "General"}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-charcoal-700 whitespace-nowrap">
                        {inv.location}
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4 font-semibold text-charcoal-900 whitespace-nowrap">
                        {formatPrice(inv.product.price)}
                      </td>

                      {/* Reserved */}
                      <td className="py-3.5 px-4 text-charcoal-600 whitespace-nowrap">
                        {inv.reservedQuantity} reserved
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-2xs text-[11px] ${
                            inv.stockQuantity === 0
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : inv.stockQuantity <= inv.lowStockThreshold
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {inv.stockQuantity === 0 ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                              <span>Out of Stock (0 available)</span>
                            </>
                          ) : inv.stockQuantity <= inv.lowStockThreshold ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>Low Stock ({inv.stockQuantity} available)</span>
                            </>
                          ) : (
                            <span>{inv.stockQuantity} available</span>
                          )}
                        </span>
                      </td>

                      {/* Quick Stock Controls */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Stepper (-1, current, +1) */}
                          <div className="inline-flex items-center border border-[#E8E2D8] bg-[#FAF7F2] rounded-xs overflow-hidden">
                            <button
                              onClick={() => handleAdjustStock(inv.productId, -1)}
                              disabled={isCurrentLoading || inv.stockQuantity <= 0}
                              className="px-2 py-1 text-charcoal-700 hover:bg-[#E8E2D8] disabled:opacity-40 transition-colors"
                              title="Decrease by 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={
                                customVal !== undefined ? customVal : inv.stockQuantity
                              }
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setEditingStock({
                                  ...editingStock,
                                  [inv.productId]: isNaN(val) ? 0 : val,
                                });
                              }}
                              className="w-12 text-center text-xs font-bold text-charcoal-900 bg-white py-1 border-x border-[#E8E2D8] focus:outline-none focus:border-[#86412D]"
                            />

                            <button
                              onClick={() => handleAdjustStock(inv.productId, 1)}
                              disabled={isCurrentLoading}
                              className="px-2 py-1 text-charcoal-700 hover:bg-[#E8E2D8] disabled:opacity-40 transition-colors"
                              title="Increase by 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Save Custom Input if typed */}
                          {hasCustomValue && (
                            <button
                              onClick={() => handleSetStock(inv.productId)}
                              disabled={isCurrentLoading}
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-[10px] font-semibold flex items-center gap-1 transition-colors"
                              title="Save custom stock value"
                            >
                              <Check className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                          )}

                          {/* Quick Bulk Add Shortcut Buttons */}
                          <button
                            onClick={() => handleAdjustStock(inv.productId, 5)}
                            disabled={isCurrentLoading}
                            className="px-2 py-1 bg-[#FAF7F2] hover:bg-[#86412D] text-charcoal-700 hover:text-white border border-[#E8E2D8] rounded-xs text-[10px] font-bold transition-colors"
                            title="Add +5 units instantly"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(inv.productId, 10)}
                            disabled={isCurrentLoading}
                            className="px-2 py-1 bg-[#FAF7F2] hover:bg-[#86412D] text-charcoal-700 hover:text-white border border-[#E8E2D8] rounded-xs text-[10px] font-bold transition-colors"
                            title="Add +10 units instantly"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-500">
                    <Package className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
                    <p className="text-xs font-medium">No inventory items match your filter criteria.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedStockFilter("all");
                        setSearchQuery("");
                      }}
                      className="mt-3 text-xs text-[#86412D] font-bold underline"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredInventories.length > 0 && (
          <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#E8E2D8] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-charcoal-600">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
              <span>
                Showing <strong className="text-charcoal-900">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                <strong className="text-charcoal-900">
                  {Math.min(currentPage * pageSize, filteredInventories.length)}
                </strong>{" "}
                of <strong className="text-charcoal-900">{filteredInventories.length}</strong> items
              </span>
              <div className="flex items-center gap-1 sm:ml-4 text-[11px]">
                <span>Show:</span>
                {[10, 25, 50].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setPageSize(sz);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-0.5 rounded-2xs border ${
                      pageSize === sz
                        ? "bg-[#86412D] text-white border-[#86412D] font-bold"
                        : "bg-white border-[#E8E2D8] text-charcoal-700 hover:bg-ivory-100"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-2.5 py-1 rounded-2xs border border-[#E8E2D8] bg-white text-charcoal-700 hover:bg-ivory-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 flex items-center justify-center rounded-2xs text-xs font-semibold ${
                    currentPage === pg
                      ? "bg-[#86412D] text-white"
                      : "bg-white border border-[#E8E2D8] text-charcoal-700 hover:bg-ivory-100"
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 rounded-2xs border border-[#E8E2D8] bg-white text-charcoal-700 hover:bg-ivory-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

