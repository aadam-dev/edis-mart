# 13 — Motion redesign: "One Ghana day on the drying table"

Status: **approved for section-stack pass** · 2026-11-02  
Scope: homepage (`src/app/page.tsx`) and the components it uses. Other routes keep their layout; they only pick up the new tokens and the cleanup.  
**This pass:** below-film stack + tokens + cleanup, with interim pack JPGs. **Deferred:** day-film stills, `SunFilm`, `/dev/film-align`, piece cut-outs (Phases 1–2 media).  
Sales walkthrough of the pre-redesign cut: [`14-sales-walkthrough.md`](14-sales-walkthrough.md).

Reference build: Bobalicious v2 (`website-leads/boba-tea/bobalicious`). We borrow its **techniques** (aligned still film, stacked colour fields, hold-then-crossfade, one-idea-per-viewport). We do **not** borrow its look (see §2).

> **This plan unlocks docs 10 and 11.** Approving this doc is that change. Docs 10/11 now point here for the section stack; ritual media stays until `public/film/day/` ships.

---

## 1. Diagnosis

### 1.1 The film reads as a ghosted slideshow
- **Opacity blend, not motion.** `scrubFromProgress()` in [`ScrollRitual.tsx:34-71`](../src/components/motion/ScrollRitual.tsx) blends frame A and frame B by opacity across the whole chapter. With 6 stills that don't share a camera, every in-between scroll position is a double exposure. Nothing ever holds still long enough to read.
- **Small boxed image on flat beige.** The media sits in a 7/12 column capped at `md:h-[min(72dvh,640px)]` (`ScrollRitual.tsx:254`) on a flat `#e7d3bf` stage (`:147`, `:255`). Packs are capped tighter still at `max-w-[420px] md:max-w-[480px]` (`:259`). On a 1440×900 laptop the "film" is about 640px tall in a beige box, with half the screen being copy. It's not full-bleed or cinematic.
- **Five different sets.** Frames in `public/film/ritual/` don't share a lens, angle, light or set:
  - `01-tree`: low-angle palm against a sepia sky (864×1152)
  - `02-fruit`: overhead coconut half on beige paper (864×1152)
  - `03-process`: dark workshop drying racks, **1280×720 landscape** while every other chapter is 3:4 portrait, so it's cropped differently from the rest
  - `04-packs`: a pouch on a rock in a jungle, then a pouch on a wooden table
  - `05-crisp`: flakes on a peach seamless
  The eye has to re-orient on every chapter. There is no continuity device.
- **Low resolution.** Frames are 864px wide and get stretched across `54vw`. On a 2× laptop that's roughly 1550 device px drawn from 864, which is soft.
- **Duplicates.** `04-packs` has only 4 unique images across 6 frames (`frame_00` = `frame_04` = poster; `frame_03` = `frame_05`).
- **Swapping `src` mid-scroll.** `srcA`, `srcB` and `srcNext` change on every scroll tick (`:137-141`). `next/image` then requests and decodes a new file while you scroll, so frames flash on first pass. Preloading only starts at 55% through a chapter (`:107-119`).
- **React re-renders on every scroll tick.** `useScrollProgress` calls `setProgress` per frame (`src/hooks/useScrollProgress.ts`), which re-renders the whole film tree. On the throttled 2019 Intel MacBook this is visible jank. Boba writes styles directly from the ScrollTrigger callback instead.

### 1.2 The same CTA pair four times
"Request buyer pack" + "Shop Ghana" appears in the film (`ScrollRitual.tsx:202-215`), the promise strip (`page.tsx:103-108`) and the closing section (`page.tsx:242-247`). Each fruit row adds "View product" + "Export interest" (`ProductWorlds.tsx:65-77`). That's 14 buttons on one page, mostly duplicates. Repetition reads as pleading, and buyers learn to ignore them.

### 1.3 ProductWorlds is four identical zig-zag rows
`ProductWorlds.tsx:23-83` maps `fruitStories` into the same 5/6-column grid, alternating sides. Each row is a pack JPG with `object-contain p-6` in a beige box, plus four text blocks and two buttons. Coconut, chia, mango and pineapple all look the same, so the four fruits never feel like four different snacks.

### 1.4 One motion for everything
Every section wraps content in the same `<Reveal>` (fade + 28px rise, 1s; `src/components/motion/Reveal.tsx`). Applied to ~20 blocks on the homepage, it becomes wallpaper. Nothing on the page is choreographed for its own content.

### 1.5 Apologetic copy
- `page.tsx:125`: "Documented where we can. Honest about the roadmap." The headline leads with what's missing.
- The film note "Coconut, mango, pineapple — selected for drying" and the fruit bodies are long and list-like (`content.ts fruitStories`): 40–50 words each, with three supporting lines.
- "Four fruits. Four stories. One Accra house." is generic.

The roadmap has to stay labelled (docs/11 guardrails), but it should come last in a confident proof section, not be the headline.

### 1.6 The mobile sticky stage probably overflows
The stage is `sticky top-0 h-dvh overflow-hidden` (`ScrollRitual.tsx:163`). At 375×667 it stacks:
- the top bar: `pt-[4.75rem]` plus a nav of 4 pills, which may wrap
- the media at `min-h-[42dvh]` (~280px)
- an italic title at `clamp(2.4rem…)`, usually 2 lines (~80px)
- the note, pack label and two CTAs
- the progress bar, chapter buttons and counter

That adds up to roughly 720–760px in a 667px box. Because of `overflow-hidden`, the CTAs and progress get **clipped**, not scrolled. To verify in Phase 6, check 375×667 and 390×844.

### 1.7 Image honesty risks (critical for export buyers)
- **The pack images show garbled regulatory text.** `public/products/yeskoko.jpg` reads "Netth 250g" and "FDAIFI 21170". The pineapple pack in `04-packs/frame_03.webp` reads "FBAIV: 31-012". An importer will spot a malformed FDA number at once. These look AI-made or mocked up. **We need real pack photos from the owner** (§6.3).
- `public/products/pineapple.jpg` is only **410×691**. It's upscaled everywhere it's used.
- `public/film/ghana/06-makers/poster.jpg` (homepage sourcing section, `page.tsx:198`, and `/sourcing`) is an AI image of women at trays, with the alt text "Hands packing dried coconut flakes in Accra". On a page that says "Female-led", a generated team photo is misrepresentation. Replace it with a real photo, or use a hands-only product image that doesn't imply it shows the team.

