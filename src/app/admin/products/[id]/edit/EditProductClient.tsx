"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Check,
  Eye,
  Layers,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface ColorVariantForm {
  id: string;
  color: string;
  colorHex: string;
  isMultiColor: boolean;
  image: string;
  stock: number;
  skuSuffix: string;
  priceOverride: string;
}

const PRESET_COLORS = [
  { name: "Terracotta Rust", hex: "#86412D" },
  { name: "Mustard Gold", hex: "#D97706" },
  { name: "Emerald Green", hex: "#1B4D3E" },
  { name: "Royal Navy", hex: "#1B365D" },
  { name: "Ruby Maroon", hex: "#8B1E1E" },
  { name: "Rani Pink", hex: "#D81B60" },
  { name: "Warm Amber", hex: "#C47B69" },
  { name: "Rich Charcoal", hex: "#1F2937" },
  { name: "Ivory Cream", hex: "#F5F2EB" },
  { name: "Olive Earth", hex: "#556B2F" },
];

interface EditProductClientProps {
  initialProduct: any;
  categories: Category[];
  collections: Collection[];
  justCreated?: boolean;
}

export default function EditProductClient({
  initialProduct,
  categories,
  collections,
  justCreated = false,
}: EditProductClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreatedNotice, setShowCreatedNotice] = useState(justCreated);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: initialProduct.title || "",
    slug: initialProduct.slug || "",
    sku: initialProduct.sku || "",
    price: String(initialProduct.price || ""),
    compareAtPrice: initialProduct.compareAtPrice ? String(initialProduct.compareAtPrice) : "",
    fabric: initialProduct.fabric || "Pure Cotton",
    occasion: initialProduct.occasion || "Festive & Casual",
    categoryId: initialProduct.categoryId || (categories[0]?.id || ""),
    collectionId: initialProduct.collectionId || "",
    description: initialProduct.description || "",
    isPublished: Boolean(initialProduct.isPublished),
    isFeatured: Boolean(initialProduct.isFeatured),
  });

  // Extract variants from initialProduct
  const initialVariants: ColorVariantForm[] =
    initialProduct.variants && initialProduct.variants.length > 0
      ? initialProduct.variants.map((v: any, idx: number) => ({
          id: v.id || `var-${idx}`,
          color: v.color || `Color ${idx + 1}`,
          colorHex: v.colorHex || "#86412D",
          isMultiColor:
            v.colorHex === "multicolor" ||
            v.color?.toLowerCase().includes("multi"),
          image: v.image || initialProduct.images[0]?.url || "",
          stock: Number(v.stock || 10),
          skuSuffix: v.sku?.split("-").pop() || `V${idx + 1}`,
          priceOverride:
            v.price && v.price !== initialProduct.price ? String(v.price) : "",
        }))
      : [
          {
            id: `var-${Date.now()}`,
            color: "Standard Edition",
            colorHex: "#86412D",
            isMultiColor: false,
            image: initialProduct.images[0]?.url || "",
            stock: initialProduct.inventory?.stockQuantity || 12,
            skuSuffix: "STD",
            priceOverride: "",
          },
        ];

  const [colorVariants, setColorVariants] = useState<ColorVariantForm[]>(initialVariants);
  const [previewColorIdx, setPreviewColorIdx] = useState(0);

  // Additional images outside variants
  const variantImages = new Set(initialVariants.map((v) => v.image));
  const rawExtra = (initialProduct.images || [])
    .map((img: any) => img.url)
    .filter((url: string) => !variantImages.has(url));

  const [extraImages, setExtraImages] = useState<string[]>(
    rawExtra.length > 0
      ? rawExtra
      : [
          "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/marble-print-tie-dye-cotton-suit-set-unstitched-8692842.jpg?v=1787159890",
        ]
  );
  const [newExtraImageUrl, setNewExtraImageUrl] = useState("");

  // Variant operations
  const handleAddColor = (isMulti: boolean = false) => {
    const newId = `var-${Date.now()}`;
    const defaultColor = isMulti ? "Multicolor" : "Emerald Green";
    const defaultHex = isMulti ? "multicolor" : "#1B4D3E";
    const defaultSuffix = isMulti ? "MULTI" : "EMR";
    const defaultImg =
      colorVariants[0]?.image ||
      extraImages[0] ||
      "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/emerald-green-geometric-hand-block-print-cotton-unstitched-suit-set-9178611.jpg?v=1787159894";

    setColorVariants((prev) => [
      ...prev,
      {
        id: newId,
        color: defaultColor,
        colorHex: defaultHex,
        isMultiColor: isMulti,
        image: defaultImg,
        stock: 10,
        skuSuffix: defaultSuffix,
        priceOverride: "",
      },
    ]);
  };

  const handleRemoveColor = (id: string) => {
    if (colorVariants.length <= 1) {
      alert("A product requires at least one colorway or variant.");
      return;
    }
    setColorVariants((prev) => prev.filter((v) => v.id !== id));
    if (previewColorIdx >= colorVariants.length - 1) {
      setPreviewColorIdx(0);
    }
  };

  const handleUpdateColor = (id: string, field: keyof ColorVariantForm, value: any) => {
    setColorVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleAddExtraImage = () => {
    if (newExtraImageUrl.trim()) {
      setExtraImages((prev) => [...prev, newExtraImageUrl.trim()]);
      setNewExtraImageUrl("");
    }
  };

  const handleRemoveExtraImage = (index: number) => {
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Please provide title and price.");
      return;
    }
    if (colorVariants.length === 0) {
      alert("At least one color option is required.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const allImages: string[] = [];
      colorVariants.forEach((v) => {
        if (v.image && !allImages.includes(v.image)) {
          allImages.push(v.image);
        }
      });
      extraImages.forEach((img) => {
        if (img && !allImages.includes(img)) {
          allImages.push(img);
        }
      });

      const effectiveSku = formData.sku.trim() || initialProduct.sku;

      const variantsPayload = colorVariants.map((v, idx) => ({
        id: v.id.startsWith("var-") ? undefined : v.id,
        title: v.color,
        sku: `${effectiveSku}-${(v.skuSuffix || v.color.replace(/[^A-Za-z0-9]/g, "").slice(0, 5) || `VAR${idx + 1}`).toUpperCase()}`,
        color: v.color,
        colorHex: v.isMultiColor ? "multicolor" : v.colorHex,
        size: "Standard Edition",
        price: v.priceOverride ? Number(v.priceOverride) : Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(v.stock) || 10,
        image: v.image || allImages[0],
      }));

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PRODUCT",
          data: {
            id: initialProduct.id,
            title: formData.title,
            slug: formData.slug,
            sku: effectiveSku,
            price: Number(formData.price),
            compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
            fabric: formData.fabric,
            occasion: formData.occasion,
            categoryId: formData.categoryId,
            collectionId: formData.collectionId || null,
            description: formData.description,
            isPublished: formData.isPublished,
            isFeatured: formData.isFeatured,
            images: allImages,
            variants: variantsPayload,
            stockQuantity: variantsPayload.reduce((acc, curr) => acc + curr.stock, 0),
          },
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error || "Failed to save product updates";
        setSaveError(msg);
      }
    } catch (err: any) {
      console.error(err);
      setSaveError(err?.message || "Failed to save product changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${formData.title}"?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE_PRODUCT",
          data: { id: initialProduct.id },
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const activePreviewVariant = colorVariants[previewColorIdx] || colorVariants[0];
  const totalStock = colorVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-border hover:bg-ivory-100 transition-colors text-charcoal-700 rounded-xs"
            title="Return to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-luxury uppercase text-[#86412D] font-bold">
                Catalog Editor
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-700 font-mono">
                {formData.sku}
              </span>
              {formData.isPublished ? (
                <span className="text-[10px] px-2 py-0.2 rounded-xs bg-emerald-100 text-emerald-800 font-semibold uppercase">
                  Published
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.2 rounded-xs bg-gray-100 text-gray-700 font-semibold uppercase">
                  Draft
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
              Edit {formData.title || "Product"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/product/${formData.slug}`}
            target="_blank"
            className="px-3 py-2 border border-border text-charcoal-800 hover:bg-ivory-100 transition-colors text-xs uppercase tracking-luxury flex items-center gap-1.5"
            title="View Live Storefront Drape"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 border border-red-200 text-red-700 hover:bg-red-50 transition-colors rounded-xs text-xs"
            title="Delete this product"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#86412D] hover:bg-[#6c3424] text-white text-xs uppercase tracking-luxury font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {showCreatedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xs flex items-start justify-between shadow-xs">
          <div>
            <p className="font-semibold text-sm text-emerald-950 mb-0.5">
              ✨ Product registered successfully!
            </p>
            <p>
              You are now in edit mode. You can adjust colors, pricing, description, stock quantities, or gallery photography at any time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreatedNotice(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4 text-base leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-sm">All changes have been successfully saved!</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4 text-base leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xs flex items-start justify-between shadow-xs">
          <div>
            <p className="font-semibold text-sm mb-1 text-red-950">Update Error</p>
            <p>{saveError}</p>
          </div>
          <button
            type="button"
            onClick={() => setSaveError(null)}
            className="text-red-700 hover:text-red-950 font-bold ml-4 text-base leading-none"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Essential Attributes Card */}
        <div className="bg-white p-6 sm:p-8 border border-border space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#86412D]" />
              <h2 className="font-serif text-lg text-charcoal-900">Essential Attributes</h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-[#86412D] focus:ring-[#86412D]"
                />
                <span className="font-medium text-charcoal-800">Publish to Store</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-[#86412D] focus:ring-[#86412D]"
                />
                <span className="font-medium text-charcoal-800">Featured Curated</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Creation Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Marble Print Tie & Dye Cotton Suit Set Unstitched"
                className="w-full px-3 py-2.5 bg-ivory-50 border border-border text-sm focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase tracking-luxury text-charcoal-700">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: prev.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, ""),
                    }))
                  }
                  className="text-[10px] text-[#86412D] hover:underline font-semibold"
                >
                  Regenerate from Title
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase tracking-luxury text-charcoal-700">
                  Base SKU *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      sku: `VSH-${Math.floor(10000 + Math.random() * 90000)}`,
                    }))
                  }
                  className="text-[10px] text-[#86412D] hover:underline font-semibold"
                >
                  Regenerate
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="999"
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Compare At Price (₹ INR - Optional)
              </label>
              <input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="1399"
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Collection (Optional)
              </label>
              <select
                value={formData.collectionId}
                onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              >
                <option value="">None / General</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Fabric
              </label>
              <input
                type="text"
                required
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Occasion
              </label>
              <input
                type="text"
                required
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                Artisanal Description & Weave Specifications
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>
          </div>
        </div>

        {/* 2. Colorways & Variants Section */}
        <div className="bg-white p-6 sm:p-8 border border-border space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#86412D]" />
                <h2 className="font-serif text-lg text-charcoal-900">
                  Colorways & Variants ({colorVariants.length})
                </h2>
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Each colorway has its dedicated photography, matching swatch, and inventory count.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddColor(false)}
                className="px-3 py-1.5 border border-[#86412D] text-[#86412D] hover:bg-[#86412D] hover:text-white transition-colors text-xs uppercase tracking-wider font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Solid Color</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddColor(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 text-white hover:opacity-95 transition-opacity text-xs uppercase tracking-wider font-medium flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Multi-Color</span>
              </button>
            </div>
          </div>

          {/* Interactive Drape Preview Bar */}
          <div className="p-4 bg-ivory-100/70 border border-border rounded-xs">
            <span className="text-[10px] uppercase tracking-luxury text-charcoal-600 font-semibold block mb-2">
              Live Drape Colorway Switcher Preview
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {colorVariants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setPreviewColorIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all border ${
                    previewColorIdx === idx
                      ? "border-[#86412D] bg-white shadow-xs font-semibold text-charcoal-900"
                      : "border-border/60 bg-white/70 text-charcoal-600 hover:border-charcoal-400"
                  }`}
                >
                  {v.isMultiColor ? (
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                      style={{
                        background:
                          "conic-gradient(from 180deg at 50% 50%, #E63946 0deg, #F4A261 60deg, #E76F51 120deg, #2A9D8F 180deg, #264653 240deg, #457B9D 300deg, #E63946 360deg)",
                      }}
                    />
                  ) : (
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: v.colorHex }}
                    />
                  )}
                  <span>{v.color || `Option ${idx + 1}`}</span>
                  <span className="text-[10px] text-charcoal-400">({v.stock} in stock)</span>
                </button>
              ))}
            </div>

            {/* Preview Display */}
            {activePreviewVariant && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 bg-white p-3 rounded-xs">
                <div className="relative w-14 aspect-[3/4] bg-ivory-200 border border-border shrink-0">
                  {activePreviewVariant.image && (
                    <Image
                      src={activePreviewVariant.image}
                      alt={activePreviewVariant.color}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <span className="text-xs font-serif font-bold text-charcoal-900 block">
                    Active Drape: {activePreviewVariant.color}
                  </span>
                  <span className="text-[10px] text-charcoal-500 font-mono block">
                    Assigned Image: {activePreviewVariant.image?.slice(0, 50)}...
                  </span>
                  <span className="text-[10px] text-[#86412D] font-medium block mt-0.5">
                    Stock Available: {activePreviewVariant.stock} units
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* List of Variant Editors */}
          <div className="space-y-4">
            {colorVariants.map((v, idx) => (
              <div
                key={v.id}
                className="p-4 border border-border bg-ivory-50/50 rounded-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-charcoal-600">
                      #{idx + 1}
                    </span>
                    <span className="text-xs uppercase tracking-luxury font-serif text-charcoal-900">
                      {v.color || "Untitled Variant"}
                    </span>
                    {v.isMultiColor && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded-full uppercase tracking-wider">
                        Multi-Color Drape
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(v.id)}
                    className="text-charcoal-400 hover:text-red-700 transition-colors p-1"
                    title="Remove variant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-luxury text-charcoal-600 block mb-1">
                      Color Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={v.color}
                      onChange={(e) => handleUpdateColor(v.id, "color", e.target.value)}
                      placeholder="e.g. Royal Maroon"
                      className="w-full px-2.5 py-1.5 bg-white border border-border text-xs focus:outline-none focus:border-[#86412D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-luxury text-charcoal-600 block mb-1">
                      Swatch Tone / Hex
                    </label>
                    {v.isMultiColor ? (
                      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-border text-xs">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{
                            background:
                              "conic-gradient(from 180deg, #E63946, #F4A261, #2A9D8F, #457B9D, #E63946)",
                          }}
                        />
                        <span className="text-charcoal-600 font-mono text-[11px]">Multi-gradient</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={v.colorHex.startsWith("#") ? v.colorHex : "#86412D"}
                          onChange={(e) => handleUpdateColor(v.id, "colorHex", e.target.value)}
                          className="w-8 h-8 p-0 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={v.colorHex}
                          onChange={(e) => handleUpdateColor(v.id, "colorHex", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-border text-xs font-mono uppercase focus:outline-none focus:border-[#86412D]"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-luxury text-charcoal-600 block mb-1">
                      Stock Count (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={v.stock}
                      onChange={(e) =>
                        handleUpdateColor(v.id, "stock", Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-border text-xs focus:outline-none focus:border-[#86412D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-luxury text-charcoal-600 block mb-1">
                      SKU Suffix (e.g. MRN)
                    </label>
                    <input
                      type="text"
                      value={v.skuSuffix}
                      onChange={(e) => handleUpdateColor(v.id, "skuSuffix", e.target.value.toUpperCase())}
                      placeholder="MRN"
                      className="w-full px-2.5 py-1.5 bg-white border border-border text-xs font-mono focus:outline-none focus:border-[#86412D]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[10px] uppercase tracking-luxury text-charcoal-600 block mb-1">
                      Color-Specific Photography URL *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-9 aspect-[3/4] bg-ivory-200 border border-border shrink-0">
                        {v.image && (
                          <Image src={v.image} alt={v.color} fill className="object-cover" />
                        )}
                      </div>
                      <input
                        type="url"
                        required
                        value={v.image}
                        onChange={(e) => handleUpdateColor(v.id, "image", e.target.value)}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 bg-white border border-border text-xs focus:outline-none focus:border-[#86412D]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Additional Gallery Photography */}
        <div className="bg-white p-6 sm:p-8 border border-border space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <ImageIcon className="w-4 h-4 text-[#86412D]" />
            <h2 className="font-serif text-lg text-charcoal-900">
              Additional Gallery Photography ({extraImages.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {extraImages.map((img, idx) => (
              <div key={idx} className="relative group border border-border bg-ivory-100">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExtraImage(idx)}
                  className="absolute top-2 right-2 bg-charcoal-900/80 hover:bg-red-700 text-white p-1 rounded transition-colors opacity-90 group-hover:opacity-100"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="url"
              value={newExtraImageUrl}
              onChange={(e) => setNewExtraImageUrl(e.target.value)}
              placeholder="Paste additional high-resolution image URL (e.g. pallu close-up, border detail)..."
              className="flex-1 px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
            />
            <button
              type="button"
              onClick={handleAddExtraImage}
              className="px-4 py-2 bg-charcoal-900 text-ivory-100 hover:bg-[#86412D] text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              Add Photo
            </button>
          </div>
        </div>

        {/* 4. Stock & Inventory Summary Card */}
        <div className="bg-white p-6 sm:p-8 border border-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#86412D]" />
              <h2 className="font-serif text-lg text-charcoal-900">Total Stock Overview</h2>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider ${
                totalStock <= 3
                  ? "bg-red-100 text-red-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {totalStock} Total Units Available
            </span>
          </div>
          <p className="text-xs text-charcoal-600">
            Total inventory is dynamically synced with the sum of all individual color variant stock counts. When a customer orders a specific color variant, its individual stock is decremented in real-time.
          </p>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 border border-border text-charcoal-700 hover:bg-ivory-100 transition-colors text-xs uppercase tracking-luxury font-medium"
          >
            Cancel / Back to List
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#86412D] hover:bg-[#6c3424] text-white text-xs uppercase tracking-luxury font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Updates..." : "Save Product Updates"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

