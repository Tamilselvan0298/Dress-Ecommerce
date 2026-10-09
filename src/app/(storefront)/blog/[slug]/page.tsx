import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });
  if (!post) return { title: "Essay Not Found" };
  return {
    title: `${post.title} | VAISHIRI CLOTHING`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-luxury text-charcoal-500 mb-8">
        <Link href="/" className="hover:text-charcoal-900">Atelier</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <Link href="/blog" className="hover:text-charcoal-900">Journal</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-gold-700 font-semibold truncate max-w-[200px]">{post.title}</span>
      </nav>

      <div className="space-y-4 mb-8">
        <span className="text-[10px] tracking-luxury uppercase text-gold-600 block">
          {post.category} • {formatDate(post.publishedAt)}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-950 leading-tight">
          {post.title}
        </h1>
        <p className="text-xs text-charcoal-500">By {post.authorName}</p>
      </div>

      <div className="relative aspect-[16/9] w-full bg-ivory-200 border border-border mb-12 overflow-hidden shadow-sm">
        <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
      </div>

      <div className="prose prose-stone max-w-none text-charcoal-800 font-serif text-lg leading-relaxed space-y-6">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-charcoal-800 hover:text-gold-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Essays</span>
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 bg-charcoal-900 text-ivory-100 text-xs uppercase tracking-luxury hover:bg-gold-600"
        >
          Explore Handloom Catalog
        </Link>
      </div>
    </article>
  );
}