### 1.8 Dead code
These components have no importers:

| File | Status |
|---|---|
| `src/components/motion/HomeHero.tsx` | unused |
| `src/components/motion/Marquee.tsx` | unused |
| `src/components/motion/PantryPack.tsx` | unused |
| `src/components/motion/StoryReveal.tsx` | unused (only imports Reveal) |
| `src/components/motion/TaglineReveal.tsx` | unused (only imports Reveal) |
| `src/lib/content.ts` → `productWorlds` | `@deprecated`, unused on home |
| `src/lib/film.ts` → `ghanaFilm`, `coconutFilm` | `@deprecated` aliases |
| `public/film/coconut/*` | no references in `src/` |
| `public/film/ghana/02-fruit`, `05-crisp` frames | no references; posters of `01-canopy`, `03-process`, `04-family`, `06-makers` **are** used by `/about`, `/sourcing`, `/process` and OG images. Keep those until replaced. |

`ParallaxMedia` (used by `ProductCard`), `SmoothScroll` and `Grain` stay.

---

## 2. Direction and divergence brief

### 2.1 The idea
**One Ghana day on one drying table.** The camera is locked on a pale limestone table on an Accra veranda, with palms behind. Across the scroll the fruit turns into chips, and **the sun moves**: cool morning shadows at the top, hard noon in the middle, long amber light at the end. The continuity device is the light, not the object. Bobalicious is a dark cinema where one cup gets built. Yeskoko is a bright day where fruit becomes a snack.

### 2.2 Divergence brief

```
DIVERGENCE BRIEF — Yeskoko (Edis Mart), Ghanaian dried-fruit snacks, export-first, 2026-11-02

Client said (adjectives):      sunlit · exacting · export-ready (docs/11)
Style pack (05):               P13 Field Notes ("naturalist editorial"), carried on the
                               locked Ghana Tropical Modernism palette. Chosen because the
                               brand is food, farms and daylight, and docs/11 already asks
                               for "sunlit".
  differs from last build by:  palette (daylight oat ground vs near-black), type (sentence-
                               case Cormorant italic vs uppercase Bodoni), composition
                               (centred-symmetric vs split columns), accent (forest vs coral),
                               motion personality (sun-paced vs slow-heavy/snappy)
Type pairing:                  display Cormorant Garamond (sentence case, italic for the
                               moment word) · body Hanken Grotesk · utility Hanken small caps
                               (`label-caps`) with tabular numerals. No mono: Bobalicious
                               uses DM Mono; we don't.
Structural system:             one pinned full-bleed daylight film, then centred full-screen
                               fruit fields, then an editorial ledger + route close.
                               Honest note: both sites are "one idea per viewport". We
                               differ hard on composition (centred pack under giant name vs
                               split copy/photo) and on every transition.
Hero thesis (the opening):     a sunlit, almost empty limestone table under palm shadow; as
                               you scroll, the sun crosses it and fruit becomes Yeskoko.
Signature moves (pick 3):      R24 vertical sun-path chapter rail over a full-bleed aligned
                               still film (the film technique is the one repeat; edis-mart
                               had it first) ·
                               R6 parallax fruit pieces around a centred pack inside
                               stacked fields that rise on an arched edge ·
                               R26 FLIP "Pack your mix" tray (pieces fly into a drying tray)
  default it would have been:  Bobalicious again: dark stage, uppercase lines, slide-over +
                               sink-and-dim panels, outline scroll-fill promise, giant footer
                               wordmark, coral buttons. All five are avoided.
Motion personality:            cinematic-still, sun-paced: long holds, 1.1–1.4s settles,
                               light drifts rather than objects flying. Interactions are
                               instant-precise (150–220ms).
Accent discipline:             forest #173B2A is the only CTA and focus colour. Clay #B55C3B
                               is used only for chapter numbers and the sun marker (<5% of
                               surface). Mango #E0A128 appears only as the mango field.
One real risk taken:           the first frame barely shows product: light, shadow, a green
                               coconut. The pouch doesn't appear until chapter 04. Mitigation:
                               the visible H1 and the header's "For buyers" link are there
                               from the first frame.

DIFFERS FROM Bobalicious BY:   it's a bright daylight site where the light moves and each
                               pack sits centred under its own giant italic name, not a dark
                               cinema with uppercase type and a coral straw.
```

Axes changed: palette ✓ · type ✓ · hero thesis ✓ · motion personality ✓ · signature moves (1 repeat + 1 partial) · structure (partial). That's 4 of 6 fully changed, so it passes the guardrail.

### 2.3 Tokens (additions to `src/app/globals.css`)
The palette is unchanged (docs/11). These are new **derived** tokens only:

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--field-coconut` | `#173B2A` (forest) | Coconut field, oat text | oat 10.46:1 |
| `--field-chia` | `#9A4A2E` (toasted clay, clay darkened) | Chia coco field, oat text | oat 5.23:1 (raw clay `#B55C3B` only gets 3.89:1, which fails body text) |
| `--field-mango` | `#E0A128` (mango) | Mango field, forest text | forest 5.48:1 |
| `--field-pineapple` | `#4E6332` (crown green, sage darkened) | Pineapple field, oat text | oat 5.62:1 (raw sage `#6F8748` only gets 3.39:1) |
| `--table` | `#E9DFCF` | Limestone colour in prompts and the film scrim | forest 9.39:1 |
| `--sun-am` / `--sun-noon` / `--sun-pm` | `#EFE6D6` / `#F3EBDD` / `#EBCF9F` | Film scrim tint per chapter (interpolated) | — |

Remove the hard-coded `#e7d3bf` / `#f3e6d4` in `ScrollRitual.tsx` and `ProductWorlds.tsx`.

---

## 3. New homepage section stack

