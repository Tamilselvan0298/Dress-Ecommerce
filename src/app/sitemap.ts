import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vaishiri.com";

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/policies/shipping-policy`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/policies/return-policy`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/policies/privacy-policy`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/policies/terms-conditions`, lastModified: new Date(), priority: 0.5 },
  ];

  // Dynamic collections
  const collections = await prisma.collection.findMany({
    select: { slug: true, updatedAt: true },
  });

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic products
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}

