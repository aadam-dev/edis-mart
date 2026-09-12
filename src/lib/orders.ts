import { randomUUID } from "crypto";
import { site } from "@/lib/site";

export type StoredOrderItem = {
  productSlug: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
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

const memory = globalThis as unknown as {
  __yeskokoOrders?: Map<string, StoredOrder>;
};

function store() {
  if (!memory.__yeskokoOrders) memory.__yeskokoOrders = new Map();
  return memory.__yeskokoOrders;
}

export function createOrderRecord(input: {
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1?: string;
  city?: string;
  region?: string;
  notes?: string;
  items: Omit<StoredOrderItem, "lineTotal">[];
}): StoredOrder {
  const subtotal = input.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0,
  );
  const shipping = site.shippingAccraPesewas;
  const order: StoredOrder = {
    id: randomUUID(),
    reference: `YK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: input.paymentMethod === "cod" ? "pending_cod" : "pending",
    paymentMethod: input.paymentMethod,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    addressLine1: input.addressLine1 || null,
    city: input.city || null,
    region: input.region || null,
    notes: input.notes || null,
    subtotal,
    shipping,
    total: subtotal + shipping,
    paystackRef: null,
    createdAt: new Date().toISOString(),
    items: input.items.map((i) => ({
      ...i,
      lineTotal: i.unitPrice * i.quantity,
    })),
  };
  store().set(order.id, order);
  store().set(order.reference, order);
  return order;
}

export function getOrderRecord(idOrRef: string) {
  return store().get(idOrRef) ?? null;
}

export function markOrderPaid(reference: string) {
  const order = store().get(reference);
  if (!order) return null;
  const updated = {
    ...order,
    status: "paid",
    paystackRef: reference,
  };
  store().set(order.id, updated);
  store().set(order.reference, updated);
  return updated;
}

export function listOrders() {
  const seen = new Set<string>();
  const out: StoredOrder[] = [];
  for (const order of store().values()) {
    if (seen.has(order.id)) continue;
    seen.add(order.id);
    out.push(order);
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateOrderStatus(id: string, status: string) {
  const order = store().get(id);
  if (!order) return null;
  const updated = { ...order, status };
  store().set(id, updated);
  store().set(order.reference, updated);
  return updated;
}
