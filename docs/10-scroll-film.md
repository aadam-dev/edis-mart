# 10 — Scroll film: From tree to the crisp

## Intent

One signature homepage film that actually scrubs. Tree → fruit → process → **labeled packs for all fruits** → crisp.

## Chapters

| # | Id | Label | Media source | Why |
|---|----|-------|--------------|-----|
| 1 | tree | Tree | `/film/ritual/01-tree` (coconut motion plates) | Proven scrub motion |
| 2 | fruit | Fruit | `/film/ritual/02-fruit` | Visible open-fruit progression |
| 3 | process | Process | `/film/ritual/03-process` | Tray / drying atmosphere |
| 4 | packs | Packs | `/film/ritual/04-packs` from **real** `public/products/*.jpg` | Readable Yeskoko labels for coconut, chia, mango, pineapple |
| 5 | crisp | Crisp | `/film/ritual/05-crisp` | Macro crunch finish |

Each chapter: 6 WebP frames. Packs chapter uses `fit: contain` + per-frame product captions.

## Layout / empty space rules

- Track height capped (`~280vh` mobile / `~420vh` desktop) so scroll distance matches real frame change
- Sticky stage fills the viewport; media uses `object-contain` for packs so labels are not cropped
- Chapter title is the big italic line; crawl H1 is `sr-only`
- Lenis scroll dispatches `yeskoko:scroll` so scrub stays in sync

## Reduced motion

Show mid-frame of current chapter; no scrub track height inflation beyond content.