**Rule: one idea per viewport and one CTA per viewport.** The header carries the two global paths permanently: a **"Shop"** nav link and a forest **"For buyers"** pill. So sections never need to repeat the pair. Each section gets the one action that belongs to it, or none. WhatsAppFab stays as it is (it's utility, not a section CTA).

| # | Section | Height | Ground | Idea | Motion | The one CTA |
|---|---|---|---|---|---|---|
| 0 | Header | — | glass over film | Global paths | — | "For buyers" pill (forest) |
| 1 | **Film** | ~480vh pinned (desktop) / 420svh (phone) | full-bleed photo | Fruit becomes Yeskoko over one sunny day | §4 | Final chapter only: **Request the buyer pack** |
| 2 | **The line** | 100svh | oat | The brand promise, said once, big | R9 mask-reveal lines + one R12 sun-arc draw under "Ghana" | none |
| 3–6 | **Fruit fields ×4** | 100svh each, sticky stack | field colours | Each snack is its own world | §5.1 | **See [fruit]** → product page |
| 7 | **Pack your mix** | ~100svh | oat | Choose the fruit, get a sample set or a basket | §5.2 | Adapts: **Request these samples** / **Add to cart** |
| 8 | **How it's made** | 100svh | forest | Six steps, one line | R28 path draws through 6 nodes | text link "See the process" |
| 9 | **What we can show you** | ~100svh | oat | Proof ledger | rows settle in sequence, no Reveal | none |
| 10 | **From our trays to your shelf** | 100svh | `--table` limestone | How an importer buys | 4 nodes, rule draws left → right | **Request the buyer pack** |
| 11 | **The people** | 100svh | full-bleed photo | Female-led, farmer-sourced | slow Ken Burns settle (R1-lite) | text link "Read the sourcing story" |
| 12 | **In Ghana?** | ~70svh | mango field | Domestic path | none | **Shop Yeskoko** |
| 13 | Footer | — | forest | Existing footer, no giant wordmark (Bobalicious owns that move) | — | — |

### 3.1 Copy drafts
Voice: assured, sensory, specific (docs/02). Sentence case. Cormorant italic display for the moment word only. Lines marked ⚑ need the owner to confirm the fact.

**1 · Film** (headline · note)
- **Frame 1, the visible `<h1>`:** "Dried in Ghana. *Distinct on shelf.*" · "Yeskoko coconut flakes and fruit chips, made by Edis Mart in Accra." Scroll cue in small caps: "Scroll · one day on the drying table"
- **01 Tree:** "It starts *under the palms.*" · "Coconut, mango and pineapple, bought from local farmers in Ghana."
- **02 Fruit:** "Opened while it's *still sweet.*" · "Cracked, peeled and sliced thin so every piece dries the same."
- **03 Trays:** "Steamed, then *dried slow.*" · "Washed, steamed and dehydrated in Accra. No preservatives."
- **04 Packs:** "Four snacks, *labelled to be read.*" · "Nitrogen-flushed and sealed in Accra." Plus a per-frame small-caps pack name: Sweetened coconut flakes · Chia coco · Mango chips · Pineapple chips
- **05 Snap:** "Then it *snaps.*" · "Toasted edges, bright centres. Fruit you can hear." Then the CTA: **Request the buyer pack**

**2 · The line**
- Eyebrow: "Yeskoko by Edis Mart"
- Display (3 lines): "Ghanaian fruit," / "clearly made," / "*clearly documented.*"
- Fact row (small caps, tabular): "Founded 2015 · Dried foods since 2020 · Female-led · Packed in Accra"

**3–6 · Fruit fields** (eyebrow · giant name · hook · one line · spec · CTA)
- **01/04 · Coconut** · giant "Coconut" · "Flakes that still taste *like the nut.*" · "Shaved thin and dried to a clean snap. Sweetened for the snack bowl, unsweetened for the kitchen." · "Sweetened & unsweetened · retail pouch · trade sizes on request" · **See coconut flakes**
- **02/04 · Chia coco** · giant "Chia coco" · "Coconut with *a seed crunch.*" · "Coconut, chia, sesame, cinnamon, date and honey, dried together into a denser chew." · "Blend · retail pouch" · **See chia coco**
- **03/04 · Mango** · giant "Mango" · "Ripe mango, *dried to a slow chew.*" · "Cut from ripe fruit and dried until the tang concentrates." ⚑ (confirm texture: chewy vs crisp) · "Mango chips · retail pouch" · **See mango chips**
- **04/04 · Pineapple** · giant "Pineapple" · "Pineapple *you can hear.*" · "Rings dried until the edges toast and the centre stays bright." · "Pineapple chips · retail pouch" · **See pineapple chips**

**7 · Pack your mix**
- "Pack *your mix.*" · "Tap a fruit. We'll fill the tray."
- Toggle label: "Buying for" → "A shelf abroad" / "My kitchen in Ghana"
- Abroad summary: "Sample set: coconut (sweetened), mango." CTA **Request these samples**
- Ghana summary: "2 pouches · GHS [live price]". CTA **Add 2 pouches to cart**

**8 · How it's made**
- "Six steps *from fruit to pouch.*"
- Nodes: Dehusk & peel · Slice · Wash · Steam · Dehydrate · Nitrogen-flush pack. Bodies come from `processSteps`, trimmed to ≤10 words each.
- Link: "See the process →"

**9 · What we can show you** (replaces "Honest about the roadmap")
- "What we can *put on the table.*"
- Ledger rows (status · item · one line):
  - Documented · Ghana FDA documentation · "[exact document name and scope]" ⚑ Docs/11 says to name it when publishing.
  - Documented · Registered with the Registrar of Companies · "Edis Mart, the Ghanaian company behind Yeskoko."
  - On shelves · Accra, Tamale, Cape Coast, Ho · "Sold through Ghana retail partners." (city-level only, no partner names)
  - In progress · GSA certification · "Listed here as current once the certificate is issued."
- Foot line: "Copies of every document come with the buyer pack."

**10 · From our trays to your shelf**
- "From our trays *to your shelf.*"
- Sub: "For importers, distributors and specialty retailers in the UK, EU and US."
- Steps:
  - 01 Request the buyer pack: "Products, formats, documentation status."
  - 02 Samples and documents: "Sample set and copies of what we hold."
  - 03 Formats and volumes: "Pouch sizes, carton counts, private label enquiries." ⚑ (the form offers "Private label / contract pack". Confirm it's offered.)
  - 04 First order: "Lead times confirmed in writing." ⚑
- CTA: **Request the buyer pack**

**11 · The people**
- "Female-led. Farmer-sourced. *Packed in Accra.*" · existing sourcing paragraph (`page.tsx:212-215`), trimmed to 2 sentences. Link: "Read the sourcing story →"
- ⚑ This needs a real photo (§1.7).

**12 · In Ghana?**
- "In Ghana? *It's on the shelf.*" · "Accra, Tamale, Cape Coast and Ho. Or order online: Paystack, MoMo or cash on delivery where offered." · **Shop Yeskoko**

**Banned in all copy:** "healthy", "nutritious", "export certified", "HACCP/ISO/BRC/organic", "elevate", "seamless", "finest". Also "nothing added" (the sweetened flakes have sugar).

---

## 4. Film spec

**New component** `src/components/motion/SunFilm.tsx` (replaces `ScrollRitual.tsx`). **New data** goes in `src/lib/film.ts`. Delete `scrubFromProgress`, `useScrollProgress` usage and `next/image` from the film.

### 4.1 Frames: one set, two orientations

| # | id | Chapter | Time of day | What changes (same camera, same table) |
|---|---|---|---|---|
| F01 | `f01-table` | intro | early morning | Almost empty limestone table, palm-frond shadow, one green coconut on its stalk at the subject spot |
| F02 | `f02-coconuts` | 01 Tree | morning | Bunch of 3 green coconuts + a pineapple + 2 Ghanaian mangoes, still whole, dew |
| F03 | `f03-opened` | 02 Fruit | mid-morning | Coconut cracked open (white meat), mango halved, pineapple crown off |
| F04 | `f04-sliced` | 02 Fruit | late morning | Thin coconut shavings, mango cheeks sliced, pineapple rings on a wooden board |
| F05 | `f05-tray-wet` | 03 Trays | noon | Same slices laid out on a stainless mesh drying tray in three bands |
| F06 | `f06-tray-dry` | 03 Trays | early afternoon | Same tray, pieces now dried, curled, golden-edged |
| F07 | `f07-pack-coconut` | 04 Packs | afternoon | **Real** sweetened coconut flakes pouch standing at the subject spot (composite), a few flakes at its foot |
| F08 | `f08-pack-chia` | 04 Packs | afternoon | Real chia coco pouch (composite) |
| F09 | `f09-pack-mango` | 04 Packs | afternoon | Real mango chips pouch (composite) |
| F10 | `f10-pack-pineapple` | 04 Packs | afternoon | Real pineapple chips pouch (composite) |
| F11 | `f11-pile` | 05 Snap | golden hour | Loose mixed pile of flakes, mango and pineapple chips, long amber shadows |
| F12 | `f12-snap` | 05 Snap | late golden | One hand snapping a pineapple chip above the pile, crumbs mid-air |

- **Landscape set:** 1600×900 WebP, q≈72, target ≤170 KB each. Plus a 1024×576 variant for tablets and 1× screens.
- **Portrait set:** 900×1600 WebP, q≈72, ≤150 KB. Plus 640×1138 for small phones.
- File names: `public/film/day/{id}.webp`, `{id}-1024.webp`, `{id}-p.webp`, `{id}-p-640.webp`.
- Generate portrait frames **as their own images** with the same prompt plus the portrait placement line (§6.1). Don't crop landscape: a 9:16 slice of a 1536px-wide render is only ~576px wide.
- Packs frames (F07–F10) use a lower camera (eye-level). The 03→04 boundary therefore gets the longest crossfade (`fade: 0.6`) so the angle change reads as a cut, not a glitch.

### 4.2 Subject alignment data
This works like Bobalicious's `cx/rim/base`, but uses **`cx / top / base`** of the subject cluster. All values are fractions of the image, recorded **per orientation**.

```ts
// src/lib/film.ts
export type Anchor = { cx: number; top: number; base: number };
export type DayFrame = {
  id: string;
  chapter: 0 | 1 | 2 | 3 | 4 | 5;  // 0 = intro (F01)
  l: Anchor;                         // landscape 1600×900
  p: Anchor;                         // portrait 900×1600
  hold?: number;                     // scroll weight, default 1
  fade?: number;                     // share of segment spent crossfading, default 0.45
  label?: string;                    // packs: small-caps pack name
  alt: string;
};

export const dayFilm: DayFrame[] = [
  { id: "f01-table",  chapter: 0, l: { cx: .66, top: .40, base: .82 }, p: { cx: .5, top: .34, base: .60 }, hold: 1.4, alt: "A green coconut on a sunlit limestone table under palm shadow" },
  { id: "f02-coconuts", chapter: 1, l: { cx: .66, top: .30, base: .82 }, p: { cx: .5, top: .28, base: .60 }, hold: 1.3, alt: "Whole green coconuts, a pineapple and two mangoes on the table" },
  // …values measured from the delivered renders in Phase 1; the above are the prompt targets
];
```

**Placement: full-bleed, never letterboxed.** Scale the frame so the subject matches the target height, but never below cover. Then clamp so no edge ever shows.

```ts
function target(w: number, h: number) {
  return w / h > 1.1
    ? { cx: 0.66, base: 0.84, h: 0.56 }   // landscape: subject right, copy left
    : { cx: 0.50, base: 0.60, h: 0.34 };  // portrait: subject upper-middle, copy in bottom 35%
}
function place(a: Anchor, iw: number, ih: number, sw: number, sh: number) {
  const t = target(sw, sh);
  let s = (t.h * sh) / ((a.base - a.top) * ih);
  s = Math.max(s, sw / iw, sh / ih);                 // full-bleed: never smaller than cover
  const w = iw * s, h = ih * s;
  const left = Math.min(0, Math.max(sw - w, t.cx * sw - a.cx * w));
  const top  = Math.min(0, Math.max(sh - h, t.base * sh - a.base * h));
  return { w, h, left, top, ox: a.cx * 100, oy: ((a.top + a.base) / 2) * 100 };
}
```

- Orientation choice: use `matchMedia("(min-aspect-ratio: 11/10)")` for landscape files, otherwise portrait. Re-place on `resize` (debounced 100ms) without reloading images unless the orientation flips.
- **Alignment helper (dev-only):** `src/app/dev/film-align/page.tsx`, blocked in production via `notFound()` when `NODE_ENV==="production"`. It shows each frame with draggable crosshairs for cx, top and base and copies the JSON. It replaces guessing (Bobalicious tuned these by eye) and takes about 1.5h to build.

### 4.3 Timing: hold, then crossfade
- Progress `p ∈ [0,1]` comes from one GSAP `ScrollTrigger` on the track (`start: "top top"`, `end: "bottom bottom"`, `scrub: 0.5`). Lenis already calls `ScrollTrigger.update` (`SmoothScroll.tsx`).
- The segments are weighted: frame *i* owns `hold_i / Σhold` of the track. Inside a segment, the first `1 − fade` **holds** (the image is fully visible, with only the push-in moving). The last `fade` share crossfades into frame *i+1* with smoothstep `t*t*(3-2t)`.
- **Push-in:** each frame scales from 1.000 to 1.035 over its life, `transform-origin` at the subject (`ox% oy%`). Because placement is clamped, the scale never reveals an edge.
- **Sun scrim:** the copy-side gradient (`linear-gradient(90deg, var(--scrim) 0%, transparent 55%)` on desktop, bottom-up on portrait) interpolates `--sun-am → --sun-noon → --sun-pm` by `p`. This gives readable text on a light photo without darkening it.
- **All in the DOM, styles written directly:** render all 12 `<img>` of the active orientation once and stack them absolutely. The ScrollTrigger `onUpdate` writes `opacity` and `transform` straight to the elements, the same way boba's `Film.tsx` does. React state changes only when the **chapter** changes (6 times per pass), not per tick.
- Track height: `480vh` desktop, `420svh` phone. That's about 40vh per frame plus the holds. It's shorter than Bobalicious (620vh) because daylight stills need fewer beats.

### 4.4 Chapter rail and progress slider
- **Desktop:** a **vertical** rail on the right edge, 50vh tall and vertically centred (Bobalicious uses a horizontal bottom slider, so this is deliberately different).
  - A 1px `forest/15` line with a `clay` fill that grows with `p` (`transform: scaleY(var(--p))`).
  - A 10px clay **sun disc** marker that travels down it.
  - Five buttons: "01 Tree · 02 Fruit · 03 Trays · 04 Packs · 05 Snap". The active one is in forest, done ones in `forest/55`, upcoming in `forest/30`.
- Clicking a label scrolls to that chapter's hold midpoint via `lenis.scrollTo(y, { duration: 1.2 })`. With no Lenis (reduced motion), it uses `window.scrollTo`.
- **Phone:** a 2px horizontal progress bar pinned just under the header, with 5 tick marks. The current chapter number and name show in small caps above the copy ("03 · Trays"). No buttons on phone, because the copy area is the only free space.
- A **"Skip the film ↓"** link, visible on focus/tab and as a quiet small-caps link at the bottom-left on desktop, jumps to `#line`.
- `aria-live="polite"` announces "Chapter 3 of 5: Trays" on chapter change only.

### 4.5 Copy layer
- All chapter copy is in the DOM as real headings (F01 is the `<h1>`, the chapters are `<h2>`), stacked and toggled with opacity/translate. Inactive copy gets `aria-hidden` and `inert`.
- Desktop: copy column left, `max-w-[34rem]`, vertically centred. Phone: copy anchored to the bottom, `max-h-[35svh]`, title `clamp(2rem, 9vw, 2.6rem)`, note ≤2 lines, no CTA except on 05.
- Headline entrance: lines slide up through a mask (`translateY(108%) → 0`, 900ms, `cubic-bezier(.22,1,.36,1)`, 80ms stagger). That's the same family as the existing `fadeRise`, but per line.

### 4.6 Preloading and budget
- `<link rel="preload" as="image" fetchpriority="high">` for F01 and F02 of **both** orientations, each with a `media` attribute. Add these in `page.tsx` via React 19 `preload()` from `react-dom`, or with `<link>` elements in the route.
- After `window.load`, use `requestIdleCallback` to load F03→F12 **in order**. Call `img.decode()` before an image can be shown. While frame *i+1* hasn't decoded, the scrub **holds** on frame *i* instead of fading into a blank.
- Budget:
  - Desktop film: ≤2.0 MB total, ≤340 KB before first paint.
  - Phone film: ≤1.6 MB, ≤300 KB before first paint.
  - LCP element = F01. Target LCP ≤2.5s on Fast 4G.

### 4.7 Reduced motion
`prefers-reduced-motion: reduce` gives a different layout:
- No pin. The track collapses to `auto` height.
- F11 (the pile) shows as a static full-bleed hero with the H1.
- Below it, the five chapters render as a simple vertical list of five rows: a still thumbnail (portrait 640 files) + headline + note.
- No push-in, no crossfade, no Lenis.

Rail buttons become in-page anchors to those rows.

---

## 5. Product worlds and interaction

### 5.1 Fruit fields (stacked full-screen colour fields)
**Component:** `src/components/FruitFields.tsx` (replaces `ProductWorlds.tsx`). Data stays in `fruitStories` in `content.ts`, extended with `field`, `ink`, `soft`, `giant`, `hook`, `line`, `spec` and `pieces[]`.

**Layout:** centred and symmetric (Bobalicious is split two-column).
- Each field is a `<article>` with `position: sticky; top: 0; height: 100svh`.
- Background is the field colour.
- The **giant fruit name** sits behind the pack: Cormorant italic, `clamp(5rem, 22vw, 22rem)`, `ink` at 14% opacity, centred, allowed to crop off both sides.
- The **real pack cut-out** is centred, `h-[56svh]` on desktop and `h-[40svh]` on phone, with a soft contact shadow.
- **Four fruit-piece cut-outs** (WebP with alpha) float around it at three parallax depths (R6).
- Bottom-left: eyebrow, hook, one line, spec. Bottom-right: the one CTA.
- Phone: everything stacks centred, giant name above the pack, copy below, CTA full-width.

**Transition: arched rise** (Bobalicious uses slide-over + sink-and-dim).
- The incoming field's top edge is an ellipse arch. `clip-path: ellipse(120% 100% at 50% 100%)` animates to `inset(0)`, so the field "rises like the sun" over the previous one, scrubbed over the 100vh before it pins.
- The outgoing field doesn't sink. Its giant name slides up 12vh and fades to 0, and its pieces drift up faster than the pack. It reads as the day moving on, not as a card being buried.

**Pieces motion:**
- `yPercent` from +30/+18/+8 to −10 by depth while the field is in view (scrub).
- Pieces never cross the pack's bounding box or the copy.
- Subtle ±4° rotation.
- Desktop only: 8px max pointer parallax via `pointermove`, rAF-throttled. Disabled on touch.

**Field table:**

| Fruit | Field | Text | Soft text | Pieces (cut-outs) |
|---|---|---|---|---|
| Coconut | `#173B2A` | `#F3EBDD` | `#F3EBDD` @ 70% | 3 curled flakes, 1 coconut half with white meat |
| Chia coco | `#9A4A2E` | `#F3EBDD` | `#F3EBDD` @ 72% | 2 chia-coco clusters, 1 date half, 1 cinnamon stick |
| Mango | `#E0A128` | `#173B2A` | `#173B2A` @ 72% | 3 mango chips, 1 fresh mango cheek |
| Pineapple | `#4E6332` | `#F3EBDD` | `#F3EBDD` @ 72% | 2 dried rings, 1 chip, 1 crown leaf |

Before the first field, a short intro on oat (not a full viewport): "Four snacks. *Four different bites.*". It replaces "Four fruits. Four stories. One Accra house."

### 5.2 "Pack your mix" (new interactive)
**Component:** `src/components/PackYourMix.tsx` (client). It answers both audiences in one block with one adaptive CTA.

- **Stage:** a top-down photo of the **same stainless drying tray** from the film (empty plate, 1600×1600), divided into 4 implied lanes.
- **Controls:** four fruit tokens (round 64px cut-outs + name) as `<button aria-pressed>`.
- **Tap a token:** its cut-out does a FLIP flight (R26) from the token into its lane. The token's bounding box is measured, the piece animates with transform to the lane's pile position (420ms, `cubic-bezier(.2,.8,.2,1)`), then swaps for the **pile cut-out** in that lane with a 1.04→1 settle. Tap again to remove it (reverse flight, 280ms).
- **Toggle:** "Buying for: A shelf abroad / My kitchen in Ghana", a segmented control. It defaults to "abroad" when `navigator.language` isn't `*-GH`, otherwise "Ghana". Only the copy and CTA change; the tray stays.
- **CTA:**
  - **Abroad:** "Request these samples" → `/export?products=Sweetened%20coconut%20flakes,Mango%20chips#inquiry`. Needs a **small change** to `src/components/TradeInquiryForm.tsx` so it reads `useSearchParams().get("products")` and sets `defaultChecked` on the matching checkboxes. The names must match the `products` array at `TradeInquiryForm.tsx:6-12`.
  - **Ghana:** "Add N pouches to cart" calls `useCart().addItem()` (`src/store/cart.ts:28`) for each selected SKU with live price data from `src/lib/catalog.ts`, then shows "Added. View cart →". The cart badge in Header updates.
  - Disabled with "Pick at least one" when nothing is selected.
- **Analytics:** `track("mix_toggle")`, `track("mix_cta", { audience, products })` via `src/lib/analytics.ts`.
- **Reduced motion:** no flight. Piles just appear (opacity 150ms).
- **Keyboard:** the tokens are a toolbar group. Space/Enter toggles. The live region reads "Mango chips added. 2 in your mix."

### 5.3 Sections 8–12: motion assignment (no blanket `<Reveal>`)
- **How it's made:** one SVG path (`stroke-dashoffset` scrubbed) runs through 6 nodes on forest. Each node label fades in as the line reaches it (R28). On phone the path is vertical.
- **Proof ledger:** rows are a `<dl>`. Each row's top rule scales X from 0 to 1 (600ms, 80ms stagger) **once** when the block enters view. Text doesn't move.
- **Trays to shelf:** a horizontal rule draws through 4 numbered nodes (vertical on phone). This is the only other R28 use, and it's deliberately quieter: a straight line, not a path.
- **People:** a full-bleed photo with `scale 1.08 → 1` over its scroll range. Copy sits on a bottom gradient.
- **In Ghana?:** static mango field. The one CTA. No motion.

`<Reveal>` stays available for other routes but is **removed from the homepage**.

---

## 6. Assets and prompts

**Generator:** Figma AI image, **`gpt-image-2.5-sunburst`** (it worked for Bobalicious, Adam's team). Work in a new Figma file, **"Yeskoko — asset studio"**. The Gemini key has no image quota, so `scripts/gen.mjs` from the boba repo isn't usable here yet.

**Consistency method:**
1. Generate F01 landscape until the set is right.
2. For every later frame, pass the **previous approved frame as the reference image**, if the Figma image tool accepts one, with "Keep EXACTLY…" wording.
3. If it doesn't accept a reference, paste the full SET block verbatim every time. Never paraphrase it.

**Pipeline:** Export PNG at the largest size the tool offers. Then, locally (cheap on the old MacBook):

```bash
cwebp -q 72 -resize 1600 900 f01-table.png -o public/film/day/f01-table.webp
```

Use `brew install webp` if `cwebp` is missing; `sips` works for resizing. Raw PNGs go in `assets/gen/` (git-ignored, matching the boba repo).

### 6.1 Shared blocks (paste into every film prompt)

**SET (landscape):**
> Photoreal editorial food photograph, indistinguishable from a real photo. Fixed camera: full-frame, 50mm lens, f/5.6, camera 35° above the tabletop looking down and forward, tripod-locked, identical framing in every shot of the series. Set: a pale honed limestone tabletop (#E9DFCF) on a shaded Accra veranda; behind it a softly out-of-focus warm cream plaster wall (#F3EBDD); soft, blurred coconut palm fronds entering from the top-right corner. Light: hard tropical sun from the upper left casting a crisp palm-leaf shadow pattern across the table, warm bounce fill from the right, no flash. Grade: warm, natural, low saturation, fine film grain, no vignette. Composition: the subject cluster sits centred at 66% from the left edge, its base on a line 82% down the frame, occupying the middle half of the frame height; the left 40% of the frame is calm, empty limestone for headline text. No text, no logos, no labels, no packaging, no faces, no watermark.

**SET (portrait):** the same block, but replace the Composition sentence with:
> Composition: vertical 9:16 frame; the subject cluster is centred horizontally, its base on a line 60% down the frame, occupying about a third of the frame height; the bottom 35% of the frame is calm, empty limestone for text and the top 10% is soft background.

**TIME** (insert once per frame):
- **morning:** "sun low and cool-warm, long soft shadows falling to the lower right"
- **noon:** "sun high and white-hot, short hard shadows directly beneath objects"
- **afternoon:** "sun lowering, shadows lengthening to the right, light turning honey-warm"
- **golden:** "golden-hour sun, long amber shadows across the whole table, glowing rim light on edges"

**REF** (frames 2–12, before the change line):
> Keep EXACTLY the same camera, lens, angle, framing, tabletop, wall, palm fronds and light direction as the reference image. Change only the following:

### 6.2 Film frame prompts (landscape; then run each again with SET-portrait)

| # | Prompt (after SET + TIME + REF) |
|---|---|
| F01 | TIME morning. "A single fresh green coconut, still attached to a short piece of its stalk, rests on the table at the subject spot. Everything else is empty limestone and palm shadow. Quiet, expectant, early." |
| F02 | TIME morning. "A small cluster at the subject spot: three fresh green coconuts, one whole ripe pineapple with its crown, and two ripe Ghanaian mangoes (green-yellow skin blushing red). Tiny dew droplets on the skins." |
| F03 | TIME morning (mid). "At the same spot: one green coconut cracked open showing thick bright white meat and a little coconut water; one mango cut in half showing deep orange flesh and the stone; the pineapple with its crown removed lying beside it. A plain steel knife lies flat, handle away from camera." |
| F04 | TIME noon (late morning). "At the same spot on a pale wooden cutting board: a heap of very thin raw coconut shavings, a fan of thin mango slices, and a stack of thin pineapple rings with the core removed. Juice glistening, no knife in frame." |
| F05 | TIME noon. "At the same spot, a rectangular stainless steel drying tray with a fine mesh base, holding the raw slices laid flat in three neat bands: white coconut shavings on the left, orange mango slices in the middle, yellow pineapple rings on the right. Slightly wet, freshly laid." |
| F06 | TIME afternoon. "The same tray and the same three bands, now fully dried: coconut shavings curled and pale-gold at the edges, mango slices darker orange and slightly wrinkled, pineapple rings golden with toasted edges. Smaller than before, as dried fruit shrinks." |
| F07–F10 | **Plate only** (packs are composited from real photos, §6.3). Camera override, replacing the camera sentence: "camera at 10° above the tabletop, almost eye level, same lens." TIME afternoon. "The table at the subject spot is empty except for a few loose pieces of [coconut flakes / chia coco clusters / dried mango chips / dried pineapple chips] scattered in front of where a standing snack pouch will be placed; leave a clear vertical space 45% of the frame height, centred at 66% from the left, for the pouch." Make 4 plates, one per fruit. |
| F11 | TIME golden. "At the subject spot, a generous loose mixed pile of finished dried snacks: curled coconut flakes, dried mango chips and golden dried pineapple chips with toasted edges, a few pieces spilling toward the camera." |
| F12 | TIME golden (late). "The same pile; a single dark-skinned hand enters from the upper right and snaps a dried pineapple chip in half just above the pile, tiny crumbs suspended mid-air, sharp focus on the break. Only the hand and wrist are visible." |

### 6.3 Pack images (real photos only, never generated)
AI garbles label text (see §1.7). The pack pixels must come from the owner. **Ask for:**
- 4 pouches (sweetened coconut flakes, chia coco, mango chips, pineapple chips), plus unsweetened coconut if it has its own pack.
- Each shot straight-on at mid-pack height, phone camera in shade daylight, on a plain white sheet.
- Full-resolution originals (≥2000px tall), sent as files, not via WhatsApp compression.

**Processing:**
1. Finder → Quick Actions → **Remove Background** (macOS 13+). Fallback: Higgsfield `remove_background`, which needs credits.
2. Export 1400px-tall WebP with alpha.
3. Composite onto the F07–F10 plates in Figma, with a matching soft contact shadow and a light warm grade layer at 8%.
4. Reuse the same cut-outs in the fruit fields (§5.1) and Pack your mix.

**Interim** until the photos arrive: use the current `public/products/*.jpg` in the fields only. Don't put them in the film. Add an owner-review flag in the launch checklist.

### 6.4 Fruit-field pieces and Pack-your-mix assets (cut-outs)
**Shared CUTOUT block:**
> Photoreal studio macro photograph of a single food item, isolated on a pure white seamless background, soft even top light, a faint natural shadow directly beneath, 100mm macro lens, f/8, razor-sharp detail, warm natural colour, centred with generous margin. No text, no props, no hands.

Then remove the background (§6.3 method) and export 800px WebP with alpha.

| Asset | Item line (after CUTOUT) |
|---|---|
| `piece-coconut-flake-{1,2,3}` | "one large curled dried coconut flake, pale ivory with golden toasted edges, slightly translucent at the thin edge" (×3, vary the curl) |
| `piece-coconut-half` | "one fresh coconut half, brown fibrous husk outside, thick bright white meat inside, viewed at 30°" |
| `piece-chia-cluster-{1,2}` | "one small irregular cluster of dried coconut flakes bound with chia seeds and sesame seeds, glossy with a little honey" |
| `piece-date` | "one dark glossy date cut in half lengthwise" |
| `piece-cinnamon` | "one cinnamon stick, curled bark" |
| `piece-mango-chip-{1,2,3}` | "one dried mango slice, deep orange, slightly wrinkled and translucent at the edges" |
| `piece-mango-cheek` | "one fresh mango cheek scored in a grid and pushed out, juicy orange cubes" |
| `piece-pineapple-ring-{1,2}` | "one dried pineapple ring with the core removed, golden yellow with toasted brown edges" |
| `piece-pineapple-chip` | "one irregular dried pineapple chip, bright yellow centre, toasted edge" |
| `piece-pineapple-leaf` | "one spiky green pineapple crown leaf" |
| `mix-tray` (1600×1600) | Use the SET block, with the camera replaced by "camera directly overhead, 90° top-down". TIME noon. "An empty rectangular stainless steel drying tray with a fine mesh base fills the centre of the frame on the limestone table, palm shadow across one corner." |
| `mix-pile-{coconut,chia,mango,pineapple}` | CUTOUT with "camera directly overhead": "a loose flat pile of [item] about the size of a hand, seen from directly above" |
| `people` (1600×900 + 900×1600) | **Not generated.** Real photo from the owner: hands at the trays or the team at work, with consent. Until then, use F06 (dried tray) as the background, with copy that doesn't claim to show the team. |
| OG image | Crop of F11 landscape, 1200×630, with "Dried in Ghana. Distinct on shelf." set in Cormorant. Replaces `/film/ghana/04-family/poster.jpg` in `layout.tsx:38,44`, `page.tsx:25` and `export/page.tsx:17`. |

**Totals:**
- 24 film images (8 photo frames F01–F06 and F11–F12, plus 4 pack plates, each in landscape and portrait)
- 18 piece cut-outs
- 5 mix assets

That's about 45 generations, plus retries. No video.

---

## 7. Checklists

### 7.1 Mobile
- [ ] The film stage on a 375×667 phone has **no clipped content**: copy block ≤35svh, title ≤2 lines at `clamp(2rem,9vw,2.6rem)`, no buttons until chapter 05.
- [ ] Use `svh` for the sticky stages (no URL-bar jump) and `dvh` nowhere in pinned layouts.
- [ ] The portrait set loads on phones (verify in the Network panel that no `*-1024`/landscape files load at 390px).
- [ ] Fruit fields: pack ≤40svh, CTA full-width and ≥48px tall, the giant name crops nicely.
- [ ] Pack your mix: tokens are 64px touch targets in a 2×2 grid, the toggle sits above the tray, the CTA is sticky at the bottom of the block.
- [ ] Pointer parallax is off on touch (`(hover: none)`).
- [ ] Test 375×667, 390×844, 412×915, 768×1024 portrait and 1024×768 landscape (which takes the landscape set via the 11/10 aspect rule).

### 7.2 Performance (throttled 2019 Intel MacBook as the floor)
- [ ] No React state updates per scroll tick (React profiler: film re-renders only on chapter change).
- [ ] Only `opacity`, `transform` and `clip-path` are animated. No `filter: blur`, no animated `box-shadow`.
- [ ] Film budget: desktop ≤2.0 MB, phone ≤1.6 MB. First paint ≤340 KB. Each piece cut-out ≤60 KB. Mix tray ≤180 KB.
- [ ] `img.decode()` gate: no blank frame on a fast scroll with cache disabled.
- [ ] Remove the `next/image` resize work from the film (plain `<img>` with pre-sized files and `srcset`).
- [ ] Lighthouse mobile (run against `next build && next start`, **not** dev, since the dev server is misleading on this machine): Perf ≥85, LCP ≤2.5s, CLS ≤0.05, TBT ≤200ms.
- [ ] Bundle: no new dependencies. GSAP, Lenis and `motion` are already installed (`package.json`). Drop the `motion` import from homepage components if nothing on the page still uses it.

### 7.3 Accessibility
- [ ] One visible `<h1>` (F01 headline). Chapters, fields and sections each have an `<h2>`, in order.
- [ ] Inactive film copy is `aria-hidden` + `inert`. The chapter change is announced once.
- [ ] "Skip the film" link is the first focusable element inside the film.
- [ ] Rail buttons and field CTAs have visible `focus-ring` (forest outline, 2px offset on light grounds, oat outline on dark fields).
- [ ] Contrast: all field text pairs ≥4.5:1 (§2.3). Small caps at 70% opacity must still pass, so check them with the tool.
- [ ] `prefers-reduced-motion`: no pin, no scrub, no FLIP, no parallax, no Lenis (already gated in `SmoothScroll.tsx`). Layout verified.
- [ ] Decorative frames and pieces get `alt=""`. Pack cut-outs in fields get "Yeskoko [product] pouch". The film carries one sr-only summary of all 12 frames.
- [ ] Pack your mix: `aria-pressed` tokens, a live region for the count, and the CTA's disabled state is explained in text.
- [ ] Zoom to 200%: film copy doesn't overflow (fall back to unpinned layout when `innerHeight < 520`).

### 7.4 Claims (before launch)
- [ ] No pack image with garbled regulatory text anywhere on the site.
- [ ] No generated people presented as the Edis Mart team.
- [ ] Every ⚑ line in §3.1 is confirmed by the owner or cut.
- [ ] The FDA document name and scope is filled in exactly.
- [ ] The GSA row still says "In progress".

---

## 8. Build order

| Phase | Work | Files | Estimate |
|---|---|---|---|
| **0 · Contract + cleanup** | Amend `docs/10-scroll-film.md` (mark it superseded by 13) and the `docs/11` "Homepage locked note". Delete the dead components and deprecated exports (§1.8). Send the owner asks: pack photos, real team photo, FDA document name, ⚑ lines. Add the §2.3 tokens. | docs, `globals.css`, `content.ts`, `film.ts`, `motion/*` | 0.5 day |
| **1 · Assets** | Figma studio file. Generate F01, get it approved, then F02–F12 landscape, then portrait. Pieces, mix tray, piles. WebP export. Build the `/dev/film-align` helper and record anchors. Composite packs when the photos arrive (interim: fields only). | `assets/gen/`, `public/film/day/`, `public/img/pieces/`, `src/app/dev/film-align/` | 1.5 days (generation is cloud-side; the local machine only converts) |
| **2 · Film** | `SunFilm.tsx`: placement, weighted hold/crossfade, push-in, sun scrim, vertical rail + phone bar, skip link, preload/decode gate, reduced-motion layout. Swap it into `page.tsx`. Delete `ScrollRitual.tsx` and `useScrollProgress.ts` if unused. | `components/motion/SunFilm.tsx`, `lib/film.ts`, `app/page.tsx` | 1 day |
| **3 · Fruit fields** | `FruitFields.tsx`: sticky stack, arched rise, giant names, parallax pieces, one CTA each. Extend `fruitStories`. Delete `ProductWorlds.tsx`. | `components/FruitFields.tsx`, `lib/content.ts` | 0.75 day |
| **4 · Editorial sections** | The line, How it's made (R28), proof ledger, trays-to-shelf, people, In Ghana. Remove `<Reveal>` from the homepage. Header "For buyers" pill + "Shop" link. Replace the OG image. | `app/page.tsx`, small section components, `Header.tsx`, `layout.tsx` | 1 day |
| **5 · Pack your mix** | `PackYourMix.tsx` (FLIP, toggle, cart and export paths, analytics). `TradeInquiryForm` reads `?products=`. | `components/PackYourMix.tsx`, `components/TradeInquiryForm.tsx` | 1 day |
| **6 · QA + finish gate** | §7 checklists at all viewports. Reduced motion. Lighthouse on a prod build. docs/11 finish gate (avg ≥8/10, no category <7). Screenshot loop. | — | 0.75 day |

**Total ≈ 6.5 working days.**

Phases 1 and 2 can overlap: build the film against the current frames, then swap in the new set. Phase 3 can ship with the interim pack JPGs.

**Order of value if time is cut:** Phase 0 → 2 → 3 → 4 gives most of the upgrade. Pack your mix (5) is the extra.

---

## 9. Open questions for the owner
1. **Pack photos:** can you send the 4–5 real pouches as full-resolution photos (§6.3)? This blocks the packs chapter.
2. **Team photo:** is there a real photo of the processing team, or hands at the trays, that we can use with consent?
3. **FDA:** what's the exact name and scope of the Ghana FDA document to publish?
4. **Private label / contract packing:** offered to importers or not? It's in the inquiry form today.
5. **Mango texture:** chewy or crisp? This decides the hook line.
6. **Lead times and carton formats:** can we say anything concrete on the buyer route?
7. **Founder spelling** (docs/11 owner flag): unchanged by this plan, but still unresolved.
