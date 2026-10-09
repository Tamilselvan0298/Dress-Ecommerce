import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { paymentService } from "@/lib/payments/paymentProvider";
import { shippingService } from "@/lib/shipping/shippingProvider";
import { emailService } from "@/lib/email/emailProvider";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, shippingAddress, billingAddress, couponCode, paymentMethod, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart cannot be empty" }, { status: 400 });
    }

    if (!customer?.email || !customer?.name || !shippingAddress?.addressLine1) {
      return NextResponse.json({ error: "Required customer and address details are missing" }, { status: 400 });
    }

    // CRITICAL SECURITY RULE (Section 83):
    // Never trust frontend prices. Server must fetch the product and calculate everything from scratch.
    const productIds = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        inventory: true,
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const validatedOrderItems: Array<{
      productId: string;
      variantId: string | null;
      productTitle: string;
      sku: string;
      purchasedPrice: number;
      originalPrice: number;
      quantity: number;
      total: number;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      // Concurrency inventory validation
      if (product.inventory && product.inventory.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${product.title}. Only ${product.inventory.stockQuantity} remaining.` },
          { status: 409 }
        );
      }

      const verifiedPrice = product.price; // Authentic server-side price
      const itemTotal = verifiedPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedOrderItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productTitle: product.title,
        sku: product.sku,
        purchasedPrice: verifiedPrice,
        originalPrice: product.compareAtPrice || verifiedPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Coupon discount calculation server-side
    let discountTotal = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive && calculatedSubtotal >= coupon.minOrderValue) {
        if (coupon.discountType === "PERCENTAGE") {
          discountTotal = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discountTotal > coupon.maxDiscount) {
            discountTotal = coupon.maxDiscount;
          }
        } else {
          discountTotal = coupon.discountValue;
        }
      }
    }

    // Shipping calculation server-side
    const shippingQuote = await shippingService.calculateShipping({
      pincode: shippingAddress.postalCode,
      orderTotal: calculatedSubtotal,
    });
    const shippingTotal = shippingQuote.fee;

    // GST calculation (5% standard luxury textile GST)
    const taxTotal = Math.round(calculatedSubtotal * 0.05);

    // Final grand total
    const grandTotal = Math.max(0, calculatedSubtotal - discountTotal + shippingTotal + taxTotal);
    const orderNumber = generateOrderNumber();

    // Execute atomic creation and inventory reservation inside a transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone || "+91 9999999999",
          status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING_PAYMENT",
          subtotal: calculatedSubtotal,
          discountTotal,
          taxTotal,
          shippingTotal,
          grandTotal,
          currency: "INR",
          shippingAddressJson: JSON.stringify(shippingAddress),
          billingAddressJson: JSON.stringify(billingAddress || shippingAddress),
          notes: notes || null,
          courierName: shippingQuote.courierName,
          items: {
            create: validatedOrderItems,
          },
          statusHistory: {
            create: {
              status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING_PAYMENT",
              note: `Order registered via checkout with ${paymentMethod}`,
              changedBy: "Checkout Gateway",
            },
          },
        },
        include: {
          items: true,
        },
      });

      // Atomically decrement inventory & record transaction
      for (const item of validatedOrderItems) {
        await tx.inventory.updateMany({
          where: { productId: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            reservedQuantity: { increment: item.quantity },
          },
        });
      }

      return order;
    });

    // Initialize Payment Gateway
    const paymentGatewayDetails = await paymentService.createPaymentOrder(paymentMethod, {
      orderNumber: createdOrder.orderNumber,
      amount: grandTotal,
      currency: "INR",
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
    });

    // Fire asynchronous order confirmation email
    emailService.sendOrderConfirmation({
      customerName: customer.name,
      customerEmail: customer.email,
      orderNumber: createdOrder.orderNumber,
      grandTotal: createdOrder.grandTotal,
      items: validatedOrderItems.map((i) => ({
        title: i.productTitle,
        quantity: i.quantity,
        price: i.purchasedPrice,
      })),
    });

    return NextResponse.json({
      success: true,
      orderNumber: createdOrder.orderNumber,
      orderId: createdOrder.id,
      grandTotal,
      paymentMethod,
      paymentDetails: paymentGatewayDetails,
    });
  } catch (error) {
    console.error("Checkout process error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during order processing. Please try again." },
      { status: 500 }
    );
  }
}

