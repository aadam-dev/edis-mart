"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StockAdjustForm({ variantId }: { variantId: string }) {
  const router = useRouter();
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyDelta = Number(qty);
    if (!qtyDelta || !note.trim()) return;
    setBusy(true);
    await fetch("/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, qtyDelta, note }),
    });
    setQty("");
    setNote("");
    setBusy(false);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        placeholder="±qty"
        className="w-20 rounded-lg border border-mist bg-oat px-2 py-1.5 text-xs"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note"
        className="min-w-[8rem] flex-1 rounded-lg border border-mist bg-oat px-2 py-1.5 text-xs"
        required
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-oat"
      >
        Post
      </button>
    </form>
  );
}
