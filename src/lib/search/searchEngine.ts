import { prisma } from "../db/prisma";

export interface SearchResult {
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    fabric: string;
    image: string;
  }>;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  collections: Array<{
    name: string;
    slug: string;
  }>;
}

export async function searchCatalog(query: string): Promise<SearchResult> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return { products: [], categories: [], collections: [] };
  }

  // Multi-field search across title, fabric, occasion, and description
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: cleanQuery } },
        { fabric: { contains: cleanQuery } },
        { occasion: { contains: cleanQuery } },
        { description: { contains: cleanQuery } },
      ],
    },
    take: 8,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: cleanQuery } },
        { description: { contains: cleanQuery } },
      ],
    },
    take: 4,
    select: { name: true, slug: true },
  });

  const collections = await prisma.collection.findMany({
    where: {
      OR: [
        { name: { contains: cleanQuery } },
        { description: { contains: cleanQuery } },
      ],
    },
    take: 4,
    select: { name: true, slug: true },
  });

  return {
    products: products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      fabric: p.fabric,
      image: p.images[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    })),
    categories,
    collections,
  };
}

