"use client";

import { useState } from "react";
import { ghsToPesewas, pesewasToGhsInput } from "@/lib/site";

export function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const shippingPesewas = Number(initial.shipping_accra || "2500") || 0;
  const [form, setForm] = useState({
    whatsapp: initial.whatsapp || "",
    shippingGhs: pesewasToGhsInput(shippingPesewas),
    pickup_address: initial.pickup_address || "",
    momo_note: initial.momo_note || "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        whatsapp: form.whatsapp,
        shipping_accra: String(ghsToPesewas(form.shippingGhs)),
        pickup_address: form.pickup_address,
        momo_note: form.momo_note,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={submit} className="max-w-lg space-y-4 border border-mist bg-white/40 p-5">
      <label className="block space-y-1 text-sm">
        <span className="text-forest/70">WhatsApp number</span>
        <input
          value={form.whatsapp}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
          className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-forest/70">Accra delivery fee (₵)</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={form.shippingGhs}
          onChange={(e) =>
            setForm((f) => ({ ...f, shippingGhs: e.target.value }))
          }
          className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-forest/70">Pickup address</span>
        <input
          value={form.pickup_address}
          onChange={(e) =>
            setForm((f) => ({ ...f, pickup_address: e.target.value }))
          }
          className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-forest/70">MoMo note for till</span>
        <input
          value={form.momo_note}
          onChange={(e) =>
            setForm((f) => ({ ...f, momo_note: e.target.value }))
          }
          className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
        />
      </label>
      {error && <p className="text-sm text-clay">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-5 py-3 text-sm font-semibold text-oat disabled:opacity-60"
      >
        {busy ? "Saving..." : saved ? "Saved" : "Save settings"}
      </button>
    </form>
  );
}
