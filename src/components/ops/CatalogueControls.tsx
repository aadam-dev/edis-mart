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

  const toggle = async () => {
    setBusy(true);
    await fetch("/api/admin/catalogue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, visible: !visible }),
    });
    setBusy(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className="rounded-full border border-mist px-3 py-1.5 text-xs font-semibold text-forest hover:border-clay"
    >
      {visible ? "Hide from shop" : "Show on shop"}
    </button>
  );
}
