import React from "react";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";
import { Tag, Check, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { startsAt: "desc" },
    include: { usages: true },
  });

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[10px] tracking-luxury uppercase text-gold-600 font-semibold block mb-1">
            Privilege & Concession Vouchers
          </span>
          <h1 className="font-serif text-3xl text-charcoal-950 font-normal">
            Active Promotion Vouchers ({coupons.length})
          </h1>
        </div>
      </div>

      <div className="bg-surface border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-ivory-100/70 border-b border-border text-charcoal-600 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Voucher Code</th>
                <th className="py-3 px-4">Discount Type</th>
                <th className="py-3 px-4">Benefit</th>
                <th className="py-3 px-4">Min. Order Value</th>
                <th className="py-3 px-4">Max Benefit</th>
                <th className="py-3 px-4">Redemption Count</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-ivory-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-charcoal-950 text-sm">
                    {c.code}
                  </td>
                  <td className="py-3 px-4 uppercase text-charcoal-700">
                    {c.discountType}
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}% OFF`
                      : `${formatPrice(c.discountValue)} OFF`}
                  </td>
                  <td className="py-3 px-4 text-charcoal-700">
                    {formatPrice(c.minOrderValue)}
                  </td>
                  <td className="py-3 px-4 text-charcoal-700">
                    {c.maxDiscount ? formatPrice(c.maxDiscount) : "Uncapped"}
                  </td>
                  <td className="py-3 px-4 text-charcoal-600">
                    {c.usedCount} of {c.maxUses} used
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200 uppercase">
                      Active
                    </span>
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

