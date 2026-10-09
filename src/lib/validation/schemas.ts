import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().positive().max(10, "Maximum 10 items per piece"),
});

export const AddressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number (10 digits)"),
  addressLine1: z.string().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code must be valid"),
  country: z.string().default("India"),
});

export const CheckoutRequestSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Cart cannot be empty"),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.enum(["RAZORPAY", "STRIPE", "COD"]),
  notes: z.string().optional(),
});

export const ProductCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3),
  sku: z.string().min(3),
  shortDescription: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  fabric: z.string().min(2),
  weaveType: z.string().optional(),
  pattern: z.string().optional(),
  borderType: z.string().optional(),
  zariType: z.string().optional(),
  occasion: z.string().min(2),
  categoryId: z.string(),
  collectionId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

