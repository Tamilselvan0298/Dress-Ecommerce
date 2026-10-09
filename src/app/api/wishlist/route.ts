import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json({ products: [] });
    }
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isPublished: true,
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
          take: 2,
        },
        category: true,
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      fabric: p.fabric,
      categoryName: p.category?.name || "Batik Suits",
      image: p.images[0]?.url || "",
      secondaryImage: p.images[1]?.url || p.images[0]?.url || "",
    }));

    return NextResponse.json({ products: formatted });
  } catch (error) {
    console.error("Wishlist GET API error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isPublished: true,
      },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
          take: 2,
        },
        category: true,
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      fabric: p.fabric,
      categoryName: p.category?.name || "Batik Suits",
      image: p.images[0]?.url || "",
      secondaryImage: p.images[1]?.url || p.images[0]?.url || "",
    }));

    return NextResponse.json({ products: formatted });
  } catch (error) {
    console.error("Wishlist POST API error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist products" }, { status: 500 });
  }
}

