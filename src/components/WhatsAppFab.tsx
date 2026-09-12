"use client";

import { useEffect, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { whatsappLink, site, formatGhs } from "@/lib/site";
import { useCart } from "@/store/cart";

export function WhatsAppFab() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const lines =
    !mounted || items.length === 0
      ? "Hi Yeskoko, I want to order dried fruit snacks."
      : [
          "Hi Yeskoko, I want to order:",
          ...items.map(
            (i) =>
              `• ${i.productName} (${i.size}) x${i.quantity} - ${formatGhs(i.unitPrice * i.quantity)}`,
          ),
          `Subtotal: ${formatGhs(subtotal)}`,
          `Area: ${site.city}`,
        ].join("\n");

  return (
    <a
      href={whatsappLink(lines)}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] active:scale-[0.98]"
      aria-label="Order on WhatsApp"
    >
      <WhatsappLogo size={22} weight="fill" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
