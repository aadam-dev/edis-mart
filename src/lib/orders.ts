import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { recordSaleMovement } from "@/lib/stock";

export type StoredOrderItem = {
  productSlug: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variantId?: string | null;
};

export type StoredOrder = {
  id: string;
  reference: string;
  status: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string | null;
  city: string | null;
  region: string | null;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  paystackRef: string | null;
  createdAt: string;
  items: StoredOrderItem[];
};

function mapOrder(order: {
  id: string;
  reference: string;
  status: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string | null;
  city: string | null;
  region: string | null;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  paystackRef: string | null;
  createdAt: Date;
  items: {
    productSlug: string;
    productName: string;
    size: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    variantId: string | null;
  }[];
}): StoredOrder {
  return {
    id: order.id,
    reference: order.reference,
    status: order.status,
    paymentMethod: order.paymentMethod,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    addressLine1: order.addressLine1,
    city: order.city,
    region: order.region,
    notes: order.notes,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    paystackRef: order.paystackRef,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      productSlug: i.productSlug,
      productName: i.productName,
      size: i.size,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal,
      variantId: i.variantId,
    })),
  };
}

export async function createOrderRecord(input: {
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1?: string;
  city?: string;
  region?: string;
  notes?: string;
  items: {
    productSlug: string;
    productName: string;
    size: string;
    sku: string;
    quantity: number;
    unitPrice: number;
  }[];
}): Promise<StoredOrder> {
  const subtotal = input.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0,
  );
  const shipping = site.shippingAccraPesewas;
  const reference = `YK-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;
  const status =
    input.paymentMethod === "cod"
      ? "pending_cod"
      : input.paymentMethod === "whatsapp"
        ? "pending"
        : "pending";

  const resolved = await Promise.all(
    input.items.map(async (item) => {
      const variant = await prisma.variant.findUnique({
        where: { sku: item.sku },
      });
      return {
        variantId: variant?.id ?? null,
        productSlug: item.productSlug,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.unitPrice * item.quantity,
      };
    }),
  );

  const order = await prisma.order.create({
    data: {
      reference,
      status,
      paymentMethod: input.paymentMethod,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      addressLine1: input.addressLine1 ?? null,
      city: input.city ?? null,
      region: input.region ?? null,
      notes: input.notes ?? null,
      subtotal,
      shipping,
      total: subtotal + shipping,
      items: { create: resolved },
    },
    include: { items: true },
  });

  return mapOrder(order);
}

export async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return order ? mapOrder(order) : null;
}

export async function getOrderByReference(reference: string) {
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  return order ? mapOrder(order) : null;
}

export async function listOrders() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return orders.map(mapOrder);
}

export async function updateOrderStatus(id: string, status: string) {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });
  return mapOrder(order);
}

export async function markOrderPaid(reference: string, paystackRef?: string) {
  const existing = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  if (!existing) return null;
  if (existing.status === "paid" || existing.status === "fulfilled") {
    return mapOrder(existing);
  }

  const order = await prisma.order.update({
    where: { reference },
    data: {
      status: "paid",
      paystackRef: paystackRef ?? existing.paystackRef,
    },
    include: { items: true },
  });

  for (const item of order.items) {
    if (!item.variantId) continue;
    const variant = await prisma.variant.findUnique({
      where: { id: item.variantId },
    });
    if (!variant) continue;
    await recordSaleMovement({
      variantId: item.variantId,
      quantity: item.quantity,
      unitCostPesewas: variant.avgCostPesewas,
      refType: "order",
      refId: order.id,
      note: `Web order ${order.reference}`,
    });
  }

  return mapOrder(order);
}
