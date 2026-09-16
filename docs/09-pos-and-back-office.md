# 09 — POS and back office (Edis Mart)

**Status:** plan only. Not built yet. Argue with this before it becomes code.

This is the in-person and ops layer for **Edis Mart** (the company) selling **Yeskoko** (the snack brand) and other dried fruit lines: coconut flakes, mango chips, chia coco, pineapple, and later wholesale packs.

It should feel like the storefront: Forest surfaces, leaf CTAs, bone paper, Outfit display, Manrope body, sharp product tiles, pill buttons. No blush fashion chrome. No generic grey SaaS.

---

## Why a till for dried fruit

The web shop already takes Paystack (card + MoMo), COD, and WhatsApp. The till is for:

- Market days, pop-ups, office drop-offs, and walk-ins at the pack house
- Selling by **size / weight SKU** (50g, 100g, 250g, 700g, 1kg) without opening the website
- Capturing MoMo references the same way the shop already trusts Paystack MoMo
- Keeping **one stock ledger** for web + till so a 700g sweetened coconut sold at a stall disappears from the site

Wholesale stays an inquiry / quote path on the site. The till can still take a large pack sale when someone is standing there with cash or MoMo — that is retail fulfilment of a big bag, not a separate wholesale catalog.

---

## Brand split on systems screens

| Surface | Brand voice |
|---|---|
| Customer receipt header | **Yeskoko** wordmark + “by Edis Mart” |
| Till chrome / admin | **Edis Mart** ops, quiet Yeskoko mark |
| Build credit | Systems line (not “powered by”): see below |

Receipts are snack-brand facing. The till itself is company facing.

---

## Design contract (match `02-brand.md`)

- Ground: `--bone` / `--mist`
- Ink: `--ink` / `--forest`
- CTA: `--leaf` only
- Rare accent: `--mango` for “paid” / success chips only
- Tiles: radius `0`; charge / size pills: `rounded-full`
- Typography: Outfit for totals and receipt numbers, Manrope for UI
- Full-screen till at `/pos` — not nested inside `/admin`
- Big touch targets, one-hand Accra phone use, works on patchy data
- Quiet systems credit footer (not storefront “Powered by”):

  `POS & business systems · aadam`  
  `aadambuilds.dev · +233 26 303 9818`

  PDF / print:  
  `POS & business systems by aadam · aadambuilds.dev · +233263039818`

Storefront footer stays: `Powered by aadam`.

---

## Roles

| Role | Who | Can do |
|---|---|---|
| Owner | Edis Mart owner | Till, purchases, cost, P&L, people |
| Shop manager | Day-to-day ops | Catalogue, stock counts, online orders, settings. No P&L |
| Till only | Market / stall staff | Open till, sell, print receipt. No cost prices |

Start **owner-only on the till** until it has been used enough to trust, same as Zaina’s Couture.

---

## Back office shape (`/admin`)

Reorganise around dried-fruit ops, not fashion language.

| Area | Purpose |
|---|---|
| **Today** | Unfulfilled Paystack/COD/WhatsApp orders, low stock by SKU, open till session |
| **Sell** | Link out to `/pos` |
| **Orders** | Online orders (Paystack, COD, WhatsApp). Status, MoMo/Paystack ref, delivery vs pickup |
| **Catalogue** | Products, size variants, retail + wholesale (wholesale hidden from public), pack photos, hide/show |
| **Stock** | Count by size variant. Ledger, not editable numbers |
| **Purchases** | Raw coconut / fruit / packaging buys, freight into Accra, landed cost |
| **Reports** | Owner only: revenue, margin by SKU, market-day vs web channel |
| **Settings** | Phones, MoMo, Paystack keys status, Accra delivery fee, WhatsApp number, pickup address |
| **People** | Owner creates accounts |

Money is always **integer pesewas**. Never floats.

---

## Till shape (`/pos`)

### Session
1. Open with cash float
2. Sell
3. Close with counted cash vs expected (float + cash sales)

