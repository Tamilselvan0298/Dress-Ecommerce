import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { verifyToken, ADMIN_COOKIE } from "@/lib/auth/session";

export const metadata = {
  title: "Admin Portal | Vaishiri Clothing",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const admin = token ? verifyToken(token) : null;

  // Strict role-based guard: unauthorized visitors are redirected to admin login
  if (!admin || (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans overflow-x-hidden max-w-full w-full">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden max-w-full">
        <AdminHeader />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto overflow-x-hidden max-w-full">{children}</main>
      </div>
    </div>
  );
}
