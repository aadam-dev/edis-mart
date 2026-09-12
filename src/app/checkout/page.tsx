"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { formatGhs, site, whatsappLink } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

function loadPaystack(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Paystack failed to load"));
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = items.length ? site.shippingAccraPesewas : 0;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Accra");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<"paystack" | "cod">("paystack");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Reveal>
          <h1 className="font-display text-4xl font-medium tracking-tight text-forest">Nothing to checkout</h1>
          <div className="mt-8">
            <ButtonLink href="/shop">Shop the flakes</ButtonLink>
          </div>
        </Reveal>
      </div>
    );
  }

  const createOrder = async (paymentMethod: "paystack" | "cod" | "whatsapp") => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        addressLine1: address,
        city,
        region: "Greater Accra",
        notes,
        items: items.map((i) => ({
          productSlug: i.productSlug,
          productName: i.productName,
          size: i.size,
          sku: i.sku,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Could not create order");
    }
    return res.json() as Promise<{
      orderId: string;
      reference: string;
      total: number;
      order: {
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
        items: {
          productSlug: string;
          productName: string;
          size: string;
          quantity: number;
          unitPrice: number;
          lineTotal: number;
        }[];
      };
    }>;
  };

  const persistOrder = (order: {
    id: string;
    [key: string]: unknown;
  }) => {
    sessionStorage.setItem(`yeskoko-order-${order.id}`, JSON.stringify(order));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !phone) {
      setError("Name, email, and phone are required.");
      return;
    }
    setBusy(true);
    try {
      if (method === "cod") {
        const order = await createOrder(method);
        persistOrder(order.order);
        clear();
        router.push(`/order/${order.orderId}`);
        return;
      }

      const order = await createOrder("paystack");
      persistOrder(order.order);
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

      if (!publicKey.startsWith("pk_")) {
        // Dev fallback when keys missing: mark as pending and show order
        clear();
        router.push(`/order/${order.orderId}?pendingPay=1`);
        return;
      }

      await loadPaystack();
      const handler = window.PaystackPop!.setup({
        key: publicKey,
        email,
        amount: order.total,
        currency: "GHS",
        ref: order.reference,
        channels: ["card", "mobile_money"],
        metadata: {
          orderId: order.orderId,
          custom_fields: [
            { display_name: "Phone", variable_name: "phone", value: phone },
          ],
        },
        callback: (response: { reference: string }) => {
          fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference }),
          }).finally(() => {
            clear();
            router.push(`/order/${order.orderId}`);
          });
        },
        onClose: () => setBusy(false),
      });
      handler.openIframe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  };

  const waLines = [
    "Hi Yeskoko, checkout via WhatsApp:",
    ...items.map(
      (i) =>
        `• ${i.productName} (${i.size}) x${i.quantity} - ${formatGhs(i.unitPrice * i.quantity)}`,
    ),
    `Total with Accra delivery: ${formatGhs(total)}`,
    `Name: ${name || "..."}`,
    `Phone: ${phone || "..."}`,
  ].join("\n");

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <h1 className="font-display text-5xl font-medium tracking-tight text-forest md:text-6xl">
          Checkout
        </h1>
      </Reveal>
      <form
        onSubmit={onSubmit}
        className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <Reveal delay={0.1}>
          <div className="space-y-5">
            {(
              [
                ["Full name", name, setName, "text"],
                ["Email", email, setEmail, "email"],
                ["Phone", phone, setPhone, "tel"],
                ["Address", address, setAddress, "text"],
                ["City", city, setCity, "text"],
              ] as const
            ).map(([label, value, setter, type]) => (
              <label key={label} className="block space-y-2">
                <span className="text-sm font-medium text-forest/80">{label}</span>
                <input
                  type={type}
                  required={label !== "Address"}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-[0.75rem] border border-mist/80 bg-oat/40 px-4 py-3.5 text-sm text-forest outline-none ring-clay/40 transition focus:ring-2"
                />
              </label>
            ))}
            <label className="block space-y-2">
              <span className="text-sm font-medium text-forest/80">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-[0.75rem] border border-mist/80 bg-oat/40 px-4 py-3.5 text-sm text-forest outline-none ring-clay/40 transition focus:ring-2"
                placeholder="Landmark, pickup preference..."
              />
            </label>

            <fieldset className="space-y-3 pt-4">
              <legend className="text-sm font-medium text-forest/80">Payment</legend>
              {(
                [
                  ["paystack", "Card or MoMo (Paystack)"],
                  ["cod", "Cash on delivery"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-3 rounded-[0.75rem] border px-4 py-3.5 transition ${
                    method === value ? "border-clay bg-clay/5" : "border-mist/80 bg-oat/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === value}
                    onChange={() => setMethod(value)}
                    className="accent-clay"
                  />
                  <span className="text-sm font-medium text-forest">{label}</span>
                </label>
              ))}
            </fieldset>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <aside className="h-fit space-y-6 rounded-[1.5rem] border border-mist/80 bg-mist/20 p-8">
            <h2 className="font-display text-3xl font-medium text-forest">Order</h2>
            <ul className="space-y-3 text-sm text-forest/80">
              {items.map((i) => (
                <li key={i.sku} className="flex justify-between gap-3">
                  <span>
                    {i.productName} ({i.size}) × {i.quantity}
                  </span>
                  <span>{formatGhs(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-mist/80 pt-4 text-sm text-forest/80">
              <span>Delivery</span>
              <span>{formatGhs(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-medium text-forest">
              <span>Total</span>
              <span>{formatGhs(total)}</span>
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="focus-ring mt-2 w-full rounded-full bg-clay px-6 py-3.5 text-sm font-semibold tracking-wide text-oat transition duration-500 hover:bg-forest disabled:opacity-60"
            >
              {busy ? "Processing..." : method === "cod" ? "Place COD order" : "Pay with Paystack"}
            </button>
            <a
              href={whatsappLink(waLines)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm font-medium text-clay transition hover:text-forest hover:underline"
            >
              Or order on WhatsApp
            </a>
          </aside>
        </Reveal>
      </form>
    </div>
  );
}
