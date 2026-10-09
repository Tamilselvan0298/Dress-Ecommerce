"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  Sliders,
  Settings,
  ArrowLeft,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Inventory", href: "/admin/inventory", icon: Layers },
    { name: "Coupons", href: "/admin/coupons", icon: Tag },
    { name: "Content CMS", href: "/admin/content", icon: Sliders },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1F1A17] text-white flex flex-col justify-between shrink-0 border-r border-white/10 font-sans min-h-screen">
      <div>
        {/* Brand Admin Monogram */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="block">
            <span className="font-serif text-xl tracking-[0.2em] text-white uppercase block">
              VAISHIRI
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#C47B69] uppercase font-sans font-semibold">
              ADMIN CONSOLE
            </span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xs transition-colors",
                  isActive
                    ? "bg-[#86412D] text-white font-semibold shadow-xs"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Storefront Quick Return */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="px-3 py-2 bg-white/5 rounded-xs border border-white/5">
          <span className="text-[10px] text-[#C47B69] uppercase tracking-wider block font-bold">
            Administrator
          </span>
          <span className="text-xs text-white/80 block truncate">
            admin@vaishiri.com
          </span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
