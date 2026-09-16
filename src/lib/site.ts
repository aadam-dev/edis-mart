export const site = {
  name: "Yeskoko",
  company: "Edis Mart",
  domain: "edismartgh.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://edis-mart.vercel.app",
  email: "edismart777@gmail.com",
  phones: ["+233549092316", "+233543358778"],
  whatsapp: process.env.WHATSAPP_NUMBER || "233549092316",
  hours: "8:30 - 17:30",
  hoursSchema: "Mo-Fr 08:30-17:30",
  city: "Accra",
  country: "GH",
  shippingAccraPesewas: Number(process.env.SHIPPING_ACCRA_FEE_PESEWAS || 2500),
};

export function formatGhs(pesewas: number | null | undefined) {
  if (pesewas == null) return "Quote";
  return `₵${(pesewas / 100).toFixed(2)}`;
}

/** Parse a GHS amount (cedis) into integer pesewas. */
export function ghsToPesewas(input: string | number): number {
  const n = typeof input === "number" ? input : Number(String(input).replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

/** Format pesewas for a GHS number input (no currency symbol). */
export function pesewasToGhsInput(pesewas: number): string {
  if (!Number.isFinite(pesewas)) return "0";
  const ghs = pesewas / 100;
  return Number.isInteger(ghs) ? String(ghs) : ghs.toFixed(2);
}

/** Till / checkout unit price for a variant given product channel. */
export function resolveTillPrice(
  channel: string,
  retailPrice: number | null | undefined,
  wholesalePrice: number | null | undefined,
): number | null {
  if (channel === "wholesale") {
    return wholesalePrice ?? retailPrice ?? null;
  }
  return retailPrice ?? wholesalePrice ?? null;
}

/**
 * Normalize Ghana phone to +233XXXXXXXXX.
 * Accepts 0XXXXXXXXX, 233XXXXXXXXX, +233XXXXXXXXX, or 9-digit local.
 */
export function normalizeGhPhone(input: string): string | null {
  const digits = String(input || "").replace(/\D/g, "");
  if (!digits) return null;
  let local = digits;
  if (local.startsWith("233") && local.length === 12) {
    local = local.slice(3);
  } else if (local.startsWith("0") && local.length === 10) {
    local = local.slice(1);
  }
  if (local.length !== 9) return null;
  if (!/^[235]\d{8}$/.test(local)) return null;
  return `+233${local}`;
}

export function isValidGhPhone(input: string): boolean {
  return normalizeGhPhone(input) != null;
}

export function formatGhPhoneDisplay(e164: string): string {
  const n = normalizeGhPhone(e164);
  if (!n) return e164;
  return `0${n.slice(4)}`;
}

export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
