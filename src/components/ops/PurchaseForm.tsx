"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ghsToPesewas } from "@/lib/site";

type VariantOption = { id: string; label: string };

export function PurchaseForm({ variants }: { variants: VariantOption[] }) {
  const router = useRouter();
  const [supplier, setSupplier] = useState("");
  const [freightGhs, setFreightGhs] = useState("0");
  const [variantId, setVariantId] = useState(variants[0]?.id || "");
  const [qty, setQty] = useState("10");
  const [unitCostGhs, setUnitCostGhs] = useState("10");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOk(false);
    const res = await fetch("/api/admin/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier,
        freightPesewas: ghsToPesewas(freightGhs),
        lines: [
          {
            variantId,
            qty: Number(qty),
            unitCostPesewas: ghsToPesewas(unitCostGhs),
          },
        ],
        receiveNow: true,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed");
      return;
    }
    setSupplier("");
    setOk(true);
    router.refresh();
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 border border-mist bg-white/40 p-5"
    >
      <h2 className="font-display text-2xl text-forest">New batch</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span className="text-forest/70">Batch note (fruit / run)</span>
          <input
            required
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="e.g. Coconut run 16 Sep"
            className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-forest/70">Other costs (₵)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={freightGhs}
            onChange={(e) => setFreightGhs(e.target.value)}
            className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
          />
        </label>
        <label className="block space-y-1 text-sm md:col-span-2">
          <span className="text-forest/70">Variant</span>
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-forest/70">Qty</span>
          <input
            type="number"
            required
            min={1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-forest/70">Unit cost (₵) — finished pack</span>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            inputMode="decimal"
            value={unitCostGhs}
            onChange={(e) => setUnitCostGhs(e.target.value)}
            className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
          />
        </label>
      </div>
      {error && <p className="text-sm text-clay">{error}</p>}
      {ok && !error && (
        <p className="text-sm text-forest/60">Batch recorded on the ledger</p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-5 py-3 text-sm font-semibold text-oat hover:bg-forest disabled:opacity-60"
      >
        {busy ? "Recording..." : "Record production batch"}
      </button>
    </form>
  );
}
