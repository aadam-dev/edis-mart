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

One signature multi-fruit film on home (`docs/10-scroll-film.md`, media still ritual until day film ships).  
Below the film: the section stack in [`docs/13-motion-redesign.md`](13-motion-redesign.md) — fruit fields (not four competing scroll films), pack-your-mix, proof, process, buyer route, people, In Ghana.

1. Coconut flakes (sweetened + unsweetened sizes called out in copy)
2. Chia coco
3. Mango chips
4. Pineapple chips

## Homepage locked note

**Unlocked by docs/13 (2026-11-02).** The Landing Page Lock-In freeze is lifted for the homepage **section stack** and CTA hierarchy described in docs/13. Current ritual film frames stay until `public/film/day/` + `SunFilm` exist — do not invent a third hero outside that brief. Interim pack photos remain owner-review flags (garbled regulatory text; replace before launch).

## Finish gate

Screenshot/review loop until:

- Average ≥ 8/10
- No category < 7/10 across: hierarchy, brand distinctiveness, image realism, motion quality, responsive composition, accessibility, performance
- No crash on desktop or mobile
- No missing fruit/pack asset
- Reduced motion, live resize, and commerce paths verified
