import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/store/cartContext";
import { ToastProvider } from "@/lib/store/toastContext";
import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://vaishiri.com"),
  title: {
    default: "Vaishiri — Handcrafted Batik Suits, Sarees & Ethnic Wear",
    template: "%s | Vaishiri",
  },
  description:
    "Discover Vaishiri – authentic handcrafted Batik suits, sarees, dresses & ethnic wear crafted with traditional artistry and timeless elegance. Shop authentic Batik clothing at Vaishiri.",
  keywords: [
    "Vaishiri",
    "Vaishiri Clothing",
    "Batik Suits Unstitched",
    "Batik Saree",
    "Cotton 60x60 Suits",
    "Hand Block Print Suits",
    "Wax Batik",
    "Batik Cloth Fabric",
    "Ethnic Wear India",
  ],
  authors: [{ name: "Vaishiri" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vaishiri.com",
    siteName: "Vaishiri",
    title: "Vaishiri — Elegance in Every Thread",
    description: "Authentic handcrafted Batik suits, sarees, dresses & ethnic wear in pure cotton 60×60.",
    images: [
      {
        url: "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/new-wax-batik-cupper-block-unstitched-suits-5366707.jpg?v=1787159888",
        width: 1080,
        height: 1080,
        alt: "Vaishiri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaishiri — Handcrafted Batik & Ethnic Wear",
    description: "Authentic handcrafted Batik clothing blending traditional craftsmanship with modern elegance.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden max-w-full">
      <body className="antialiased min-h-screen flex flex-col bg-background text-text selection:bg-gold-500 selection:text-charcoal-900 overflow-x-hidden max-w-full w-full">
        <ToastProvider>
          <CartProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

