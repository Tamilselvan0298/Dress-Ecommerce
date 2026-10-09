"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

export function TextReveal({ text, className, as = "h1", delay = 0 }: TextRevealProps) {
  const words = text.split(" ");
  const Tag = motion[as];

  const container = {
    hidden: { opacity: 0 },
    visible: (customDelay: number) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: customDelay,
      },
    }),
  };

  const child = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Tag
      className={cn("overflow-hidden flex flex-wrap gap-x-[0.28em] gap-y-1", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      custom={delay}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-1">
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

