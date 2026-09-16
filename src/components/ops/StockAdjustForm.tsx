"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StockAdjustForm({ variantId }: { variantId: string }) {
  const router = useRouter();
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk(false);
    const qtyDelta = Number(qty);
    if (!qtyDelta || !Number.isFinite(qtyDelta)) {
      setError("Enter a non-zero ± qty");
      return;
    }
    if (!note.trim()) {
      setError("Note is required");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, qtyDelta, note }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Adjust failed");
      return;
    }
    setQty("");
    setNote("");
    setOk(true);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        placeholder="+5 / −2"
        className="w-20 rounded-lg border border-mist bg-oat px-2 py-1.5 text-xs"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (required)"
        className="min-w-[8rem] flex-1 rounded-lg border border-mist bg-oat px-2 py-1.5 text-xs"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-oat disabled:opacity-60"
      >
        {busy ? "…" : "Post"}
      </button>
      {error && <p className="w-full text-xs text-clay">{error}</p>}
      {ok && !error && <p className="w-full text-xs text-forest/60">Posted</p>}
    </form>
  );
}
