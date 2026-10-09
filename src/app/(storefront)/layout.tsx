import React from "react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickSearchModal } from "@/components/storefront/QuickSearchModal";
import { WhatsAppFloating } from "@/components/storefront/WhatsAppFloating";
import BackToTop from "@/components/storefront/BackToTop";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full w-full">
      <Header />
      <main className="flex-1 overflow-x-hidden max-w-full w-full">{children}</main>
      <Footer />
      <CartDrawer />
      <QuickSearchModal />
      <WhatsAppFloating />
      <BackToTop />
    </div>
  );
}

