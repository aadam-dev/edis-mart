import { NextResponse } from "next/server";
import { z } from "zod";
import { getVariantBySku } from "@/data/catalog";
import { createOrderRecord } from "@/lib/orders";

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
    const data = bodySchema.parse(await req.json());

    for (const item of data.items) {
      const match = getVariantBySku(item.sku);
      if (!match) {
        return NextResponse.json(
          { error: `Unknown SKU ${item.sku}` },
          { status: 400 },
        );
      }
      const expected =
        match.product.channel === "wholesale"
          ? match.variant.wholesalePrice
          : match.variant.retailPrice;
      if (expected == null || expected !== item.unitPrice) {
        return NextResponse.json(
          { error: `Price mismatch for ${item.sku}` },
          { status: 400 },
        );
      }
    }

    const order = createOrderRecord({
      paymentMethod: data.paymentMethod,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      addressLine1: data.addressLine1,
      city: data.city,
      region: data.region,
      notes: data.notes,
      items: data.items,
    });

    return NextResponse.json({
      orderId: order.id,
      reference: order.reference,
      total: order.total,
      order,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