### Sale flow
1. Search / tap product (large pack photo tiles on Forest/bone)
2. Pick **size** pill (50g · 100g · 250g · 700g · 1kg)
3. Qty — including multi-bag wholesale-style walk-ins
4. Optional customer name / phone (for MoMo match and repeat buyers)
5. Pay: **MoMo** (ref required) · **Cash** · **Paystack tap/link** (phase 2) · **Other**
6. Charge — idempotent (retry must not double-sell)
7. Branded PDF + printable receipt
8. Stock movement `sold` on that size variant; cost stamped at sale time

### Stock policy (best practice for this business)
- Allow **negative stock** while counts are incomplete or during early testing
- Soft amber warning when selling above on-hand; note oversell on the sale
- Never block a market-day customer because the system says zero
- Opening stock count still matters; every later number sits on it

### What the till must not do in v1
- Weigh live on a scale (all sellable units are pre-packed sizes)
- Full wholesale price list / tier contracts (use inquiry on site; optional “apply wholesale price” toggle can wait)
- Offline queue with multi-device sync (hardest piece — phase 2)

---

## Receipt (Yeskoko-facing)

Thermal-friendly PDF (~80mm) and a printable HTML page.

Carry:

- Yeskoko mark, “by Edis Mart”, Accra / phone
- Gapless receipt number e.g. `YK-2026-00042`
- Date, till session, who served
- MoMo / Paystack reference when relevant
- Lines: product, size, qty, amount
- Total, tendered / change for cash
- Quiet “All sales …” policy line matching shop policy
- Systems credit line with aadam + phone

No VAT line unless / until GRA registration changes — confirm before first VAT sale.

---

## Shared stock with the website

One Postgres (or current Prisma DB) ledger:

- Variants = product × size (already how the catalog is seeded)
- Movements: opening, received, sold, adjusted, damaged
- Web Paystack paid orders and till sales both write `sold`
- Receiving a purchase order blends weighted average cost for margin truth

Sell the last 250g mango chips at a pop-up → shop PDP stops offering that size within seconds.

---

## Reports the owner actually needs

Dried fruit margins are thin and freight-sensitive. Prioritise:

1. Revenue today / 7d / 30d, split **web vs till**
2. Gross profit using **stamped cost** (not today’s restock price)
3. Best / worst SKUs by units and by margin (700g coconut often wins volume; chips may win margin)
4. Stock value at cost
5. What to reorder before the next market weekend

Owner only.

---

## Phased build

### Phase A — foundations (can land with current lean admin)
- Variant stock ledger + opening count screen
- Purchase receive with landed cost
- Roles: owner / manager / till

### Phase B — till v1
- `/pos` full screen, Forest brand
- Sessions, MoMo+cash checkout, idempotent sales
- PDF + print receipts with systems credit
- Oversell allowed with audit note
- Owner reports: revenue / profit / best sellers

### Phase C — tighten
- Paystack payment link / QR from the till for card buyers
- COD / WhatsApp online orders visible on **Today** with one-tap “packed”
- Low-stock alerts before Friday markets
- Open till to shop manager / stall staff

### Phase D — later
- Proper offline till
- Multi-location stock if they pack and sell from more than one base
- Loyalty / repeat buyer phone lookup

---

## Open questions for Edis Mart

1. Do walk-ins ever buy **loose weight**, or only sealed packs?
2. Is there one Accra pack base, or market stock leaving the warehouse that needs a second location?
3. Should till receipts show **Yeskoko** only, or always “Yeskoko by Edis Mart”?
4. Are all sales final on snacks (spoilage / opened packs), or is there a fault-only swap?
5. Who runs the stall phone on market day — same MoMo as Paystack, or a separate till MoMo?

---

## Success criteria when we build it

- Owner can open `/pos` on a phone, sell a 100g mango chips for MoMo with ref, download a Yeskoko PDF receipt, and see stock drop on the website
- A sale above system stock still completes and is visible as an oversell note
- Reports show till vs web without mixing stamped costs
- UI matches Forest brand: bone paper, leaf charge button, Outfit totals, no fashion-site leftovers
- Systems credit points to aadambuilds.dev with +233 26 303 9818; storefront stays “Powered by aadam”
