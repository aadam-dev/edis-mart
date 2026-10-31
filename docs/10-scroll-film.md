# 10 — Scroll film: From tree to the crisp (LOCKED)

> **Homepage hero is frozen.** Repair scrub/assets/copy only. Do not invent a new hero concept without changing `docs/11-export-rebrand.md`.

## Intent

One signature homepage film. Tree → fruit → process → **labeled packs for all four fruits** → crisp.  
No second pin. No per-fruit scroll films.

## Chapters (locked)

| # | Id | Label | Title | Note | Media | Fit |
|---|----|-------|-------|------|-------|-----|
| 1 | tree | Tree | It starts on the tree. | Coconut palms and tropical fruit under Ghana light. | `/film/ritual/01-tree` | cover |
| 2 | fruit | Fruit | Then the fruit, still wet. | Coconut, mango, pineapple — selected for drying. | `/film/ritual/02-fruit` | cover |
| 3 | process | Process | Sliced, steamed, dried clean. | Accra trays. No preservatives. | `/film/ritual/03-process` | cover |
| 4 | packs | Packs | Four snacks. Clear labels. | Sweetened coconut → chia coco → mango → pineapple. | `/film/ritual/04-packs` from real `public/products/*.jpg` | contain |
| 5 | crisp | Crisp | Then the crunch. | Irregular flakes and chips. | `/film/ritual/05-crisp` | cover |

Packs frame order (locked):  
`00` sweetened coconut · `01` chia coco · `02` mango · `03` pineapple · `04` sweetened coconut · `05` pineapple

## CTAs (locked)

- Primary: **Request buyer pack** → `/export`
- Secondary: **Shop Ghana** → `/shop`

## Layout / motion rules

- Track: `~240vh` mobile / `~360vh` desktop (no empty 400vh+ runway)
- Sticky full-viewport stage; stage colour matches media edge (`#e7d3bf`)
- Soft chapter boundary: crossfade last frame of chapter N into first frame of N+1
- Shared progress from native `scroll` + `yeskoko:scroll` (Lenis)
- Crawl H1: sr-only brand line; visible chapter title is italic display
- Reduced motion: mid-frame + chapter buttons; no inflated track

## Landing stack after the film (locked)

1. Brand promise strip  
2. Four fruit editorial stories  
3. Process  
4. Trust / quality  
5. Sourcing  
6. Closing trade + shop CTA  
