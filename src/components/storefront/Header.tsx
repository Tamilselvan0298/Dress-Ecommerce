"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, ChevronRight, Sparkles, User } from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ANNOUNCEMENTS = [
  "Welcome to Vaishiri — Elegance in Every Thread",
  "Free Shipping on Orders Above ₹999",
  "Get 10% OFF on Your First Order — Use Code: VAISHIRI10",
];

export function Header() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen, setIsSearchOpen, wishlist } = useCart();
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Rotating Announcement Bar
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Scroll detection for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Batik Cloth", href: "/collections/batik-cloth" },
    { name: "New Arrival", href: "/collections/new-arrivals" },
    { name: "Shop", href: "/shop" },
    { name: "Catalog", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 font-sans transition-all duration-300">
        {/* 1. TOP ANNOUNCEMENT BAR (Terracotta / Deep Rust matching avantikaclothing.com) */}
        <div className="bg-[#86412D] text-white text-[11px] sm:text-xs py-2 px-4 relative overflow-hidden text-center tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4 text-[10px] text-white/80">
              <span>COD Available Across India</span>
              <span>•</span>
              <span>100% Pure Cotton 60×60</span>
            </div>

            <div className="flex-1 flex justify-center items-center overflow-hidden h-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnnouncement}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="font-medium tracking-wide flex items-center gap-2"
                >
                  <Sparkles className="w-3 h-3 text-gold-300 hidden sm:inline-block" />
                  <span>{ANNOUNCEMENTS[currentAnnouncement]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden md:flex items-center gap-3 text-[10px] text-white/80">
              <span className="font-semibold text-white">INR ₹</span>
              <span>|</span>
              <a
                href="https://www.instagram.com/vaishiri_clothing/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-200 transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* 2. MAIN NAVIGATION BAR */}
        <div
          className={cn(
            "bg-white border-b border-[#E8E2D8] transition-all duration-300",
            isScrolled ? "py-3 shadow-md" : "py-4 sm:py-5"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className="p-1.5 text-charcoal-900 hover:text-terracotta-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isCatalog = link.name === "Catalog";

                return (
                  <div key={link.name} className="relative group py-2">
                    <Link
                      href={link.href}
                      className={cn(
                        "text-xs tracking-wider uppercase transition-colors relative py-1 font-medium flex items-center gap-1",
                        isActive
                          ? "text-[#86412D] font-bold"
                          : "text-charcoal-800 hover:text-[#86412D]"
                      )}
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="navIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#86412D]"
                        />
                      )}
                    </Link>

                    {/* Mega Dropdown for Catalog */}
                    {isCatalog && (
                      <div className="absolute top-full -left-12 hidden group-hover:block pt-2 w-72 z-50 transition-all">
                        <div className="bg-white border border-[#E8E2D8] shadow-xl p-3 space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#86412D] font-semibold px-2 block mb-1">
                            Browse Categories
                          </span>
                          <Link
                            href="/collections/batik-suits-unstitched"
                            className="block p-2 hover:bg-[#F5F1EC] transition-colors rounded-xs"
                          >
                            <p className="text-xs font-medium text-charcoal-900">Batik Suits Unstitched</p>
                            <p className="text-[10px] text-charcoal-500 font-light">3-Piece Set in Cotton 60×60</p>
                          </Link>
                          <Link
                            href="/collections/batik-cloth"
                            className="block p-2 hover:bg-[#F5F1EC] transition-colors rounded-xs"
                          >
                            <p className="text-xs font-medium text-charcoal-900">Batik Cloth & Fabric</p>
                            <p className="text-[10px] text-charcoal-500 font-light">Running Hand Block Cotton</p>
                          </Link>
                          <Link
                            href="/collections/cotton-coat-sets"
                            className="block p-2 hover:bg-[#F5F1EC] transition-colors rounded-xs"
                          >
                            <p className="text-xs font-medium text-charcoal-900">Batik Sarees</p>
                            <p className="text-[10px] text-charcoal-500 font-light">Authentic Wax Resist Sarees</p>
                          </Link>
                          <Link
                            href="/collections/batik-suits-stitched"
                            className="block p-2 hover:bg-[#F5F1EC] transition-colors rounded-xs"
                          >
                            <p className="text-xs font-medium text-charcoal-900">Batik Suits Stitched</p>
                            <p className="text-[10px] text-charcoal-500 font-light">Ready to Wear Ensembles</p>
                          </Link>
                          <Link
                            href="/collections/cotton-batik-bedsheet"
                            className="block p-2 hover:bg-[#F5F1EC] transition-colors rounded-xs"
                          >
                            <p className="text-xs font-medium text-charcoal-900">Cotton Batik Bedsheet</p>
                            <p className="text-[10px] text-charcoal-500 font-light">Handmade King & Queen Sheets</p>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Brand Logo (Center) - Authentic Vaishiri Branding */}
            <div className="text-center">
              <Link href="/" className="inline-block group">
                <div className="flex flex-col items-center">
                  <span className="font-serif tracking-[0.25em] text-xl sm:text-2xl md:text-3xl font-normal text-charcoal-950 uppercase leading-tight group-hover:text-[#86412D] transition-colors">
                    VAISHIRI
                  </span>
                  <span className="text-[9px] tracking-[0.45em] uppercase font-sans text-[#86412D] font-semibold -mt-0.5">
                    CLOTHING
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5 text-charcoal-800">
              {/* Currency badge (desktop) */}
              <div className="hidden sm:flex items-center text-[11px] font-medium text-charcoal-600 px-2 py-0.5 border border-border rounded-xs">
                <span>IN / INR ₹</span>
              </div>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search Catalog"
                className="p-1.5 hover:text-[#86412D] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                aria-label="Wishlist"
                className="p-1.5 hover:text-[#86412D] transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#86412D] text-white text-[10px] flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                aria-label="My Account"
                className="p-1.5 hover:text-[#86412D] transition-colors hidden sm:inline-block"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Bag with Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
                className="p-1.5 hover:text-[#86412D] transition-colors relative flex items-center gap-1.5"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#86412D] text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal-950/60 z-50 lg:hidden backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 w-[82vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col font-sans"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-[#F5F1EC]">
                <div>
                  <span className="font-serif tracking-widest text-lg font-medium text-charcoal-950 uppercase block">
                    VAISHIRI
                  </span>
                  <span className="text-[9px] tracking-[0.35em] text-[#86412D] uppercase font-semibold">
                    CLOTHING
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-charcoal-700 hover:text-charcoal-950"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <nav className="space-y-3 pb-6 border-b border-border">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between text-sm uppercase tracking-wider text-charcoal-900 hover:text-[#86412D] py-1.5 font-medium transition-colors"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-charcoal-400" />
                    </Link>
                  ))}
                </nav>

                {/* Mobile Drawer Quick Account / Wishlist */}
                <div className="py-3 border-b border-border flex items-center justify-between text-xs">
                  <Link
                    href="/account/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-charcoal-800 hover:text-[#86412D] font-medium py-1"
                  >
                    <Heart className="w-4 h-4 text-[#86412D]" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </Link>

                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-charcoal-800 hover:text-[#86412D] font-medium py-1"
                  >
                    <User className="w-4 h-4 text-[#86412D]" />
                    <span>My Account</span>
                  </Link>
                </div>

                {/* Popular Collections Shortcut */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] tracking-widest uppercase text-[#86412D] font-bold block mb-3">
                    Featured Archives
                  </span>
                  <Link
                    href="/collections/batik-suits-unstitched"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xs text-charcoal-700 hover:text-[#86412D] py-1"
                  >
                    Batik Suits Unstitched (Cotton 60×60)
                  </Link>
                  <Link
                    href="/collections/batik-cloth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xs text-charcoal-700 hover:text-[#86412D] py-1"
                  >
                    Wax Batik Meterage Cloth
                  </Link>
                  <Link
                    href="/collections/cotton-coat-sets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xs text-charcoal-700 hover:text-[#86412D] py-1"
                  >
                    Handcrafted Batik Sarees
                  </Link>
                  <Link
                    href="/collections/cotton-batik-bedsheet"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xs text-charcoal-700 hover:text-[#86412D] py-1"
                  >
                    Cotton Batik Bedsheets
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-border bg-[#F5F1EC] space-y-3">
                <div className="text-xs text-charcoal-600 flex items-center justify-between">
                  <span>Support: care@vaishiri.com</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-[#86412D]">
                  <a
                    href="https://www.instagram.com/vaishiri_clothing"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Instagram @vaishiri
                  </a>
                  <span>•</span>
                  <a
                    href="https://www.facebook.com/vaishiriclothing/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
