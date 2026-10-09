import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });
    if (pageNum > 1) {
      params.set("page", String(pageNum));
    }
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="pt-12 pb-6 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
      <div className="text-xs text-charcoal-500">
        Showing <strong className="text-charcoal-900 font-semibold">{startIdx}</strong>–
        <strong className="text-charcoal-900 font-semibold">{endIdx}</strong> of{" "}
        <strong className="text-charcoal-900 font-semibold">{totalCount}</strong> handcrafted creations
      </div>

      <nav className="inline-flex items-center gap-1.5" aria-label="Catalog Pagination">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="p-2 border border-[#E8E2D8] bg-white text-charcoal-700 hover:bg-ivory-100 hover:text-[#86412D] transition-colors rounded-xs"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : (
          <span className="p-2 border border-[#E8E2D8]/60 bg-ivory-50 text-charcoal-300 rounded-xs cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </span>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((p, idx) =>
          typeof p === "number" ? (
            <Link
              key={idx}
              href={buildUrl(p)}
              className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-xs transition-colors ${
                currentPage === p
                  ? "bg-[#86412D] text-white shadow-xs"
                  : "bg-white border border-[#E8E2D8] text-charcoal-700 hover:bg-ivory-100 hover:text-[#86412D]"
              }`}
            >
              {p}
            </Link>
          ) : (
            <span key={idx} className="w-8 text-center text-charcoal-400 text-xs">
              ...
            </span>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="p-2 border border-[#E8E2D8] bg-white text-charcoal-700 hover:bg-ivory-100 hover:text-[#86412D] transition-colors rounded-xs"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="p-2 border border-[#E8E2D8]/60 bg-ivory-50 text-charcoal-300 rounded-xs cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </nav>
    </div>
  );
}

