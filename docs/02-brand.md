# 02 — Brand and visual contract

Canonical direction lives in [`11-export-rebrand.md`](./11-export-rebrand.md). This file is the short operational summary for implementers.

## Positioning

**Yeskoko** is the snack brand. **Edis Mart** is the Ghana house that makes it. Storefront leads with Yeskoko; legal, about, trade, and SEO entity use Edis Mart.

**Tagline:** Dried in Ghana. Distinct on shelf.  
**Domestic line:** Coconut that still tastes like fruit.

## Color tokens (Ghana Tropical Modernism)

| Token | Hex | Use |
|-------|-----|-----|
| `--oat` / cream | `#F3EBDD` | Page ground |
| `--forest` / palm | `#173B2A` | Surfaces, CTAs, dark sections |
| `--ink` / cacao | `#1D211C` | Body text |
| `--clay` | `#B55C3B` | Origin accent / focus |
| `--mango` | `#E0A128` | Product highlight only |
| `--hibiscus` | `#8E3638` | Rare editorial accent |
| `--mist` / stone | `#E8E0D4` | Borders / muted surfaces |
| `--sage` | `#6F8748` | Process / sourcing support |

One accent lock: `--forest` for CTAs and interactive focus. Mango is never a second CTA. No AI purple. No generic beige-brass craft palette.

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Logo | Yeskoko script (image) | Brand mark only |
| Display | Cormorant Garamond | Short cinematic headlines |
| Body | Hanken Grotesk | UI, specs, forms |
| Banned | Inter, Roboto as display; decorative emoji icons |

## Shape system

- Editorial frames: soft 2–4px or hard editorial edges as needed
- CTAs: `rounded-full`
- Inputs: soft 8px
- Prefer atmospheric fields over equal card grids

## Motion signatures (max one heavy effect per viewport)

1. Home “From Ghana to the Crisp” multi-fruit scroll film
2. Product-index media shift on hover/touch
3. Mid-page tagline / story reveals
4. Fixed ~4% grain overlay (`pointer-events: none`)

Mobile: shorter film crop, no scroll hijack beyond scrub, sticky buy on PDP, WhatsApp composer. Honor `prefers-reduced-motion`.

## Voice

Assured, sensory, specific, commercially literate.

**Ban:** elevate, seamless, unleash, revolutionize, “finest dried fruit worldwide”, unsupported “healthy/nutritious,” export-certified claims without documents.

**Do:** name the fruit, the size, the city, the process (dried, packed in Ghana), and the buyer action (request pack / shop Ghana).
