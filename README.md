# VAISHIRI CLOTHING — Handcrafted Batik Suits, Sarees & Ethnic Wear

A modern luxury e-commerce platform for handcrafted Batik suits, unstitched dress sets, cotton sarees, running fabrics, and artisanal ethnic wear, built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, and Framer Motion.

Repository: [https://github.com/Tamilselvan0298/Dress-Ecommerce.git](https://github.com/Tamilselvan0298/Dress-Ecommerce.git)

---

## ✦ Key Features

### 1. Storefront Experience
- **Hero Banner & Carousel**: Responsive slider with adaptive aspect ratios, touch swipe gestures on mobile, and smooth Framer Motion transitions.
- **Color Variant Switcher**: Clicking any product color swatch instantly changes the drape and photography to that matching colorway.
- **Product Catalog & Collections**: Multi-tier filtering by Category, Fabric, Occasion, and Price with clean numbered pagination (12 items per page).
- **Persistent Wishlist**: Real-time wishlist drawer with badge counts and heart toggle.
- **Shopping Cart & Checkout**: Slide-out cart drawer, coupon voucher engine (`VAISHIRI10`, `ROYAL10`), and multi-gateway checkout (Razorpay, Stripe, COD).
- **Fully Responsive & Zero Overflow**: Optimized for mobile (360px–480px), tablet, laptop, and ultra-wide screens with strict `overflow-x: hidden` locking.

### 2. Comprehensive Admin Suite (`/admin`)
- **Inventory Ledger (`/admin/inventory`)**:
  - Live stock metrics (Total Pieces, Valuation, Low Stock, Out of Stock).
  - Search by title, SKU, or fabric.
  - Category and stock level filters with dynamic active counts (no confusing default brackets).
  - Quick inline stock adjustments (+1, -1, +5, +10, direct number entry).
  - Responsive layout with paginated tables.
- **Product Management (`/admin/products`)**:
  - Full catalog listing with pagination and search.
  - Add new products (`/admin/products/new`) with multi-color image upload and variant mapping.
  - Edit existing products (`/admin/products/[id]/edit`) with live image reordering and stock threshold updates.
- **Order Tracking (`/admin/orders`)**:
  - Live fulfillment lifecycle transitions (Confirmed, Processing, Shipped, Delivered).
- **Promotions & Coupons (`/admin/coupons`)**:
  - Percentage and fixed discount rules with expiration dates.

---

## ✦ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with responsive breakpoints |
| **Database & ORM** | SQLite (development zero-setup) / PostgreSQL with Prisma ORM |
| **Animations** | Framer Motion, Lenis Smooth Scroll |
| **Icons** | Lucide React |
| **Validation** | Zod |

---

## ✦ Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/Tamilselvan0298/Dress-Ecommerce.git
cd Dress-Ecommerce
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

### 3. Database Setup & Seeding
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed luxury products, categories, collections, and demo orders
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit the application in your browser:
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Shop Catalog**: [http://localhost:3000/shop](http://localhost:3000/shop)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Inventory Control**: [http://localhost:3000/admin/inventory](http://localhost:3000/admin/inventory)

---

## ✦ Production Build
```bash
npm run build
npm start
```
