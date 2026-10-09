import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === "UPDATE_ORDER_STATUS") {
      const { orderId, status, note, changedBy } = data;
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status,
          note: note || `Status modified to ${status}`,
          changedBy: changedBy || "Admin",
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "ORDER_STATUS_UPDATE",
          resource: "Order",
          resourceId: orderId,
          details: JSON.stringify({ newStatus: status, note }),
          userName: changedBy || "Admin",
        },
      });

      return NextResponse.json({ success: true, order });
    }

    if (action === "ADJUST_STOCK") {
      const { productId, adjustment, note } = data;
      const inventory = await prisma.inventory.update({
        where: { productId },
        data: {
          stockQuantity: { increment: Number(adjustment) },
        },
      });

      await prisma.inventoryTransaction.create({
        data: {
          inventoryId: inventory.id,
          type: "ADJUSTMENT",
          quantity: Number(adjustment),
          note: note || "Manual admin stock adjustment",
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "STOCK_ADJUSTMENT",
          resource: "Inventory",
          resourceId: inventory.id,
          details: JSON.stringify({ delta: adjustment, note }),
          userName: "Admin",
        },
      });

      return NextResponse.json({ success: true, inventory });
    }

    if (action === "SET_STOCK") {
      const { productId, note } = data;
      const targetQty = Math.max(0, Number(data.newQuantity !== undefined ? data.newQuantity : data.stockQuantity));
      const current = await prisma.inventory.findUnique({ where: { productId } });
      const delta = targetQty - (current?.stockQuantity || 0);

      const inventory = await prisma.inventory.update({
        where: { productId },
        data: {
          stockQuantity: targetQty,
        },
      });

      await prisma.inventoryTransaction.create({
        data: {
          inventoryId: inventory.id,
          type: "ADJUSTMENT",
          quantity: delta,
          note: note || `Stock updated directly to ${targetQty}`,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "STOCK_UPDATE",
          resource: "Inventory",
          resourceId: inventory.id,
          details: JSON.stringify({ newQuantity: targetQty, delta, note }),
          userName: "Admin",
        },
      });

      return NextResponse.json({ success: true, inventory });
    }

    if (action === "CREATE_PRODUCT") {
      const rawImages: string[] = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
      const variantsData = Array.isArray(data.variants) ? data.variants : [];

      // Collect all image URLs from general images + variant images
      const allImageUrls: string[] = [...rawImages];
      variantsData.forEach((v: any) => {
        if (v.image && !allImageUrls.includes(v.image)) {
          allImageUrls.push(v.image);
        }
      });

      if (allImageUrls.length === 0) {
        allImageUrls.push(
          "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/marble-print-tie-dye-cotton-suit-set-unstitched-8692842.jpg?v=1787159890"
        );
      }

      // Resolve valid categoryId
      let categoryId = data.categoryId;
      if (categoryId) {
        const catExists = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!catExists) categoryId = null;
      }
      if (!categoryId) {
        const firstCategory = await prisma.category.findFirst();
        categoryId = firstCategory?.id;
      }

      // Resolve collectionId
      let collectionId = data.collectionId || null;
      if (collectionId) {
        const colExists = await prisma.collection.findUnique({ where: { id: collectionId } });
        if (!colExists) collectionId = null;
      }

      const totalInitialStock =
        variantsData.length > 0
          ? variantsData.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0)
          : Number(data.initialStock || 12);

      // Robust base SKU generation & auto-deduplication
      let baseSku = (data.sku || `VSH-${Math.floor(10000 + Math.random() * 90000)}`)
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "");
      if (!baseSku) baseSku = `VSH-${Math.floor(10000 + Math.random() * 90000)}`;

      let finalSku = baseSku;
      let skuAttempt = 1;
      while (
        (await prisma.product.findUnique({ where: { sku: finalSku } })) ||
        (await prisma.inventory.findUnique({ where: { sku: finalSku } }))
      ) {
        finalSku = `${baseSku}-${Math.floor(100 + Math.random() * 900)}`;
        skuAttempt++;
        if (skuAttempt > 10) {
          finalSku = `VSH-${Date.now().toString().slice(-6)}`;
          break;
        }
      }

      // Robust base Slug generation & auto-deduplication
      let baseSlug = (data.slug || data.title || "product")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!baseSlug) baseSlug = `product-${Date.now().toString().slice(-6)}`;

      let finalSlug = baseSlug;
      let slugAttempt = 1;
      while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${baseSlug}-${slugAttempt}`;
        slugAttempt++;
        if (slugAttempt > 15) {
          finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
          break;
        }
      }

      // Robust variant SKUs generation & uniqueness
      const createdVariants = [];
      const usedVariantSkus = new Set<string>();

      if (variantsData.length > 0) {
        for (let index = 0; index < variantsData.length; index++) {
          const v = variantsData[index];
          const rawSuffix = (v.skuSuffix || v.color || `V${index + 1}`)
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 8) || `V${index + 1}`;

          let candidateSku = (v.sku || `${finalSku}-${rawSuffix}`).trim().toUpperCase();
          let suffixNum = 1;
          while (
            usedVariantSkus.has(candidateSku) ||
            (await prisma.productVariant.findUnique({ where: { sku: candidateSku } }))
          ) {
            candidateSku = `${finalSku}-${rawSuffix}-${suffixNum++}`;
          }
          usedVariantSkus.add(candidateSku);

          createdVariants.push({
            title: v.title || v.color || `Option ${index + 1}`,
            sku: candidateSku,
            color: v.color || "Multicolor",
            colorHex: v.colorHex || "#86412D",
            size: v.size || "Standard",
            price: Number(v.price || data.price),
            compareAtPrice: v.compareAtPrice
              ? Number(v.compareAtPrice)
              : data.compareAtPrice
              ? Number(data.compareAtPrice)
              : null,
            stock: Number(v.stock || 10),
            image: v.image || allImageUrls[index] || allImageUrls[0],
          });
        }
      } else {
        let stdSku = `${finalSku}-STD`;
        if (await prisma.productVariant.findUnique({ where: { sku: stdSku } })) {
          stdSku = `${finalSku}-STD-${Date.now().toString().slice(-4)}`;
        }
        createdVariants.push({
          title: "Standard",
          sku: stdSku,
          color: "Artisan Multi",
          colorHex: "#C47B69",
          size: "Standard",
          price: Number(data.price),
          stock: totalInitialStock,
          image: allImageUrls[0],
        });
      }

      const product = await prisma.product.create({
        data: {
          title: data.title,
          slug: finalSlug,
          sku: finalSku,
          description: data.description || "Authentic handcrafted artisanal ensemble.",
          shortDescription: data.shortDescription || data.description?.slice(0, 160) || null,
          price: Number(data.price),
          compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
          fabric: data.fabric || "Pure Cotton",
          occasion: data.occasion || "Festive & Casual",
          categoryId: categoryId!,
          collectionId,
          isFeatured: Boolean(data.isFeatured),
          isPublished: Boolean(data.isPublished ?? true),
          images: {
            create: allImageUrls.map((url: string, index: number) => ({
              url,
              alt: `${data.title} - View ${index + 1}`,
              isPrimary: index === 0,
              displayOrder: index,
            })),
          },
          variants: {
            create: createdVariants,
          },
          inventory: {
            create: {
              sku: finalSku,
              stockQuantity: totalInitialStock,
            },
          },
        },
        include: {
          variants: true,
          images: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "PRODUCT_CREATED",
          resource: "Product",
          resourceId: product.id,
          details: JSON.stringify({
            title: product.title,
            sku: product.sku,
            variantsCount: product.variants.length,
          }),
          userName: "Admin",
        },
      });

      return NextResponse.json({ success: true, product });
    }

    if (action === "UPDATE_PRODUCT") {
      const { id } = data;
      if (!id) {
        return NextResponse.json({ error: "Product ID is required for update" }, { status: 400 });
      }

      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { variants: true, images: true, inventory: true },
      });

      if (!existingProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Check categoryId
      let categoryId = data.categoryId;
      if (categoryId) {
        const catExists = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!catExists) categoryId = existingProduct.categoryId;
      } else {
        categoryId = existingProduct.categoryId;
      }

      // Check collectionId
      let collectionId = data.collectionId !== undefined ? data.collectionId : existingProduct.collectionId;
      if (collectionId) {
        const colExists = await prisma.collection.findUnique({ where: { id: collectionId } });
        if (!colExists) collectionId = null;
      }

      // Handle SKU uniqueness
      let finalSku = (data.sku || existingProduct.sku).trim().toUpperCase();
      if (finalSku !== existingProduct.sku) {
        const skuCollision = await prisma.product.findFirst({
          where: { sku: finalSku, id: { not: id } },
        });
        if (skuCollision) {
          finalSku = `${finalSku}-${Math.floor(100 + Math.random() * 900)}`;
        }
      }

      // Handle Slug uniqueness
      let finalSlug = (data.slug || existingProduct.slug)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (finalSlug !== existingProduct.slug) {
        const slugCollision = await prisma.product.findFirst({
          where: { slug: finalSlug, id: { not: id } },
        });
        if (slugCollision) {
          finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
        }
      }

      // Collect images
      const rawImages: string[] = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
      const variantsData = Array.isArray(data.variants) ? data.variants : [];

      const allImageUrls: string[] = [...rawImages];
      variantsData.forEach((v: any) => {
        if (v.image && !allImageUrls.includes(v.image)) {
          allImageUrls.push(v.image);
        }
      });

      if (allImageUrls.length === 0 && existingProduct.images.length > 0) {
        allImageUrls.push(...existingProduct.images.map((img) => img.url));
      }

      const totalStock =
        variantsData.length > 0
          ? variantsData.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0)
          : Number(data.stockQuantity !== undefined ? data.stockQuantity : existingProduct.inventory?.stockQuantity || 12);

      // 1. Update Product
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          title: data.title !== undefined ? data.title : existingProduct.title,
          slug: finalSlug,
          sku: finalSku,
          description: data.description !== undefined ? data.description : existingProduct.description,
          shortDescription:
            data.shortDescription !== undefined
              ? data.shortDescription
              : data.description?.slice(0, 160) || existingProduct.shortDescription,
          price: data.price !== undefined ? Number(data.price) : existingProduct.price,
          compareAtPrice:
            data.compareAtPrice !== undefined
              ? data.compareAtPrice
                ? Number(data.compareAtPrice)
                : null
              : existingProduct.compareAtPrice,
          fabric: data.fabric !== undefined ? data.fabric : existingProduct.fabric,
          occasion: data.occasion !== undefined ? data.occasion : existingProduct.occasion,
          categoryId,
          collectionId,
          isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : existingProduct.isFeatured,
          isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : existingProduct.isPublished,
        },
      });

      // 2. Synchronize images if images provided
      if (allImageUrls.length > 0) {
        await prisma.productImage.deleteMany({ where: { productId: id } });
        await prisma.productImage.createMany({
          data: allImageUrls.map((url: string, index: number) => ({
            productId: id,
            url,
            alt: `${updatedProduct.title} - View ${index + 1}`,
            isPrimary: index === 0,
            displayOrder: index,
          })),
        });
      }

      // 3. Synchronize variants if provided
      if (variantsData.length > 0) {
        const submittedVariantIds = variantsData
          .filter((v: any) => v.id && !v.id.startsWith("var-"))
          .map((v: any) => v.id);

        await prisma.productVariant.deleteMany({
          where: {
            productId: id,
            id: { notIn: submittedVariantIds },
          },
        });

        for (let idx = 0; idx < variantsData.length; idx++) {
          const v = variantsData[idx];
          const rawSuffix = (v.skuSuffix || v.color || `V${idx + 1}`)
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 8) || `V${idx + 1}`;

          let candidateSku = (v.sku || `${finalSku}-${rawSuffix}`).trim().toUpperCase();

          if (v.id && !v.id.startsWith("var-")) {
            await prisma.productVariant.update({
              where: { id: v.id },
              data: {
                title: v.title || v.color || `Option ${idx + 1}`,
                sku: candidateSku,
                color: v.color || "Multicolor",
                colorHex: v.colorHex || "#86412D",
                price: Number(v.price || updatedProduct.price),
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
                stock: Number(v.stock || 10),
                image: v.image || allImageUrls[idx] || allImageUrls[0] || null,
              },
            });
          } else {
            let varAttempt = 1;
            while (await prisma.productVariant.findUnique({ where: { sku: candidateSku } })) {
              candidateSku = `${finalSku}-${rawSuffix}-${varAttempt++}`;
            }
            await prisma.productVariant.create({
              data: {
                productId: id,
                title: v.title || v.color || `Option ${idx + 1}`,
                sku: candidateSku,
                color: v.color || "Multicolor",
                colorHex: v.colorHex || "#86412D",
                size: v.size || "Standard",
                price: Number(v.price || updatedProduct.price),
                compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
                stock: Number(v.stock || 10),
                image: v.image || allImageUrls[idx] || allImageUrls[0] || null,
              },
            });
          }
        }
      }

      // 4. Update Inventory
      if (existingProduct.inventory) {
        await prisma.inventory.update({
          where: { productId: id },
          data: {
            sku: finalSku,
            stockQuantity: totalStock,
          },
        });
      } else {
        await prisma.inventory.create({
          data: {
            productId: id,
            sku: finalSku,
            stockQuantity: totalStock,
          },
        });
      }

      await prisma.auditLog.create({
        data: {
          action: "PRODUCT_UPDATED",
          resource: "Product",
          resourceId: id,
          details: JSON.stringify({
            title: updatedProduct.title,
            sku: updatedProduct.sku,
            price: updatedProduct.price,
            stock: totalStock,
          }),
          userName: "Admin",
        },
      });

      const completeProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: true,
          images: true,
          inventory: true,
          category: true,
          collection: true,
        },
      });

      return NextResponse.json({ success: true, product: completeProduct });
    }

    if (action === "DELETE_PRODUCT") {
      const { id } = data;
      if (!id) {
        return NextResponse.json({ error: "Product ID required" }, { status: 400 });
      }

      await prisma.cartItem.deleteMany({ where: { productId: id } });
      await prisma.wishlistItem.deleteMany({ where: { productId: id } });
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.inventory.deleteMany({ where: { productId: id } });
      await prisma.product.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          action: "PRODUCT_DELETED",
          resource: "Product",
          resourceId: id,
          userName: "Admin",
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin API action error:", error);
    if (error?.code === "P2002") {
      const target = Array.isArray(error?.meta?.target) ? error.meta.target.join(", ") : "SKU or Slug";
      return NextResponse.json(
        { error: `A product with this unique ${target} already exists. Please adjust the SKU or Title.` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Admin request failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          collection: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
          inventory: true,
        },
      });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    const [categories, collections] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.collection.findMany({ orderBy: { name: "asc" } }),
    ]);
    return NextResponse.json({ categories, collections });
  } catch (error) {
    console.error("Failed to load admin metadata:", error);
    return NextResponse.json({ categories: [], collections: [] }, { status: 500 });
  }
}

