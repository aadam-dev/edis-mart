/** Lightweight storefront analytics events — no PII. */

export type AnalyticsEvent =
  | "film_complete"
  | "trade_cta"
  | "inquiry_submit"
  | "product_view"
  | "add_to_cart"
  | "checkout_start"
  | "whatsapp_click"
  | "path_ghana"
  | "path_trade";

export function trackEvent(
  event: AnalyticsEvent,
  payload: Record<string, string | number | boolean | undefined> = {},
) {
  if (typeof window === "undefined") return;
  const detail = { event, ...payload, t: Date.now() };
  window.dispatchEvent(new CustomEvent("yeskoko:analytics", { detail }));
  // Optional dataLayer hook for GTM / future pixels
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: `yeskoko_${event}`, ...payload });
}
