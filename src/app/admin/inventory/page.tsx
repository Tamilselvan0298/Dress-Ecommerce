import React from "react";
import { prisma } from "@/lib/db/prisma";
import AdminInventoryClient from "@/components/admin/AdminInventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const [inventories, categories] = await Promise.all([
    prisma.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
      orderBy: { stockQuantity: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <AdminInventoryClient
      initialInventories={inventories as any}
      categories={categories}
    />
  );
}

