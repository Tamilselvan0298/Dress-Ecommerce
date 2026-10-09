import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    ordersCount,
    orders,
    productsCount,
    lowStockInventories,
    recentAudits,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.inventory.findMany({
      where: { stockQuantity: { lte: 3 } },
      take: 5,
      include: { product: true },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.grandTotal, 0);
  const averageOrderValue = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0;

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[10px] tracking-luxury uppercase text-gold-600 font-semibold block mb-1">
            Atelier Management Console
          </span>
          <h1 className="font-serif text-3xl text-charcoal-950 font-normal">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-charcoal-900 text-ivory-100 text-xs uppercase tracking-luxury hover:bg-gold-600 transition-colors font-medium shadow-sm"
          >
            + Create Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-surface text-charcoal-900 border border-border text-xs uppercase tracking-luxury hover:bg-ivory-100 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs uppercase tracking-luxury font-medium">Total Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-serif text-2xl font-semibold text-charcoal-950 block">
            {formatPrice(totalRevenue)}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            +18.4% from last salon release
          </span>
        </div>

        <div className="p-5 bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs uppercase tracking-luxury font-medium">Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-gold-600" />
          </div>
          <span className="font-serif text-2xl font-semibold text-charcoal-950 block">
            {ordersCount}
          </span>
          <span className="text-[11px] text-charcoal-500 mt-1 block">
            Avg Order: {formatPrice(averageOrderValue)}
          </span>
        </div>

        <div className="p-5 bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs uppercase tracking-luxury font-medium">Active Handlooms</span>
            <Package className="w-4 h-4 text-charcoal-600" />
          </div>
          <span className="font-serif text-2xl font-semibold text-charcoal-950 block">
            {productsCount}
          </span>
          <span className="text-[11px] text-charcoal-500 mt-1 block">
            Across 6 heritage categories
          </span>
        </div>

        <div className="p-5 bg-surface border border-border shadow-2xs">
          <div className="flex items-center justify-between text-charcoal-500 mb-2">
            <span className="text-xs uppercase tracking-luxury font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-serif text-2xl font-semibold text-amber-700 block">
            {lowStockInventories.length} Pieces
          </span>
          <span className="text-[11px] text-amber-700 mt-1 block">
            Immediate loom reorder needed
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-surface p-6 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-serif text-xl text-charcoal-950">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-700 hover:text-gold-900 uppercase tracking-luxury font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-charcoal-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-ivory-50/80 transition-colors">
                    <td className="py-3 font-semibold text-charcoal-900">{o.orderNumber}</td>
                    <td className="py-3 text-charcoal-700">{o.customerName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-gold-100 text-gold-800 text-[10px] uppercase font-semibold border border-gold-200">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-charcoal-950">{formatPrice(o.grandTotal)}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/order-confirmation/${o.orderNumber}`}
                        className="text-charcoal-600 hover:text-gold-700 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-surface p-6 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-serif text-xl text-charcoal-950">Loom Inventory Alert</h2>
            <Link
              href="/admin/inventory"
              className="text-xs text-gold-700 hover:text-gold-900 uppercase tracking-luxury font-medium"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockInventories.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-6 text-center">
                All inventory healthy above safety threshold.
              </p>
            ) : (
              lowStockInventories.map((inv) => (
                <div key={inv.id} className="p-3 bg-amber-50/50 border border-amber-200/80 text-xs flex justify-between items-center">
                  <div>
                    <h4 className="font-serif font-medium text-charcoal-900 line-clamp-1">
                      {inv.product.title}
                    </h4>
                    <span className="text-[10px] text-charcoal-500 uppercase">
                      SKU: {inv.sku}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-900 font-bold rounded-sm shrink-0">
                    {inv.stockQuantity} Left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

