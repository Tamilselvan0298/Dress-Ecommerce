import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { CheckCircle, ShieldCheck, Truck, ArrowRight, Printer } from "lucide-react";

interface OrderConfirmationProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
      payment: true,
      shipment: true,
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddress = JSON.parse(order.shippingAddressJson || "{}");

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      {/* Success Banner */}
      <div className="p-8 bg-ivory-100 border border-border text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
          <CheckCircle className="w-8 h-8 stroke-[1.5]" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-terracotta block font-semibold">
          Order Successfully Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950">
          Thank you for choosing Vaishiri Clothing
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto font-light leading-relaxed">
          Your order <strong className="font-semibold text-charcoal-900">{order.orderNumber}</strong> has been received. Our team is carefully inspecting and packaging your handcrafted pieces.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="px-3 py-1 bg-ivory-50 border border-border text-charcoal-700">
            Status: <strong className="text-charcoal-900 uppercase">{order.status}</strong>
          </div>
          <div className="px-3 py-1 bg-ivory-50 border border-border text-charcoal-700">
            Courier: <strong className="text-charcoal-900">{order.courierName || "Delhivery / Blue Dart Express"}</strong>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Destination */}
        <div className="p-6 bg-ivory-50 border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-terracotta font-medium">
            <Truck className="w-4 h-4" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-xs text-charcoal-700 space-y-1">
            <p className="font-serif text-sm font-semibold text-charcoal-950">{shippingAddress.fullName}</p>
            <p>{shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
            <p className="pt-2 text-charcoal-500">Contact: {shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-ivory-50 border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-terracotta font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Order Summary</span>
          </div>
          <div className="space-y-1.5 text-xs text-charcoal-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-terracotta font-medium">
                <span>Coupon Discount</span>
                <span>-{formatPrice(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Standard Express Shipping</span>
              <span>{order.shippingTotal === 0 ? "FREE" : formatPrice(order.shippingTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>{formatPrice(order.taxTotal)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-semibold text-charcoal-950 text-sm">
              <span>Total Amount</span>
              <span>{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="mt-8 p-6 bg-ivory-50 border border-border">
        <h3 className="font-serif text-lg text-charcoal-950 mb-4 pb-2 border-b border-border">
          Items in this Shipment
        </h3>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-serif text-sm font-semibold text-charcoal-900">
                  {item.productTitle}
                </h4>
                <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block mt-0.5">
                  SKU: {item.sku} • Quantity: {item.quantity}
                </span>
              </div>
              <span className="font-medium text-charcoal-950">
                {formatPrice(item.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/shop"
          className="px-6 py-3 bg-terracotta text-white text-xs uppercase tracking-wider hover:bg-terracotta-dark transition-colors flex items-center gap-2 font-medium"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/account/orders"
          className="px-6 py-3 border border-charcoal-900 text-charcoal-900 text-xs uppercase tracking-wider hover:bg-ivory-200 transition-colors font-medium"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}

