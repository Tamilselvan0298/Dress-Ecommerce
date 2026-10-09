"use client";

import React, { useState, useEffect } from "react";
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

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Base Form Data
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    sku: `VSH-${Math.floor(10000 + Math.random() * 90000)}`,
    price: "",
    compareAtPrice: "",
    fabric: "Premium Pure Cotton 60×60",
    occasion: "Casual & Daily Wear, Festive",
    categoryId: "",
    collectionId: "",
    description: "",
  });

  // Additional gallery images (outside color-specific images)
  const [extraImages, setExtraImages] = useState<string[]>([
    "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/marble-print-tie-dye-cotton-suit-set-unstitched-8692842.jpg?v=1787159890",
  ]);
  const [newExtraImageUrl, setNewExtraImageUrl] = useState("");

  // Color Variants with individual images & multi-color support
  const [colorVariants, setColorVariants] = useState<ColorVariantForm[]>([
    {
      id: "var-1",
      color: "Mustard Bloom",
      colorHex: "#D97706",
      isMultiColor: false,
      image:
        "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/mustard-bloom-hand-block-print-cotton-unstitched-suit-set-5986274.jpg?v=1787159890",
      stock: 15,
      skuSuffix: "MST",
      priceOverride: "",
    },
    {
      id: "var-2",
      color: "Multicolor Tie-Dye",
      colorHex: "multicolor",
      isMultiColor: true,
      image:
        "https://cdn.shopify.com/s/files/1/0767/4468/7770/files/marble-print-tie-dye-cotton-suit-set-unstitched-8692842.jpg?v=1787159890",
      stock: 20,
      skuSuffix: "MULTI",
      priceOverride: "",
    },
  ]);

  // Preview interactive state
  const [previewColorIdx, setPreviewColorIdx] = useState(0);

  // Load categories and collections
  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories?.length) {
          setCategories(data.categories);
          setFormData((prev) => ({
            ...prev,
            categoryId: prev.categoryId || data.categories[0].id,
          }));
        }
        if (data.collections?.length) {
          setCollections(data.collections);
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug,
      sku: prev.sku || `VSH-${Math.floor(10000 + Math.random() * 90000)}`,
    }));
  };

  // Add Color Variant (Solid or Multi-Color)
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
        stock: 12,
        skuSuffix: defaultSuffix,
        priceOverride: "",
      },
    ]);
  };

  const handleRemoveColor = (id: string) => {
    if (colorVariants.length <= 1) {
      alert("A product requires at least one color option.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Please fill in title and price.");
      return;
    }
    if (colorVariants.length === 0) {
      alert("Please add at least one color option.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Collect all images (variant images first, then extra images)
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

      const effectiveSku = (formData.sku || `VSH-${Math.floor(10000 + Math.random() * 90000)}`).trim();

      // Prepare variants payload
      const variantsPayload = colorVariants.map((v, idx) => ({
        title: v.color,
        sku: `${effectiveSku}-${(v.skuSuffix || v.color.replace(/[^A-Za-z0-9]/g, "").slice(0, 5) || `VAR${idx + 1}`).toUpperCase()}`,
        color: v.color,
        colorHex: v.isMultiColor ? "multicolor" : v.colorHex,
        size: "Unstitched 3-Piece Set",
        price: v.priceOverride ? Number(v.priceOverride) : Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(v.stock) || 10,
        image: v.image || allImages[0],
      }));

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_PRODUCT",
          data: {
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
            images: allImages,
            variants: variantsPayload,
            initialStock: variantsPayload.reduce((acc, curr) => acc + curr.stock, 0),
          },
        }),
      });

      if (res.ok) {
        const result = await res.json().catch(() => ({}));
        if (result.product?.id) {
          router.push(`/admin/products/${result.product.id}/edit?created=true`);
        } else {
          router.push("/admin/products");
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error || "Failed to create product";
        setSubmitError(msg);
        alert(msg);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Failed to submit product.";
      setSubmitError(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePreviewVariant = colorVariants[previewColorIdx] || colorVariants[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-border hover:bg-ivory-100 transition-colors text-charcoal-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] tracking-luxury uppercase text-[#86412D] font-bold block">
              Creation Suite & Colorways
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-normal">
              New Handcrafted Product
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-start justify-between">
            <div>
              <p className="font-semibold text-sm mb-1">Creation Notice</p>
              <p>{submitError}</p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-red-600 hover:text-red-900 font-bold ml-4 text-base leading-none"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Basic Details Card */}
        <div className="bg-white p-6 sm:p-8 border border-border space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="w-2 h-2 rounded-full bg-[#86412D]" />
            <h2 className="font-serif text-lg text-charcoal-900">Essential Attributes</h2>
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
                onChange={handleTitleChange}
                placeholder="e.g. Marble Print Tie & Dye Cotton Suit Set Unstitched"
                className="w-full px-3 py-2.5 bg-ivory-50 border border-border text-sm focus:outline-none focus:border-[#86412D]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-luxury text-charcoal-700 block mb-1">
                URL Slug *
              </label>
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
                Artisan Story & Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Fabric details, print technique, dupatta specifications, wash instructions..."
                className="w-full px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
              />
            </div>
          </div>
        </div>

        {/* 2. Color Options & Multi-Color Management Card */}
        <div className="bg-white p-6 sm:p-8 border border-border space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#86412D]" />
                <h2 className="font-serif text-lg text-charcoal-900">
                  Color Options & Image Mapping
                </h2>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold uppercase rounded-xs">
                  Interactive PDP Feature
                </span>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Define solid colors or <strong>Multi-Color</strong> options. When customers click any color swatch on the product page, the main image will automatically change to that color&apos;s photo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddColor(false)}
                className="px-3 py-1.5 border border-charcoal-300 text-xs text-charcoal-800 hover:bg-ivory-100 flex items-center gap-1.5 transition-colors font-medium"
              >
                <Plus className="w-3.5 h-3.5 text-[#86412D]" />
                <span>+ Solid Color</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddColor(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Multi-Color</span>
              </button>
            </div>
          </div>

          {/* Color Variants List */}
          <div className="space-y-4">
            {colorVariants.map((variant, index) => (
              <div
                key={variant.id}
                className={`p-4 border transition-all ${
                  previewColorIdx === index
                    ? "border-[#86412D] bg-[#FAF7F2]/60 ring-1 ring-[#86412D]"
                    : "border-border bg-ivory-50/50 hover:border-charcoal-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/70">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-charcoal-800 text-white text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-serif font-semibold text-charcoal-900 text-sm">
                      {variant.color || "Untitled Color"}
                    </span>
                    {variant.isMultiColor ? (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 via-amber-600 to-teal-600 text-white rounded-2xs">
                        Multi-Color Edition
                      </span>
                    ) : (
                      <span className="text-[11px] text-charcoal-500 uppercase font-mono">
                        {variant.colorHex}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewColorIdx(index)}
                      className={`px-2 py-1 text-[11px] uppercase tracking-wider font-semibold border flex items-center gap-1 transition-colors ${
                        previewColorIdx === index
                          ? "bg-[#86412D] text-white border-[#86412D]"
                          : "bg-white text-charcoal-700 border-border hover:bg-ivory-100"
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>{previewColorIdx === index ? "Previewing" : "Preview"}</span>
                    </button>
                    {colorVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(variant.id)}
                        className="p-1 text-charcoal-400 hover:text-red-600 transition-colors"
                        title="Remove color option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Swatch & Visual Column */}
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury text-charcoal-600 block">
                      Color Swatch Style
                    </label>

                    {/* Mode Toggle */}
                    <div className="flex rounded-xs border border-border p-0.5 bg-white">
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateColor(variant.id, "isMultiColor", false);
                          if (variant.colorHex === "multicolor") {
                            handleUpdateColor(variant.id, "colorHex", "#86412D");
                          }
                        }}
                        className={`flex-1 py-1 text-[10px] uppercase font-bold tracking-wider rounded-2xs transition-colors ${
                          !variant.isMultiColor
                            ? "bg-charcoal-900 text-white"
                            : "text-charcoal-600 hover:text-charcoal-900"
                        }`}
                      >
                        Solid
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateColor(variant.id, "isMultiColor", true);
                          handleUpdateColor(variant.id, "colorHex", "multicolor");
                          if (!variant.color.toLowerCase().includes("multi")) {
                            handleUpdateColor(variant.id, "color", `${variant.color} Multicolor`);
                          }
                        }}
                        className={`flex-1 py-1 text-[10px] uppercase font-bold tracking-wider rounded-2xs transition-colors ${
                          variant.isMultiColor
                            ? "bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 text-white"
                            : "text-charcoal-600 hover:text-charcoal-900"
                        }`}
                      >
                        Multi-Color
                      </button>
                    </div>

                    {/* Swatch Preview Box */}
                    <div className="flex items-center gap-3 pt-1">
                      {variant.isMultiColor ? (
                        <div
                          className="w-10 h-10 rounded-full border-2 border-white shadow-md shrink-0 relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)",
                          }}
                          title="Multi-Color Gradient Swatch"
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-white drop-shadow-md">
                            Multi
                          </span>
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full border-2 border-white shadow-md shrink-0"
                          style={{ backgroundColor: variant.colorHex }}
                          title={variant.colorHex}
                        />
                      )}

                      {!variant.isMultiColor ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.colorHex}
                            onChange={(e) =>
                              handleUpdateColor(variant.id, "colorHex", e.target.value)
                            }
                            className="w-8 h-8 cursor-pointer rounded-xs border border-border"
                          />
                          <input
                            type="text"
                            value={variant.colorHex}
                            onChange={(e) =>
                              handleUpdateColor(variant.id, "colorHex", e.target.value)
                            }
                            className="w-20 px-2 py-1 text-xs border border-border font-mono uppercase bg-white"
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] text-charcoal-600 font-medium italic">
                          Rainbow / Multi-tone
                        </span>
                      )}
                    </div>

                    {/* Quick Palette Pills for solid colors */}
                    {!variant.isMultiColor && (
                      <div className="pt-1">
                        <span className="text-[9px] uppercase tracking-wider text-charcoal-500 block mb-1">
                          Preset Hues:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_COLORS.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => {
                                handleUpdateColor(variant.id, "colorHex", preset.hex);
                                if (
                                  !variant.color ||
                                  variant.color.startsWith("Untitled") ||
                                  PRESET_COLORS.some((p) => p.name === variant.color)
                                ) {
                                  handleUpdateColor(variant.id, "color", preset.name);
                                }
                              }}
                              style={{ backgroundColor: preset.hex }}
                              className="w-4 h-4 rounded-full border border-charcoal-300 hover:scale-125 transition-transform"
                              title={preset.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Color Name, SKU, Stock, Price */}
                  <div className="md:col-span-5 space-y-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-luxury text-charcoal-700 block mb-1">
                        Color Option Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={variant.color}
                        onChange={(e) =>
                          handleUpdateColor(variant.id, "color", e.target.value)
                        }
                        placeholder="e.g. Mustard Yellow, Multicolor Tie-Dye"
                        className="w-full px-2.5 py-1.5 bg-white border border-border text-xs focus:outline-none focus:border-[#86412D] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase tracking-luxury text-charcoal-700 block mb-1">
                          SKU Suffix
                        </label>
                        <input
                          type="text"
                          value={variant.skuSuffix}
                          onChange={(e) =>
                            handleUpdateColor(variant.id, "skuSuffix", e.target.value)
                          }
                          placeholder="MST"
                          className="w-full px-2 py-1.5 bg-white border border-border text-xs uppercase"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-luxury text-charcoal-700 block mb-1">
                          Available Stock
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleUpdateColor(variant.id, "stock", Number(e.target.value))
                          }
                          className="w-full px-2 py-1.5 bg-white border border-border text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Associated Color Image */}
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] uppercase tracking-luxury text-[#86412D] font-bold block">
                      Target Photo For This Color *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-14 aspect-[3/4] bg-ivory-200 border border-border shrink-0 overflow-hidden">
                        {variant.image ? (
                          <Image
                            src={variant.image}
                            alt={variant.color}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input
                          type="url"
                          required
                          value={variant.image}
                          onChange={(e) =>
                            handleUpdateColor(variant.id, "image", e.target.value)
                          }
                          placeholder="https://cdn.shopify.com/.../color.jpg"
                          className="w-full px-2 py-1.5 bg-white border border-border text-[11px] focus:outline-none focus:border-[#86412D]"
                        />
                        <span className="text-[10px] text-charcoal-500 block leading-tight">
                          When clicked, PDP switches immediately to this photo.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shopper Interactive Simulator */}
          <div className="mt-6 pt-6 border-t border-border bg-[#FAF7F2] p-5 rounded-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#86412D]" />
                <h3 className="font-serif text-sm font-semibold text-charcoal-900">
                  Live Shopper Color Switch Simulator
                </h3>
              </div>
              <span className="text-[11px] text-charcoal-600">
                Click any swatch below to verify dynamic photo change:
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 border border-[#E8E2D8]">
              {/* Main Simulated Image */}
              <div className="relative w-28 aspect-[3/4] bg-ivory-100 border border-border overflow-hidden shrink-0 shadow-sm">
                {activePreviewVariant?.image ? (
                  <Image
                    src={activePreviewVariant.image}
                    alt={activePreviewVariant.color}
                    fill
                    className="object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-2xs uppercase">
                  Active
                </div>
              </div>

              {/* Swatches and PDP detail mockup */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="text-[11px] text-charcoal-500 uppercase tracking-wider block">
                    Product Detail Simulation
                  </span>
                  <h4 className="font-serif text-base text-charcoal-900 font-semibold">
                    {formData.title || "Sample Handloom Ensembles"}
                  </h4>
                  <div className="text-xs font-bold text-[#86412D]">
                    ₹{formData.price || "999"}
                  </div>
                </div>

                {/* The Color Swatches */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-charcoal-600">Color:</span>
                    <strong className="text-xs font-semibold text-[#86412D]">
                      {activePreviewVariant?.color}
                    </strong>
                    {activePreviewVariant?.isMultiColor && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-2xs">
                        Multi-Color
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {colorVariants.map((v, idx) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setPreviewColorIdx(idx)}
                        className={`relative w-8 h-8 rounded-full transition-transform ${
                          previewColorIdx === idx
                            ? "ring-2 ring-offset-2 ring-[#86412D] scale-110"
                            : "opacity-80 hover:opacity-100 hover:scale-105"
                        } border border-charcoal-300 shadow-xs flex items-center justify-center`}
                        style={{
                          background: v.isMultiColor
                            ? "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%)"
                            : v.colorHex,
                        }}
                        title={v.color}
                      >
                        {previewColorIdx === idx && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              v.colorHex === "#F5F2EB" || v.colorHex === "#FFFFFF"
                                ? "text-charcoal-900"
                                : "text-white"
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Additional Gallery Images Card */}
        <div className="bg-white p-6 sm:p-8 border border-border space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <ImageIcon className="w-4 h-4 text-[#86412D]" />
            <h2 className="font-serif text-lg text-charcoal-900">
              Additional Editorial Images (Optional)
            </h2>
          </div>
          <p className="text-xs text-charcoal-500">
            Add weave close-ups, back angles, or model styling images that apply to the overall garment.
          </p>

          <div className="flex gap-2">
            <input
              type="url"
              value={newExtraImageUrl}
              onChange={(e) => setNewExtraImageUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 px-3 py-2 bg-ivory-50 border border-border text-xs focus:outline-none focus:border-[#86412D]"
            />
            <button
              type="button"
              onClick={handleAddExtraImage}
              className="px-4 py-2 bg-charcoal-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#86412D] transition-colors"
            >
              Add Image
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {extraImages.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] bg-ivory-100 border border-border group overflow-hidden"
              >
                <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveExtraImage(i)}
                  className="absolute top-1 right-1 p-1 bg-charcoal-900/80 text-white hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 rounded-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Bar */}
        <div className="pt-4 border-t border-border flex justify-end gap-3 sticky bottom-4 bg-[#FAF7F2]/90 backdrop-blur-md p-4 border shadow-md">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-border text-xs uppercase tracking-luxury text-charcoal-700 hover:bg-ivory-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-[#86412D] text-white text-xs uppercase tracking-luxury hover:bg-[#6B3323] transition-colors flex items-center gap-2 font-semibold shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Registering Creation..." : "Save Product & Colors"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
