# 11 — Export rebrand contract

**Direction:** Ghana Tropical Modernism  
**Primary audience:** UK / EU / US importers and distributors  
**Secondary audience:** Ghana retail shoppers and domestic wholesalers  
**Mood:** sunlit · exacting · export-ready  
**Signature:** one full-screen “From Ghana to the Crisp” multi-fruit scroll film

## Brand architecture

- **Yeskoko** — consumer snack brand on the storefront
- **Edis Mart** — manufacturer / legal entity (footer, about, trade docs, schema)
- **Domain** — `edismartgh.com` (canonical; never fallback to preview host in production metadata)

**Export line:** Dried in Ghana. Distinct on shelf.  
**Promise:** Ghanaian fruit, clearly made and clearly documented.

## Audience hierarchy

1. Importers and distributors (UK / EU / US)
2. Specialty / natural / diaspora retail buyers abroad
3. Ghana distributors and retailers
4. Ghana consumers

**Primary CTA:** Request the buyer pack  
**Secondary CTA:** Discuss volumes and formats  
**Domestic path:** Shop in Ghana

## Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--cream` / `--oat` | `#F3EBDD` | Page ground (~65%) |
| `--cacao` / `--ink` | `#1D211C` | Body copy |
| `--palm` / `--forest` | `#173B2A` | Brand field, CTAs, dark sections (~25%) |
| `--mango` | `#E0A128` | Product highlight only |
| `--clay` | `#B55C3B` | Origin accent / focus |
| `--hibiscus` | `#8E3638` | Rare editorial accent |
| `--stone` / `--mist` | `#B8AA96` | Borders, muted UI |
| `--sage` / `--leaf` | `#6F8748` | Process / sourcing support |

Forest/palm is the interaction colour. Mango never becomes a competing CTA.

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Logo | Yeskoko script mark | Image/SVG only |
| Display | Cormorant Garamond | Short cinematic headlines, italic moments |
| Body / UI | Hanken Grotesk | Specs, nav, forms, buyer materials |

## Motion grammar

- **One heavy interaction per viewport** — the harvest-to-crisp film on home
- Desktop: scroll-scrubbed cinematic media + restrained type reveals
- Mobile: shorter crops, poster/video fallbacks, touch-safe product transitions
- Transform/opacity only; honor `prefers-reduced-motion`
- Supporting effects (never competing with the film): glass nav over media, split-text entrance, giant editorial type behind packs, product-index media shifts, oversized footer wordmark, single grain overlay

## Information architecture

| Route | Intent owner |
|-------|--------------|
| `/` | Brand / category — Ghanaian dried fruit snacks |
| `/shop` | Ghana retail catalogue |
| `/product/[slug]` | Exact retail product |
| `/wholesale` | Ghana domestic bulk |
| `/export` | International sourcing pillar |
| `/process` | Tree → fruit → dry → pack |
| `/sourcing` | Farmers, women-led impact |
| `/about` | Company story (verified facts only) |
| `/contact` | Retail vs trade pathways |
| `/faq` | Buyer and shopper questions |

## Claims guardrails

**Allowed when records support them**

- Ghanaian female-led food processor
- Founded 2015; dried foods since 2020
- Sourced from local farmers
- Dried and packed in Ghana
- Ghana FDA documentation (name the exact document/scope when publishing)
- Registrar of Companies registration
- Retail presence across Accra, Tamale, Cape Coast, Ho (city-level, not partner logos unless approved)

**Roadmap — label clearly as in progress / planned**

- GSA certification
- Additional export certifications
- Expanded industrial capacity
- Formal SOP / dedicated QC role

**Do not claim**

- HACCP, ISO, BRC, organic, fair-trade, GSA-certified, “export certified,” UK/EU/US approved
- “Healthy,” “nutritious,” nutrient-retention, or other regulated health claims without evidence
- Unverified founder/co-founder names beyond what owner confirms

**Owner review flags**

- Founder spelling: site historically used “Mavis Walker Blagodzi”; 2024 assessment uses “Mavis Blagoezi”
- Co-founder Robert Agyeman Newman appears in prior site copy but not in the 2024 assessment — do not invent; keep existing public attribution until owner confirms

## Content privacy

Retailers, sales agents, suppliers, margins (~40%), GHS 20k monthly baseline, equipment gaps, and internal weaknesses from the September 2024 assessment are **private ops data**. Import into back office with `sourceDate` + `verificationStatus`. Never list partner names publicly without approval.

## Product worlds

One signature multi-fruit film on home. Distinct worlds (not four duplicate scrubs) for:

1. Sweetened coconut flakes
2. Unsweetened coconut flakes (if catalogued)
3. Chia coco
4. Pineapple chips
5. Mango chips

## Finish gate

Screenshot/review loop until:

- Average ≥ 8/10
- No category < 7/10 across: hierarchy, brand distinctiveness, image realism, motion quality, responsive composition, accessibility, performance
- No crash on desktop or mobile
- No missing fruit/pack asset
- Reduced motion, live resize, and commerce paths verified
