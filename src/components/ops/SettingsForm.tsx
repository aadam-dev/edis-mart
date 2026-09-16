"use client";

import { useState } from "react";

export function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={submit} className="max-w-lg space-y-4 border border-mist bg-white/40 p-5">
      {(
        [
          ["whatsapp", "WhatsApp number"],
          ["shipping_accra", "Accra delivery fee (pesewas)"],
          ["pickup_address", "Pickup address"],
          ["momo_note", "MoMo note for till"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block space-y-1 text-sm">
          <span className="text-forest/70">{label}</span>
          <input
            value={form[key] || ""}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full rounded-xl border border-mist bg-oat px-3 py-2.5"
          />
        </label>
      ))}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-clay px-5 py-3 text-sm font-semibold text-oat"
      >
        {busy ? "Saving..." : saved ? "Saved" : "Save settings"}
      </button>
    </form>
  );
}
