import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowRight, ChevronRight } from "lucide-react";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-luxury text-charcoal-500 mb-6">
        <Link href="/" className="hover:text-charcoal-900">Atelier</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-gold-700 font-semibold">Atelier Journal</span>
      </nav>

      <div className="pb-8 border-b border-border mb-12">
        <span className="text-[10px] tracking-luxury uppercase text-gold-600 block mb-1">
          Loom Literature & Textile Essays
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950">
          The Atelier Journal
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-xl font-light">
          Dispatches on weaving geometry, gold zari conservation, and the living history of Indian handlooms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map((post) => (
          <article key={post.id} className="group flex flex-col bg-ivory-50 border border-border overflow-hidden">
            <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] w-full bg-ivory-200 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-charcoal-900/90 text-ivory-100 text-[10px] uppercase tracking-luxury px-2.5 py-1">
                {post.category}
              </div>
            </Link>

            <div className="p-8 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[11px] text-charcoal-500 block mb-2">
                  {formatDate(post.publishedAt)} • By {post.authorName}
                </span>
                <h2 className="font-serif text-2xl text-charcoal-950 group-hover:text-gold-700 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-3 font-light leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs uppercase tracking-luxury text-charcoal-900 hover:text-gold-600 flex items-center gap-1 font-medium"
                >
                  <span>Read Full Essay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

