"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#121212] text-white/80 font-sans border-t border-charcoal-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Brand Info (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-white block">
                VAISHIRI
              </span>
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#C47B69] font-bold block -mt-1">
                CLOTHING
              </span>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed font-light max-w-sm">
              Discover Vaishiri – authentic handcrafted Batik suits, sarees, dresses & ethnic wear crafted with traditional artistry and timeless elegance.
            </p>

            <div className="pt-2 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C47B69]" />
                <span>care@vaishiri.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C47B69]" />
                <span>+91 98765 43210 (Mon-Sat, 10 AM - 7 PM)</span>
              </div>
            </div>

            {/* Social Media Links matching Vaishiri */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://www.instagram.com/vaishiri_clothing"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#86412D] text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/vaishiriclothing/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#86412D] text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold pb-2 border-b border-white/10">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collections/batik-cloth" className="hover:text-white transition-colors">
                  Batik Cloth
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-white transition-colors">
                  New Arrival
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections (col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold pb-2 border-b border-white/10">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/collections/batik-suits-unstitched" className="hover:text-white transition-colors">
                  Batik Suits Unstitched
                </Link>
              </li>
              <li>
                <Link href="/collections/batik-cloth" className="hover:text-white transition-colors">
                  Wax Batik Fabric
                </Link>
              </li>
              <li>
                <Link href="/collections/cotton-coat-sets" className="hover:text-white transition-colors">
                  Batik Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections/batik-suits-stitched" className="hover:text-white transition-colors">
                  Batik Suits Stitched
                </Link>
              </li>
              <li>
                <Link href="/collections/cotton-batik-bedsheet" className="hover:text-white transition-colors">
                  Cotton Batik Bedsheet
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-white transition-colors">
                  Fresh Off-Loom
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Newsletter (col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold pb-2 border-b border-white/10">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-white/70 mb-5">
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/return-policy" className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </Link>
              </li>
            </ul>

            <span className="text-[11px] uppercase tracking-wider text-[#C47B69] font-bold block">
              Join Newsletter
            </span>
            {isSubscribed ? (
              <span className="text-xs text-emerald-400 block">
                Subscribed! Code: VAISHIRI10
              </span>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-1.5 pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#C47B69]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-3 py-2 bg-[#86412D] text-white text-xs hover:bg-[#6B3323] transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026, Vaishiri. All rights reserved.</p>

          {/* Payment Badges */}
          <div className="flex items-center gap-3 text-[11px] text-white/80">
            <span className="px-2 py-0.5 bg-white/10 rounded-xs">UPI</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-xs">RuPay</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-xs">Visa</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-xs">Mastercard</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-xs">NetBanking</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-xs">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
