import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

const bodySchema = z.object({
  paymentMethod: z.enum(["paystack", "cod", "whatsapp"]),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(9),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productSlug: z.string(),
        productName: z.string(),
        size: z.string(),
        sku: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    // Recompute totals server-side from submitted unit prices (validated against DB)
    let subtotal = 0;
    for (const item of data.items) {
      const variant = await prisma.variant.findUnique({
        where: { sku: item.sku },
        include: { product: true },
      });
      if (!variant) {
        return NextResponse.json(
          { error: `Unknown SKU ${item.sku}` },
          { status: 400 },
        );
      }
      const expected =
        variant.product.channel === "wholesale"
          ? variant.wholesalePrice
          : variant.retailPrice;
      if (expected == null || expected !== item.unitPrice) {
        return NextResponse.json(
          { error: `Price mismatch for ${item.sku}` },
          { status: 400 },
        );
      }
      subtotal += item.unitPrice * item.quantity;
    }

    const shipping = site.shippingAccraPesewas;
    const total = subtotal + shipping;
    const reference = `YK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        reference,
        status: data.paymentMethod === "cod" ? "pending_cod" : "pending",
        paymentMethod: data.paymentMethod,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        addressLine1: data.addressLine1 || null,
        city: data.city || null,
        region: data.region || null,
        notes: data.notes || null,
        subtotal,
        shipping,
        total,
        items: {
          create: data.items.map((item) => ({
            productSlug: item.productSlug,
            productName: item.productName,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.unitPrice * item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      reference: order.reference,
      total: order.total,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
