"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  formatGhs,
  formatGhPhoneDisplay,
  ghsToPesewas,
  isValidGhPhone,
  normalizeGhPhone,
  pesewasToGhsInput,
  resolveTillPrice,
} from "@/lib/site";
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
  image: string;
};

type Session = {
  id: string;
  floatCash: number;
  status: string;
};

type CustomerHit = {
  id: string;
  name: string;
  phone: string;
};

type PayMethod = "momo" | "cash" | "bank";

function variantPrice(product: Product, variant: Variant) {
  return resolveTillPrice(
    product.channel,
    variant.retailPrice,
    variant.wholesalePrice,
  );
}

function sellableVariants(product: Product) {
  return product.variants.filter((v) => variantPrice(product, v) != null);
}

export function PosTill({ userName }: { userName: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [expectedCash, setExpectedCash] = useState(0);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [salePanel, setSalePanel] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [suggestions, setSuggestions] = useState<CustomerHit[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [splitPay, setSplitPay] = useState(false);
  const [method, setMethod] = useState<PayMethod>("momo");
  const [momoGhs, setMomoGhs] = useState("");
  const [cashGhs, setCashGhs] = useState("");
  const [bankGhs, setBankGhs] = useState("");
  const [momoRef, setMomoRef] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [tenderedGhs, setTenderedGhs] = useState("");
  const [floatGhs, setFloatGhs] = useState("0");
  const [countedGhs, setCountedGhs] = useState("");
  const [closing, setClosing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);
  const [oversellWarn, setOversellWarn] = useState("");
  const suggestRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/pos/session");
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    if (!res.ok) {
      setError("Could not load till");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setSession(data.session);
    setProducts(data.products || []);
    setExpectedCash(data.expectedCash ?? data.session?.floatCash ?? 0);
    if (data.expectedCash != null) {
      setCountedGhs(pesewasToGhsInput(data.expectedCash));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!suggestRef.current?.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const searchCustomers = (q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      const res = await fetch(
        `/api/admin/customers?q=${encodeURIComponent(q.trim())}&limit=8`,
      );
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.customers || []);
      setShowSuggest(true);
    }, 200);
  };

  const total = useMemo(
    () => cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    [cart],
  );
  const cartCount = useMemo(
    () => cart.reduce((s, l) => s + l.quantity, 0),
    [cart],
  );
  const cartOversell = cart.some((l) => l.quantity > l.stock);

  const paymentAmounts = useMemo(() => {
    if (!splitPay) {
      return {
        cash: method === "cash" ? total : 0,
        momo: method === "momo" ? total : 0,
        bank: method === "bank" ? total : 0,
      };
    }
    return {
      cash: ghsToPesewas(cashGhs),
      momo: ghsToPesewas(momoGhs),
      bank: ghsToPesewas(bankGhs),
    };
  }, [splitPay, method, total, cashGhs, momoGhs, bankGhs]);

  const paidSum =
    paymentAmounts.cash + paymentAmounts.momo + paymentAmounts.bank;
  const splitRemaining = total - paidSum;
  const tenderedPesewas =
    paymentAmounts.cash > 0
      ? Math.max(ghsToPesewas(tenderedGhs || "0"), paymentAmounts.cash)
      : total;
  const changeDue =
    paymentAmounts.cash > 0
      ? Math.max(0, tenderedPesewas - paymentAmounts.cash)
      : 0;

  const addLine = (product: Product, variant: Variant) => {
    const price = variantPrice(product, variant);
    if (price == null) {
      setError("No till price for this size");
      return;
    }
    setError("");
    setCart((prev) => {
      const existing = prev.find((l) => l.variantId === variant.id);
      const nextQty = (existing?.quantity || 0) + 1;
      if (nextQty > variant.stock) {
        setOversellWarn(
          `${variant.sku}: selling above on-hand (${variant.stock}). Sale still allowed.`,
        );
      }
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
          image: product.image,
        },
      ];
    });
    setPicking(null);
    setSalePanel(true);
  };

  const onProductTap = (product: Product) => {
    const sellable = sellableVariants(product);
    if (sellable.length === 0) {
      setError("No till price for this pack");
      return;
    }
    if (sellable.length === 1) {
      addLine(product, sellable[0]);
      return;
    }
    setError("");
    setPicking(product);
  };

  const setQty = (variantId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.max(0, quantity) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  };

  const pickCustomer = (c: CustomerHit) => {
    setCustomerName(c.name);
    setCustomerPhone(formatGhPhoneDisplay(c.phone));
    setPhoneError("");
    setShowSuggest(false);
    setSuggestions([]);
  };

  const validatePhoneField = (value: string) => {
    if (!value.trim()) {
      setPhoneError("");
      return true;
    }
    if (!isValidGhPhone(value)) {
      setPhoneError("Use a Ghana number, e.g. 0549092316");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const openSession = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/pos/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "open",
        floatCash: ghsToPesewas(floatGhs),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not open till");
      return;
    }
    setSession(data.session);
    await load();
  };

  const closeSession = async () => {
    if (!session) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/pos/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "close",
        sessionId: session.id,
        countedCash: ghsToPesewas(countedGhs),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not close till");
      return;
    }
    setSession(null);
    setCart([]);
    setClosing(false);
    setSalePanel(false);
    await load();
  };

  const charge = async () => {
    if (!session || cart.length === 0) return;
    setError("");

    if (customerName.trim() && !customerPhone.trim()) {
      setPhoneError("Phone is required with a customer name");
      return;
    }
    if (customerPhone.trim() && !validatePhoneField(customerPhone)) {
      return;
    }
    if (paidSum !== total) {
      setError(
        splitPay
          ? `Split must total ${formatGhs(total)} (now ${formatGhs(paidSum)})`
          : "Payment total mismatch",
      );
      return;
    }
    if (paymentAmounts.cash > 0 && tenderedPesewas < paymentAmounts.cash) {
      setError("Cash tendered is less than the cash portion");
      return;
    }

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
        paymentMethod: splitPay ? "split" : method,
        cashPesewas: paymentAmounts.cash,
        momoPesewas: paymentAmounts.momo,
        bankPesewas: paymentAmounts.bank,
        momoRef: momoRef.trim() || undefined,
        bankRef: bankRef.trim() || undefined,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim()
          ? normalizeGhPhone(customerPhone) || customerPhone
          : undefined,
        tendered:
          paymentAmounts.cash > 0 ? tenderedPesewas : total,
        items: cart.map((l) => ({
          variantId: l.variantId,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Charge failed");
      return;
    }
    const saleId = data.sale.id as string;
    setLastSaleId(saleId);
    setCart([]);
    setMomoRef("");
    setBankRef("");
    setMomoGhs("");
    setCashGhs("");
    setBankGhs("");
    setTenderedGhs("");
    setCustomerName("");
    setCustomerPhone("");
    setOversellWarn("");
    setSplitPay(false);
    setSalePanel(false);
    window.open(`/pos/receipt/${saleId}`, "_blank", "noopener,noreferrer");
    await load();
  };

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-oat text-forest">
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
          <span>Cash float (₵)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={floatGhs}
            onChange={(e) => setFloatGhs(e.target.value)}
            className="w-full rounded-xl border border-mist bg-white px-4 py-3"
          />
        </label>
        {error && <p className="mt-3 text-sm text-clay">{error}</p>}
        <button
          type="button"
          disabled={busy}
          onClick={openSession}
          className="mt-6 rounded-full bg-clay px-5 py-4 text-base font-semibold text-oat"
        >
          {busy ? "Opening..." : "Open till"}
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

  if (closing) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="label-caps text-sage">Close till</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-forest">
          Count the drawer
        </h1>
        <p className="mt-3 text-sm text-forest/60">
          Expected cash {formatGhs(expectedCash)} (float + cash portions).
        </p>
        <label className="mt-8 block space-y-2 text-sm">
          <span>Counted cash (₵)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={countedGhs}
            onChange={(e) => setCountedGhs(e.target.value)}
            className="w-full rounded-xl border border-mist bg-white px-4 py-3"
          />
        </label>
        {error && <p className="mt-3 text-sm text-clay">{error}</p>}
        <button
          type="button"
          disabled={busy}
          onClick={closeSession}
          className="mt-6 rounded-full bg-clay px-5 py-4 text-base font-semibold text-oat"
        >
          {busy ? "Closing..." : "Confirm close"}
        </button>
        <button
          type="button"
          onClick={() => setClosing(false)}
          className="mt-3 text-sm text-forest/60"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-oat md:flex-row">
      {/* Catalogue */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-mist bg-oat/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="min-w-0">
              <p className="font-display text-lg text-forest sm:text-xl">
                Edis Mart till
              </p>
              <p className="truncate text-[11px] text-forest/55 sm:text-xs">
                Yeskoko · {userName}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/admin/orders"
                className="hidden rounded-full border border-mist px-3 py-2 text-xs font-semibold sm:inline"
              >
                Orders
              </Link>
              <Link
                href="/admin"
                className="hidden rounded-full border border-mist px-3 py-2 text-xs font-semibold lg:inline"
              >
                Ops
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCountedGhs(pesewasToGhsInput(expectedCash));
                  setClosing(true);
                  setError("");
                }}
                className="rounded-full border border-mist px-3 py-2 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSalePanel(true)}
                className="rounded-full bg-clay px-3 py-2 text-xs font-semibold text-oat md:hidden"
              >
                Sale · {cartCount}
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 pb-24 sm:px-3 sm:py-3 md:pb-3">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => {
              const sellable = sellableVariants(p);
              const stockSum = sellable.reduce((s, v) => s + v.stock, 0);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onProductTap(p)}
                    className="group w-full overflow-hidden border border-mist bg-white/60 text-left transition hover:border-forest/30"
                  >
                    <div className="relative aspect-square bg-mist">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 180px"
                      />
                      <span className="absolute bottom-2 left-2 bg-oat/95 px-1.5 py-0.5 text-[10px] tabular-nums text-forest/70">
                        {sellable.length === 0
                          ? "No price"
                          : `${stockSum} left`}
                      </span>
                    </div>
                    <div className="p-2 sm:p-2.5">
                      <p className="font-display text-sm leading-tight text-forest line-clamp-2 sm:text-[15px]">
                        {p.name}
                      </p>
                      <p className="mt-1 text-[10px] capitalize text-forest/55 sm:text-xs">
                        {p.channel}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Sale / checkout pane */}
      <aside
        className={`fixed inset-x-0 bottom-0 z-40 flex max-h-[min(92dvh,720px)] flex-col overflow-hidden border-t border-oat/10 bg-forest text-oat shadow-[0_-12px_40px_rgba(35,48,31,0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:static md:z-0 md:h-full md:max-h-none md:w-[min(100%,380px)] md:shrink-0 md:translate-y-0 md:border-l md:border-t-0 md:shadow-none ${
          salePanel ? "translate-y-0" : "translate-y-[110%] md:translate-y-0"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-oat/10 px-3 py-2.5 sm:px-4 sm:py-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-oat/50 sm:text-xs">
              This sale
            </p>
            <p className="mt-0.5 font-display text-2xl leading-none tabular-nums sm:text-3xl">
              {formatGhs(total)}
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-oat/60 md:hidden"
            onClick={() => setSalePanel(false)}
          >
            Close
          </button>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-1 sm:px-4">
          {cart.length === 0 ? (
            <li className="py-6 text-center text-sm text-oat/45">
              Tap a pack to add it. Pick a size when there is more than one.
            </li>
          ) : (
            cart.map((l) => (
              <li
                key={l.variantId}
                className="flex gap-2.5 border-b border-oat/10 py-2.5"
              >
                <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-oat/10 sm:h-14 sm:w-12">
                  <Image
                    src={l.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-tight">{l.productName}</p>
                  <p className="mt-0.5 text-[11px] text-oat/50">
                    {l.size} · {formatGhs(l.unitPrice)}
                    {l.quantity > l.stock ? ` · system ${l.stock}` : ""}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-oat/20"
                      onClick={() => setQty(l.variantId, l.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-5 text-center tabular-nums text-sm">
                      {l.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-oat/20"
                      onClick={() => setQty(l.variantId, l.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="shrink-0 text-sm tabular-nums">
                  {formatGhs(l.quantity * l.unitPrice)}
                </p>
              </li>
            ))
          )}
        </ul>

        <div className="shrink-0 space-y-2.5 overflow-y-auto overscroll-contain border-t border-oat/10 px-3 py-3 sm:space-y-3 sm:px-4 sm:py-4 max-h-[55%] md:max-h-none">
          {(cartOversell || oversellWarn) && (
            <p className="rounded-lg bg-mango/20 px-3 py-2 text-xs text-mango">
              {oversellWarn ||
                "Above on-hand — sale still goes through and is noted."}
            </p>
          )}

          <div ref={suggestRef} className="relative">
            <input
              placeholder="Customer name"
              value={customerName}
              autoComplete="off"
              onChange={(e) => {
                const v = e.target.value;
                setCustomerName(v);
                searchCustomers(v);
              }}
              onFocus={() => {
                if (suggestions.length) setShowSuggest(true);
              }}
              className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-2.5 text-sm text-oat placeholder:text-oat/40 sm:py-3"
            />
            {showSuggest && suggestions.length > 0 && (
              <ul className="absolute inset-x-0 bottom-full z-20 mb-1 max-h-40 overflow-y-auto rounded-xl border border-mist bg-oat py-1 text-forest shadow-lg">
                {suggestions.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-mist/60"
                      onClick={() => pickCustomer(c)}
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className="tabular-nums text-xs text-forest/55">
                        {formatGhPhoneDisplay(c.phone)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <input
              placeholder="Phone"
              inputMode="tel"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                if (phoneError) validatePhoneField(e.target.value);
              }}
              onBlur={() => validatePhoneField(customerPhone)}
              className={`w-full rounded-xl border bg-oat/10 px-3 py-2.5 text-sm text-oat placeholder:text-oat/40 sm:py-3 ${
                phoneError ? "border-mango" : "border-oat/15"
              }`}
            />
            {phoneError && (
              <p className="mt-1 text-xs text-mango">{phoneError}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSplitPay((v) => !v);
                setError("");
              }}
              className={`rounded-full px-3 py-2 text-[11px] font-semibold ${
                splitPay ? "bg-clay text-oat" : "bg-oat/10 text-oat/80"
              }`}
            >
              Split pay
            </button>
            {!splitPay &&
              (
                [
                  ["momo", "MoMo"],
                  ["cash", "Cash"],
                  ["bank", "Bank"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  className={`rounded-full px-3 py-2 text-[11px] font-semibold ${
                    method === value
                      ? "bg-clay text-oat"
                      : "bg-oat/10 text-oat/80"
                  }`}
                >
                  {label}
                </button>
              ))}
          </div>

          {splitPay ? (
            <div className="space-y-2">
              <p className="text-[11px] text-oat/55">
                Amounts must add to {formatGhs(total)}
                {splitRemaining !== 0 && (
                  <span className="text-mango">
                    {" "}
                    · left {formatGhs(splitRemaining)}
                  </span>
                )}
              </p>
              {(
                [
                  ["momo", "MoMo", momoGhs, setMomoGhs],
                  ["cash", "Cash", cashGhs, setCashGhs],
                  ["bank", "Bank", bankGhs, setBankGhs],
                ] as const
              ).map(([key, label, val, setVal]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <span className="w-12 shrink-0 text-oat/70">{label}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-oat/15 bg-oat/10 px-3 py-2 text-sm text-oat"
                  />
                </label>
              ))}
              {paymentAmounts.momo > 0 && (
                <input
                  placeholder="MoMo ref (optional)"
                  value={momoRef}
                  onChange={(e) => setMomoRef(e.target.value)}
                  className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-2 text-sm text-oat placeholder:text-oat/40"
                />
              )}
              {paymentAmounts.bank > 0 && (
                <input
                  placeholder="Bank ref (optional)"
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value)}
                  className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-2 text-sm text-oat placeholder:text-oat/40"
                />
              )}
              {paymentAmounts.cash > 0 && (
                <div className="space-y-1">
                  <input
                    placeholder="Cash tendered (₵)"
                    inputMode="decimal"
                    value={tenderedGhs}
                    onChange={(e) => setTenderedGhs(e.target.value)}
                    className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-2 text-sm text-oat placeholder:text-oat/40"
                  />
                  {tenderedGhs && (
                    <p className="text-xs text-oat/60">
                      Change {formatGhs(changeDue)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {(method === "momo" || method === "bank") && (
                <input
                  placeholder={
                    method === "bank"
                      ? "Bank ref (optional)"
                      : "MoMo ref (optional)"
                  }
                  value={method === "bank" ? bankRef : momoRef}
                  onChange={(e) =>
                    method === "bank"
                      ? setBankRef(e.target.value)
                      : setMomoRef(e.target.value)
                  }
                  className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-2.5 text-sm text-oat placeholder:text-oat/40 sm:py-3"
                />
              )}
              {method === "cash" && (
                <div className="space-y-1">
                  <input
                    placeholder="Tendered (₵)"
                    inputMode="decimal"
                    value={tenderedGhs}
                    onChange={(e) => setTenderedGhs(e.target.value)}
                    className="w-full rounded-xl border border-oat/15 bg-oat/10 px-3 py-2.5 text-sm text-oat placeholder:text-oat/40 sm:py-3"
                  />
                  {tenderedGhs && (
                    <p className="text-xs text-oat/60">
                      Change {formatGhs(changeDue)}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {error && <p className="text-xs text-mango">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => {
                setCart([]);
                setOversellWarn("");
              }}
              className="rounded-full border border-oat/20 px-3 py-3 text-xs font-semibold text-oat/80 disabled:opacity-40"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={busy || cart.length === 0}
              onClick={charge}
              className="flex-1 rounded-full bg-clay py-3 text-sm font-semibold text-oat disabled:opacity-50 sm:py-3.5 sm:text-base"
            >
              {busy ? "Charging..." : `Charge ${formatGhs(total)}`}
            </button>
          </div>

          {lastSaleId && (
            <div className="space-y-1 text-center">
              <p className="text-[11px] text-oat/55">Last sale charged</p>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs font-semibold sm:text-sm">
                <Link
                  href={`/pos/receipt/${lastSaleId}`}
                  target="_blank"
                  className="text-oat underline"
                >
                  Receipt
                </Link>
                <Link
                  href={`/pos/receipt/${lastSaleId}?print=1`}
                  target="_blank"
                  className="text-oat/80 underline"
                >
                  Print / PDF
                </Link>
                <Link
                  href={`/admin/orders/sale/${lastSaleId}`}
                  className="text-oat/70 underline"
                >
                  Manage
                </Link>
              </div>
            </div>
          )}
          <div className="hidden sm:block">
            <OpsCredit />
          </div>
        </div>
      </aside>

      {salePanel && (
        <button
          type="button"
          aria-label="Dismiss sale panel"
          className="fixed inset-0 z-30 bg-forest/30 md:hidden"
          onClick={() => setSalePanel(false)}
        />
      )}

      {picking && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-0 sm:items-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close"
            onClick={() => setPicking(null)}
          />
          <div className="relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto border border-mist bg-oat p-5 shadow-xl">
            <div className="flex gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-mist">
                <Image
                  src={picking.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-forest/45">
                  Pick size
                </p>
                <h2 className="mt-1 font-display text-2xl leading-tight text-forest">
                  {picking.name}
                </h2>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {picking.variants.map((v) => {
                const price = variantPrice(picking, v);
                if (price == null) {
                  return (
                    <li key={v.id}>
                      <div className="flex w-full items-center justify-between border border-dashed border-mist px-4 py-3 text-forest/40">
                        <span className="text-sm">{v.size}</span>
                        <span className="text-sm">No price</span>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => addLine(picking, v)}
                      className="flex w-full items-center justify-between border border-mist bg-white/50 px-4 py-3 text-left transition hover:border-clay hover:bg-white"
                    >
                      <span>
                        <span className="text-sm font-medium text-forest">
                          {v.size}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-forest/50">
                          {v.stock} on hand · {v.sku}
                        </span>
                      </span>
                      <span className="tabular-nums text-sm font-semibold text-forest">
                        {formatGhs(price)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="mt-4 w-full rounded-full border border-mist py-3 text-sm font-semibold text-forest"
              onClick={() => setPicking(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
