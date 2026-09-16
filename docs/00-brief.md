# 00 — Project brief

## Design read

Redesign overhaul of a Ghanaian premium dried-fruit DTC store for health-conscious retail shoppers (with a wholesale side door), using MotionSites product-drop language, Next.js + Tailwind + Motion/GSAP, and a Forest palette locked to the existing Yeskoko green.

## Dials

| Dial | Value | Notes |
|------|-------|-------|
| `DESIGN_VARIANCE` | 8 | Asymmetric, editorial storefront |
| `MOTION_INTENSITY` | 7 (desktop) / ~4 (mobile) | Cinematic on marketing; commerce-safe on mobile |
| `VISUAL_DENSITY` | 3 | Art-gallery airy; product is the hero |

## Goals

1. Make Yeskoko feel premium enough that shoppers want to buy on first scroll.
2. Migrate off WordPress/WooCommerce without losing Paystack + COD or Ghana trust signals.
3. Ship great copy, SEO, and visuals for a small catalog (4–5 SKUs).
4. Keep wholesale as a path, not a confusing cheaper twin catalog.

## Brand split

- **Yeskoko** — consumer snack brand on the storefront.
- **Edis Mart** — company behind it (footer, about, legal, SEO entity).
- **Domain** — `edismartgh.com` stays.

## In scope (v1)

- Cinematic home, shop, PDP, cart, checkout
- Paystack (card + MoMo) + COD + WhatsApp composer
- Wholesale inquiry page
- About, contact, FAQ, legal
- Lean admin for products / stock / orders
- SEO migration + 301s
- Docs-first cutover plan

## Out of scope (Phase 2)

- Soaps, detergents, skin care, hair products (mentioned on LinkedIn)
- Full customer accounts / loyalty
- Multi-currency / international shipping
- Headless CMS
- Full till / POS (planned in `09-pos-and-back-office.md`)

## Success criteria

- Shopper can buy a size variant with Paystack test keys end to end.
- COD and WhatsApp paths both work.
- Old WooCommerce URLs 301 to new routes.
- Lighthouse: LCP < 2.5s on home and PDP (desktop cable).
- `prefers-reduced-motion` disables scroll hijacks.
