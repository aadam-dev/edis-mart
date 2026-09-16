"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatGhs } from "@/lib/site";
import { OpsCredit } from "@/components/ops/OpsCredit";

type Variant = {
  id: string;
  size: string;
  sku: string;
  retailPrice: number | null;
  wholesalePrice: number | null;
  stock: number;
};

type Product = {
  id: string;
  name: string;
  image: string;
  channel: string;
  variants: Variant[];
};

type CartLine = {
  variantId: string;
  productName: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  stock: number;
};

type Session = {
  id: string;
  floatCash: number;
  status: string;
};

export function PosTill({ userName }: { userName: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [method, setMethod] = useState<"momo" | "cash" | "other">("momo");
  const [momoRef, setMomoRef] = useState("");
  const [tendered, setTendered] = useState("");
  const [floatInput, setFloatInput] = useState("0");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);
  const [oversellWarn, setOversellWarn] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/pos/session");
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = await res.json();
    setSession(data.session);
    setProducts(data.products || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const total = useMemo(
    () => cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    [cart],
  );

  const openSession = async () => {
    setBusy(true);
    const res = await fetch("/api/pos/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "open",
        floatCash: Number(floatInput) || 0,
      }),
    });
    const data = await res.json();
    setSession(data.session);
    setBusy(false);
  };

  const addVariant = (product: Product, variant: Variant) => {
    const price =
      product.channel === "wholesale"
        ? variant.wholesalePrice
        : variant.retailPrice;
    if (price == null) return;
    setCart((prev) => {
      const existing = prev.find((l) => l.variantId === variant.id);
      if (existing) {
        return prev.map((l) =>
          l.variantId === variant.id
            ? { ...l, quantity: l.quantity + 1 }
            : l,
        );
      }
      return [
        ...prev,
        {
          variantId: variant.id,
          productName: product.name,
          size: variant.size,
          sku: variant.sku,
          quantity: 1,
          unitPrice: price,
          stock: variant.stock,
        },
      ];
    });
    const nextQty =
      (cart.find((l) => l.variantId === variant.id)?.quantity || 0) + 1;
    if (nextQty > variant.stock) {
      setOversellWarn(
        `${variant.sku}: selling above on-hand (${variant.stock}). Sale still allowed.`,
      );
    }
  };

  const charge = async () => {
    if (!session || cart.length === 0) return;
    setError("");
    setBusy(true);
    const idempotencyKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sale-${Date.now()}`;
    const res = await fetch("/api/pos/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        idempotencyKey,
        paymentMethod: method,
        momoRef: method === "momo" ? momoRef : undefined,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        tendered: method === "cash" ? Number(tendered) || total : total,
        items: cart.map((l) => ({
          variantId: l.variantId,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Charge failed");
      return;
    }
    setLastSaleId(data.sale.id);
    setCart([]);
    setMomoRef("");
    setTendered("");
    setCustomerName("");
    setCustomerPhone("");
    setOversellWarn("");
    load();
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-oat text-forest">
        Loading till...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="label-caps text-sage">Edis Mart till</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Open session
        </h1>
        <p className="mt-2 text-sm text-forest/60">Signed in as {userName}</p>
        <label className="mt-8 block space-y-2 text-sm">
          <span>Cash float (pesewas)</span>
          <input
            type="number"
            value={floatInput}
            onChange={(e) => setFloatInput(e.target.value)}
            className="w-full rounded-xl border border-mist bg-white px-4 py-3"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={openSession}
          className="mt-6 rounded-full bg-clay px-5 py-4 text-base font-semibold text-oat"
        >
          Open till
        </button>
        <Link href="/admin" className="mt-4 text-center text-sm text-clay">
          Back to ops
        </Link>
        <div className="mt-10">
          <OpsCredit />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-oat lg:flex-row">
      <div className="flex-1 border-b border-mist lg:border-b-0 lg:border-r">
        <header className="flex items-center justify-between gap-3 border-b border-mist px-4 py-3">
          <div>
            <p className="font-display text-xl text-forest">Edis Mart till</p>
            <p className="text-xs text-forest/55">Yeskoko · {userName}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-mist px-3 py-2 text-xs font-semibold"
            >
              Ops
            </Link>
            <button
              type="button"
              onClick={async () => {
                const counted = window.prompt(
                  "Counted cash (pesewas)?",
                  String(session.floatCash),
                );
                if (counted == null) return;
                setBusy(true);
                await fetch("/api/pos/session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "close",
                    countedCash: Number(counted) || 0,
                  }),
                });
                setSession(null);
                setCart([]);
                setBusy(false);
                load();
              }}
              className="rounded-full border border-mist px-3 py-2 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className={`overflow-hidden border text-left transition ${
                selected?.id === p.id
                  ? "border-clay bg-white"
                  : "border-mist bg-white/50 hover:border-forest/30"
              }`}
            >
              <div className="relative aspect-square bg-mist">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              </div>
              <div className="p-3">
                <p className="font-display text-lg leading-tight text-forest">
                  {p.name}
                </p>
                <p className="mt-1 text-xs text-forest/55">{p.channel}</p>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="sticky bottom-0 border-t border-mist bg-oat/95 p-4 backdrop-blur">
            <p className="text-sm font-medium text-forest">{selected.name}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.variants.map((v) => {
                const price =
                  selected.channel === "wholesale"
                    ? v.wholesalePrice
                    : v.retailPrice;
                if (price == null) return null;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => addVariant(selected, v)}
                    className="rounded-full border border-forest/20 bg-white px-4 py-3 text-sm font-semibold text-forest active:scale-[0.98]"
                  >
                    {v.size} · {formatGhs(price)}
                    <span className="ml-2 text-xs font-normal text-forest/50">
                      ({v.stock})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <aside className="flex w-full flex-col bg-forest text-oat lg:w-[380px]">
        <div className="border-b border-oat/10 px-4 py-4">
          <p className="text-xs uppercase tracking-wider text-oat/50">Cart</p>
          <p className="mt-1 font-display text-4xl tabular-nums">
            {formatGhs(total)}
          </p>
        </div>
        <ul className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
          {cart.length === 0 && (
            <li className="text-oat/50">Tap a pack, then a size.</li>
          )}
          {cart.map((l) => (
            <li
              key={l.variantId}
              className="flex items-start justify-between gap-2 border-b border-oat/10 pb-2"
            >
              <div>
                <p className="font-medium">
                  {l.productName} · {l.size}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-oat/20 px-2"
                    onClick={() =>
                      setCart((prev) =>
                        prev
                          .map((x) =>
                            x.variantId === l.variantId
                              ? { ...x, quantity: x.quantity - 1 }
                              : x,
                          )
                          .filter((x) => x.quantity > 0),
                      )
                    }
                  >
                    −
                  </button>
                  <span className="tabular-nums">{l.quantity}</span>
                  <button
                    type="button"
                    className="rounded-full border border-oat/20 px-2"
                    onClick={() =>
                      setCart((prev) =>
                        prev.map((x) =>
                          x.variantId === l.variantId
                            ? { ...x, quantity: x.quantity + 1 }
                            : x,
                        ),
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="tabular-nums">
                {formatGhs(l.unitPrice * l.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-3 border-t border-oat/10 px-4 py-4">
          {oversellWarn && (
            <p className="rounded-lg bg-mango/20 px-3 py-2 text-xs text-mango">
              {oversellWarn}
            </p>
          )}
          <input
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-3 text-sm text-oat placeholder:text-oat/40"
          />
          <input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-3 text-sm text-oat placeholder:text-oat/40"
          />
          <div className="flex gap-2">
            {(["momo", "cash", "other"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex-1 rounded-full px-2 py-2.5 text-xs font-semibold capitalize ${
                  method === m ? "bg-clay text-oat" : "bg-oat/10 text-oat/80"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {method === "momo" && (
            <input
              required
              placeholder="MoMo reference"
              value={momoRef}
              onChange={(e) => setMomoRef(e.target.value)}
              className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-3 text-sm text-oat placeholder:text-oat/40"
            />
          )}
          {method === "cash" && (
            <input
              placeholder="Tendered (pesewas)"
              value={tendered}
              onChange={(e) => setTendered(e.target.value)}
              className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-3 text-sm text-oat placeholder:text-oat/40"
            />
          )}
          {error && <p className="text-xs text-mango">{error}</p>}
          <button
            type="button"
            disabled={busy || cart.length === 0}
            onClick={charge}
            className="w-full rounded-full bg-clay py-4 text-base font-semibold text-oat disabled:opacity-50"
          >
            {busy ? "Charging..." : `Charge ${formatGhs(total)}`}
          </button>
          {lastSaleId && (
            <Link
              href={`/pos/receipt/${lastSaleId}`}
              target="_blank"
              className="block text-center text-sm font-semibold text-oat/80 underline"
            >
              Open last receipt
            </Link>
          )}
          <OpsCredit />
        </div>
      </aside>
    </div>
  );
}
