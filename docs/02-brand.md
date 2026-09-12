# 02 — Brand and visual contract

## Positioning

**Yeskoko** is the snack brand customers buy. **Edis Mart** is the Ghana house that makes it. The storefront leads with Yeskoko; legal, about, and SEO entity use Edis Mart.

Tagline direction: *Coconut that still tastes like fruit.*

## Color tokens (Forest)

| Token | Hex | Use |
|-------|-----|-----|
| `--forest` | `#163A28` | Surfaces, nav, dark sections |
| `--leaf` | `#458914` | Primary accent (existing Flatsome green) |
| `--bone` | `#F4F1EA` | Page ground |
| `--mango` | `#E3A008` | Rare highlight from packaging (not a second CTA) |
| `--ink` | `#142019` | Body text |
| `--mist` | `#E8E4DC` | Borders / muted surfaces |

One accent lock: `--leaf` for all CTAs and interactive focus. No AI purple. No beige-brass craft palette.

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Logo | Yeskoko script (image/SVG) | Brand mark only |
| Display | Outfit | Headlines, prices |
| Body | Manrope | UI and paragraphs |
| Banned | Inter, Roboto, system-ui as display, Fraunces, Instrument Serif | |

## Shape system

- Editorial frames / product tiles: radius `0`
- CTAs and size pills: `rounded-full`
- Inputs: soft 8px

## Motion signatures (max 3 on a page)

1. Home type-sandwich hero + mask-rise headline
2. Shop editorial index with hover pack preview (desktop)
3. PDP pinned texture zoom (desktop) + sticky buy bar
4. Mid-home tagline word-fill on scroll
5. Magnetic Add to cart
6. Fixed 3% grain overlay (`pointer-events: none`)

Mobile: static hero, no pin/hijack, sticky buy, WhatsApp composer. Honor `prefers-reduced-motion`.

## Voice

Proud Ghana. Specific. Crunchy. Concrete.

**Ban:** elevate, seamless, unleash, revolutionize, “finest dried fruit worldwide”, em-dashes as flourish.

**Do:** name the fruit, the size, the city, the process (dried, no preservatives).
