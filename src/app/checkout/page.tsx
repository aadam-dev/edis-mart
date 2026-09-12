"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { formatGhs, site, whatsappLink } from "@/lib/site";
import { ButtonLink } from "@/components/ButtonLink";

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
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Nothing to checkout</h1>
        <div className="mt-6">
          <ButtonLink href="/shop">Shop the flakes</ButtonLink>
        </div>
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
    }>;
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
        const order = await createOrder("cod");
        clear();
        router.push(`/order/${order.orderId}`);
        return;
      }

      const order = await createOrder("paystack");
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
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Checkout
      </h1>
      <form
        onSubmit={onSubmit}
        className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-4">
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
              <span className="text-sm font-semibold">{label}</span>
              <input
                type={type}
                required={label !== "Address"}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full rounded-lg border border-mist bg-white px-3 py-3 text-sm outline-none ring-leaf focus:ring-2"
              />
            </label>
          ))}
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-mist bg-white px-3 py-3 text-sm outline-none ring-leaf focus:ring-2"
              placeholder="Landmark, pickup preference..."
            />
          </label>

          <fieldset className="space-y-3 pt-2">
            <legend className="text-sm font-semibold">Payment</legend>
            {(
              [
                ["paystack", "Card or MoMo (Paystack)"],
                ["cod", "Cash on delivery"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 border px-4 py-3 ${
                  method === value ? "border-leaf bg-leaf/5" : "border-mist bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={method === value}
                  onChange={() => setMethod(value)}
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <aside className="h-fit space-y-4 border border-mist bg-white p-6">
          <h2 className="font-display text-xl font-semibold">Order</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.sku} className="flex justify-between gap-3">
                <span>
                  {i.productName} ({i.size}) × {i.quantity}
                </span>
                <span>{formatGhs(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-mist pt-3 text-sm">
            <span>Delivery</span>
            <span>{formatGhs(shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatGhs(total)}</span>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="focus-ring w-full rounded-full bg-leaf px-5 py-3 text-base font-semibold text-white hover:bg-forest disabled:opacity-60"
          >
            {busy ? "Processing..." : method === "cod" ? "Place COD order" : "Pay with Paystack"}
          </button>
          <a
            href={whatsappLink(waLines)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm font-semibold text-leaf hover:underline"
          >
            Or order on WhatsApp
          </a>
        </aside>
      </form>
    </div>
  );
}
