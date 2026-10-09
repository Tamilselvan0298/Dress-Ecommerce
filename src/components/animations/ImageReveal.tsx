"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
}

export function ImageReveal({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  aspectRatio = "aspect-[3/4]",
}: ImageRevealProps) {
  return (
    <div className={cn("relative overflow-hidden group", aspectRatio, className)}>
      <motion.div
        className="w-full h-full relative"
        initial={{ scale: 1.12, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </motion.div>
    </div>
  );
}

