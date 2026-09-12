# 01 — Live site audit (edismartgh.com)

Audited September 2026 against the production WordPress store.

## Stack

| Layer | Finding |
|-------|---------|
| CMS | WordPress 6.7.7 |
| Commerce | WooCommerce 10.3.8 |
| Theme | Flatsome 3.19.8 |
| Hosting | Hostinger (LiteSpeed, PHP 8.3) |
| Currency | GHS (₵) |
| Payments (cart API) | `cod`, `paystack` |
| Analytics | None detected |
| SEO plugins | None (no Yoast / Rank Math) |

## Brand identity problems

- Logo: **Yes Koko** script with coconut/fruit illustrations
- Hero banner: large **EDISMART** wordmark
- H1: “Edismart Cocoflakes – Naturally Crunchy, Deliciously Healthy!”
- About: “Edis Mart” company story
- Result: three competing names on one homepage

## Catalog issues

- Empty product descriptions and SKUs
- Incomplete size variations (mango 250g/700g listed but not priced; retail unsweetened 1kg listed but not priced)
- Duplicate products for retail vs wholesale instead of one SKU + price book
- Pineapple chips appear on packaging and About copy but are not sellable
- Coconut product images reuse banner crop
- Zero reviews

## UX / trust gaps

- Social links are placeholders (`http://url`)
- Mailto placeholder `your@email` in places
- No meta description, Open Graph, or JSON-LD
- Checkout decorative payment icons only; gateway details not surfaced in empty-cart HTML
- No WhatsApp CTA despite Ghana market norms

## Assets worth keeping

| Asset | URL |
|-------|-----|
| Logo | `/wp-content/uploads/2025/02/logo-1024x328.jpg` |
| Yeskoko pack | `/wp-content/uploads/2025/02/Yeskoko.jpg` |
| Mango | `/wp-content/uploads/2025/02/Mango.jpg` |
| Chia | `/wp-content/uploads/2025/02/Chia.jpg` |
| Banner / coconut | `/wp-content/uploads/2025/02/BANNER-1-scaled.jpg` |
| Payment strip | `/wp-content/uploads/2025/02/iconsNew.png` |

## Ops contacts (keep)

- Phones: `+233 54 909 2316`, `+233 54 335 8778`
- Email: `edismart777@gmail.com`
- Hours: 8:30–17:30
- Default shipping region in WC cart: GH / Greater Accra (`AA`)

## Founders

- Mavis Walker Blagodzi — founder (accounting background)
- Robert Agyeman Newman — co-founder (biochemistry)

## Verdict

The physical brand and packaging are stronger than the site. Rebuild as a premium Yeskoko storefront; migrate Paystack + COD; retire Flatsome.
