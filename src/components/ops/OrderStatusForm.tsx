"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  const save = async (next: string) => {
    setValue(next);
    setBusy(true);
    await fetch("/api/admin/order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: next }),
    });
    setBusy(false);
    router.refresh();
  };

  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => save(e.target.value)}
      className="rounded-lg border border-mist bg-oat px-2 py-1.5 text-xs"
    >
      {["pending", "pending_cod", "paid", "fulfilled", "cancelled"].map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
