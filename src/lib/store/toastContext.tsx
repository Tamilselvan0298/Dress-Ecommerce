"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShoppingBag, Heart, X, AlertCircle } from "lucide-react";
import Image from "next/image";

export interface ToastItem {
  id: string;
  type?: "cart" | "wishlist" | "info" | "error";
  title: string;
  message?: string;
  image?: string;
  actionText?: string;
  onAction?: () => void;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Portal */}
      <aside
        aria-label="Notifications"
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none font-sans"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto bg-charcoal-900/95 backdrop-blur-md text-ivory-100 p-4 border border-gold-500/40 shadow-2xl flex items-center gap-3.5"
            >
              {toast.image ? (
                <div className="relative w-12 aspect-[3/4] bg-ivory-200 shrink-0 border border-gold-400/40 overflow-hidden">
                  <Image src={toast.image} alt={toast.title} fill className="object-cover" />
                </div>
              ) : toast.type === "cart" ? (
                <div className="w-9 h-9 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/40">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              ) : toast.type === "wishlist" ? (
                <div className="w-9 h-9 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/40">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              ) : toast.type === "error" ? (
                <div className="w-9 h-9 rounded-full bg-red-900/40 text-red-300 flex items-center justify-center shrink-0 border border-red-500/40">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/40">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <span className="font-serif text-sm text-ivory-50 block truncate">
                  {toast.title}
                </span>
                {toast.message && (
                  <span className="text-[11px] text-charcoal-300 block truncate mt-0.5">
                    {toast.message}
                  </span>
                )}
                {toast.actionText && toast.onAction && (
                  <button
                    onClick={toast.onAction}
                    className="text-[10px] text-gold-400 uppercase tracking-luxury hover:underline mt-1 font-semibold"
                  >
                    {toast.actionText}
                  </button>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-charcoal-400 hover:text-ivory-100 p-1"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

