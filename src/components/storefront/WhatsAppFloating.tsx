"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloating() {
  const brandPhone = "919840123456";
  const defaultMessage = encodeURIComponent(
    "Hello Vaishiri, I would like assistance with selecting an unstitched Batik suit set / placing an order."
  );

  return (
    <aside aria-label="Customer Support Concierge" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 font-sans">
      <a
        href={`https://wa.me/${brandPhone}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3.5 py-2.5 bg-[#86412D] text-white hover:bg-[#6B3323] transition-all duration-300 shadow-xl rounded-full group hover:shadow-2xl"
        aria-label="Chat with Vaishiri Support on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium tracking-wide hidden sm:inline">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
}

