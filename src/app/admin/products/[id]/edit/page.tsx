import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import EditProductClient from "./EditProductClient";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
  searchParams?: { created?: string };
}

export default async function EditProductPage({ params, searchParams }: Props) {
  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        inventory: true,
        category: true,
        collection: true,
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <EditProductClient
      initialProduct={product}
      categories={categories}
      collections={collections}
      justCreated={searchParams?.created === "true"}
    />
  );
}

