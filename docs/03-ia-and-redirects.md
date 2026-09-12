# 03 — Information architecture and redirects

## Nav (desktop, one line)

Home · Shop · Wholesale · About · Contact · Cart

Primary CTA label (one intent): **Shop the flakes**

## Public routes

| Route | Purpose |
|-------|---------|
| `/` | Cinematic home |
| `/shop` | Collection |
| `/product/[slug]` | PDP |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/order/[id]` | Confirmation |
| `/wholesale` | B2B story + WhatsApp composer |
| `/about` | Story + founders |
| `/contact` | NAP + form + WhatsApp |
| `/faq` | Shipping, payment, wholesale |
| `/legal/privacy` | Privacy |
| `/legal/terms` | Terms |
| `/legal/refunds` | Refunds |
| `/admin` | Password-protected ops |

## Canonical products

| Slug | Notes |
|------|-------|
| `yeskoko-sweetened-coconut-flakes` | Hero SKU |
| `unsweetened-coconut-flakes` | Merge retail + wholesale twins |
| `mango-chips` | Retail sizes |
| `chia-chia-coco` | Wholesale-led; show on shop with wholesale CTA |
| `pineapple-chips` | Inquiry / request batch until priced |

## 301 map (WooCommerce → Next)

| From | To |
|------|----|
| `/about-us/` | `/about` |
| `/contact-us/` | `/contact` |
| `/product-category/retail/` | `/shop` |
| `/product-category/wholesale/` | `/wholesale` |
| `/product/yeskoko-sweetened-coconut-flakes-2/` | `/product/yeskoko-sweetened-coconut-flakes` |
| `/product/unsweetened-coconut-flakes-2/` | `/product/unsweetened-coconut-flakes` |
| `/shop/` | `/shop` |
| `/cart/` | `/cart` |
| `/checkout/` | `/checkout` |
| `/my-account/` | `/contact` (guest checkout; no accounts in v1) |
| `/product/{slug}/` | `/product/{slug}` (trailing slash optional) |

Implement via Next.js `middleware` or `next.config` redirects. Preserve query strings where safe.
