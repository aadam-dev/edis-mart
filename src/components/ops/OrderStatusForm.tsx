"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  pending_cod: "COD pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export function orderStatusLabel(status: string) {
  return STATUS_LABELS[status] || status;
}

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
  const [error, setError] = useState("");

  const save = async (next: string) => {
    const prev = value;
    setValue(next);
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: next }),
    });
    setBusy(false);
    if (!res.ok) {
      setValue(prev);
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Update failed");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-1">
      <select
        value={value}
        disabled={busy}
        onChange={(e) => save(e.target.value)}
        className="rounded-lg border border-mist bg-oat px-2 py-1.5 text-xs"
      >
        {Object.entries(STATUS_LABELS).map(([s, label]) => (
          <option key={s} value={s}>
            {label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-clay">{error}</p>}
    </div>
  );
}
