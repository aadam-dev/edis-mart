"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CatalogueControls({
  productId,
  visible,
}: {
  productId: string;
  visible: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/catalogue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, visible: !visible }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Update failed");
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled={busy}
        onClick={toggle}
        className="rounded-full border border-mist px-3 py-1.5 text-xs font-semibold text-forest hover:border-clay disabled:opacity-60"
      >
        {busy ? "…" : visible ? "Hide from shop" : "Show on shop"}
      </button>
      {error && <p className="text-xs text-clay">{error}</p>}
    </div>
  );
}
