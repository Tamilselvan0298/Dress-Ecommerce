import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { Eye, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payment: true,
    },
  });

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[10px] tracking-luxury uppercase text-gold-600 font-semibold block mb-1">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-3xl text-charcoal-950 font-normal">
            Orders ({orders.length})
          </h1>
        </div>
      </div>

      <div className="bg-surface border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-ivory-100/70 border-b border-border text-charcoal-600 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-ivory-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-charcoal-950">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-charcoal-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-charcoal-900 block">{order.customerName}</span>
                    <span className="text-[10px] text-charcoal-500">{order.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 text-charcoal-700">
                    {order.items.length} {order.items.length === 1 ? "Creation" : "Creations"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-charcoal-950">
                    {formatPrice(order.grandTotal)}
                  </td>
                  <td className="py-3 px-4">
                    <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/order-confirmation/${order.orderNumber}`}
                      target="_blank"
                      className="p-1.5 text-charcoal-600 hover:text-gold-700 inline-block"
                      title="View Invoice"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

