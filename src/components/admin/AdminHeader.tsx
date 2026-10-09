"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; role: string; email: string }>({
    name: "Vaishiri Admin",
    role: "STORE DIRECTOR",
    email: "admin@vaishiri.com",
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E8E2D8] px-6 flex items-center justify-between font-sans shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-charcoal-800 uppercase tracking-wider">
          Vaishiri Console
        </span>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold tracking-wider uppercase border border-emerald-200">
          Live & Encrypted
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-charcoal-600 hover:text-[#86412D] flex items-center gap-1.5 transition-colors font-medium"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-3 pl-4 border-l border-[#E8E2D8]">
          <div className="w-8 h-8 rounded-full bg-[#86412D] text-white flex items-center justify-center text-xs font-bold">
            V
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-charcoal-900 block leading-tight">
              {adminUser.name}
            </span>
            <span className="text-[10px] text-[#86412D] font-bold uppercase tracking-wider">
              {adminUser.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out Admin"
            className="p-1.5 text-charcoal-500 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
