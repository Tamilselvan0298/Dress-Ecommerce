import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { ChevronRight, Package, Truck, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payment: true,
    },
  });

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-luxury text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Atelier</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-gold-700 font-semibold">Order History & Tracking</span>
      </nav>

      <div className="pb-6 border-b border-border mb-8">
        <span className="text-[10px] tracking-luxury uppercase text-gold-600 block mb-1">
          Client Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950">
          Your Nuptial Orders ({orders.length})
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center bg-ivory-100 border border-border">
          <Package className="w-8 h-8 text-charcoal-400 mx-auto mb-3" />
          <h3 className="font-serif text-xl text-charcoal-800">No Orders Placed Yet</h3>
          <p className="text-xs text-charcoal-500 mt-1">Explore our heirloom catalog to begin your journey.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block px-6 py-3 bg-charcoal-900 text-ivory-100 text-xs uppercase tracking-luxury hover:bg-gold-600 transition-colors"
          >
            Explore Sarees
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="p-6 bg-ivory-50 border border-border shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/80">
                <div>
                  <span className="font-serif text-lg text-charcoal-900 font-semibold block">
                    {order.orderNumber}
                  </span>
                  <span className="text-[11px] text-charcoal-500 font-sans">
                    Placed on {formatDate(order.createdAt)} • {order.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gold-100 text-gold-800 text-[10px] uppercase tracking-luxury font-semibold border border-gold-300">
                    {order.status}
                  </span>
                  <span className="font-semibold text-charcoal-950 text-sm">
                    {formatPrice(order.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-border/60">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-serif text-sm text-charcoal-900 font-medium">
                        {item.productTitle}
                      </h4>
                      <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                        SKU: {item.sku} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-medium text-charcoal-900">
                      {formatPrice(item.total)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Courier Tracking if available */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-charcoal-600 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600" />
                  <span>
                    Courier: <strong>{order.courierName || "Blue Dart Express"}</strong>
                    {order.trackingNumber && ` (Waybill: ${order.trackingNumber})`}
                  </span>
                </div>
                <Link
                  href={`/order-confirmation/${order.orderNumber}`}
                  className="text-xs text-gold-700 hover:text-gold-900 uppercase tracking-luxury font-medium flex items-center gap-1"
                >
                  <span>View Full Receipt</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

