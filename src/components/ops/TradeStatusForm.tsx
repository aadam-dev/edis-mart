"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["new", "reviewing", "replied", "closed"] as const;

export function TradeStatusForm({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function save(next: string) {
    setBusy(true);
    setValue(next);
    await fetch("/api/admin/trade-inquiry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <select
      disabled={busy}
      value={value}
      onChange={(e) => save(e.target.value)}
      className="rounded-lg border border-mist bg-white px-2 py-1.5 text-xs text-forest"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
