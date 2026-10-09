import React from "react";
import { prisma } from "@/lib/db/prisma";
import { Sliders, Edit3, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContentCMSPage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-[10px] tracking-luxury uppercase text-gold-600 font-semibold block mb-1">
            Storefront CMS & Editorial Merchandising
          </span>
          <h1 className="font-serif text-3xl text-charcoal-950 font-normal">
            Homepage Merchandising Sections ({sections.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="p-6 bg-surface border border-border shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold block">
                  Key: {section.sectionKey}
                </span>
                <h3 className="font-serif text-xl text-charcoal-950 mt-0.5">
                  {section.title}
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] uppercase font-semibold border border-emerald-200">
                Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-charcoal-700">
              <div>
                <span className="text-charcoal-400 block mb-0.5 uppercase tracking-wide text-[10px]">Subtitle / Hook</span>
                <p className="bg-ivory-50 p-2.5 border border-border">{section.subtitle || "None"}</p>
              </div>
              <div>
                <span className="text-charcoal-400 block mb-0.5 uppercase tracking-wide text-[10px]">Editorial Label</span>
                <p className="bg-ivory-50 p-2.5 border border-border">{section.label || "None"}</p>
              </div>
              <div>
                <span className="text-charcoal-400 block mb-0.5 uppercase tracking-wide text-[10px]">Call To Action</span>
                <p className="bg-ivory-50 p-2.5 border border-border font-medium">
                  {section.ctaText} → {section.ctaLink}
                </p>
              </div>
              <div>
                <span className="text-charcoal-400 block mb-0.5 uppercase tracking-wide text-[10px]">Media Asset</span>
                <p className="bg-ivory-50 p-2.5 border border-border truncate text-charcoal-500">
                  {section.mediaUrl}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

