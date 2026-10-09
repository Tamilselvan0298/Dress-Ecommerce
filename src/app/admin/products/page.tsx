import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams?: {
    page?: string;
    search?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const pageSize = 10;
  const search = searchParams?.search?.trim() || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { sku: { contains: search } },
      { fabric: { contains: search } },
    ];
  }

  const [totalProducts, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
        images: { take: 1 },
        inventory: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[10px] tracking-luxury uppercase text-[#86412D] font-bold block mb-1">
            Handloom Catalog
          </span>
          <h1 className="font-serif text-3xl text-charcoal-950 font-normal">
            Products & Silks ({totalProducts})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#86412D] text-white text-xs uppercase tracking-luxury hover:bg-[#6c3424] transition-colors flex items-center gap-1.5 shadow-xs font-semibold w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-border p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <form method="GET" action="/admin/products" className="relative w-full sm:w-80">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by title, SKU, or fabric..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-ivory-50 border border-border focus:outline-none focus:border-[#86412D]"
          />
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-2.5" />
        </form>

        <span className="text-xs text-charcoal-500 self-start sm:self-auto">
          Showing <strong>{(page - 1) * pageSize + 1}</strong>–
          <strong>{Math.min(page * pageSize, totalProducts)}</strong> of <strong>{totalProducts}</strong> products
        </span>
      </div>

      <div className="bg-surface border border-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-ivory-100/70 border-b border-border text-charcoal-600 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-ivory-50/80 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="relative w-10 aspect-[3/4] bg-ivory-200 shrink-0 border border-border">
                        {p.images[0] && (
                          <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <span className="font-serif font-semibold text-charcoal-950 text-sm block">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-charcoal-500 uppercase tracking-wide">
                          SKU: {p.sku} • {p.fabric}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-charcoal-700">{p.category?.name || "General"}</td>
                    <td className="py-3 px-4 font-semibold text-charcoal-950">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          (p.inventory?.stockQuantity || 0) === 0
                            ? "text-red-700"
                            : (p.inventory?.stockQuantity || 0) <= 3
                            ? "text-amber-700"
                            : "text-charcoal-800"
                        }`}
                      >
                        {(p.inventory?.stockQuantity || 0) === 0 ? "0 units (Out of Stock)" : `${p.inventory?.stockQuantity || 0} units`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.isPublished ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200 uppercase">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="px-2.5 py-1 bg-ivory-100 hover:bg-[#86412D] text-charcoal-800 hover:text-white border border-border/80 transition-colors inline-flex items-center gap-1.5 font-medium rounded-xs text-[11px]"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-charcoal-500 hover:text-charcoal-950 hover:bg-ivory-100 rounded-xs transition-colors inline-flex items-center"
                          title="View on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-[#FAF7F2] border-t border-border flex items-center justify-between text-xs text-charcoal-600">
            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              {page > 1 ? (
                <Link
                  href={buildPageUrl(page - 1)}
                  className="px-2.5 py-1 rounded-2xs border border-border bg-white text-charcoal-700 hover:bg-ivory-100 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </Link>
              ) : (
                <span className="px-2.5 py-1 rounded-2xs border border-border/50 bg-ivory-50 text-charcoal-300 flex items-center gap-1 cursor-not-allowed">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <Link
                  key={pg}
                  href={buildPageUrl(pg)}
                  className={`w-7 h-7 flex items-center justify-center rounded-2xs text-xs font-semibold ${
                    page === pg
                      ? "bg-[#86412D] text-white"
                      : "bg-white border border-border text-charcoal-700 hover:bg-ivory-100"
                  }`}
                >
                  {pg}
                </Link>
              ))}

              {page < totalPages ? (
                <Link
                  href={buildPageUrl(page + 1)}
                  className="px-2.5 py-1 rounded-2xs border border-border bg-white text-charcoal-700 hover:bg-ivory-100 flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="px-2.5 py-1 rounded-2xs border border-border/50 bg-ivory-50 text-charcoal-300 flex items-center gap-1 cursor-not-allowed">
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

