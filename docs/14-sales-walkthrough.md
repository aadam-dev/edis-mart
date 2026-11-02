# 14 — Sales walkthrough video

Status: **current** · recorded against the live storefront + ops till  
Audience: internal sales / demos of Yeskoko by Edis Mart

## File

| Asset | Path | Notes |
|---|---|---|
| Finished cut | [`demo/yeskoko-edis-mart-walkthrough.mp4`](../demo/yeskoko-edis-mart-walkthrough.mp4) | 1440×900, ~7 MB |
| Recorder | [`scripts/sales-demo.mjs`](../scripts/sales-demo.mjs) | Playwright + on-screen captions |
| Raw intermediates | `demo/raw/` | Playwright WebM dumps — **gitignored** |

This is a sales cut of the **shipping site at record time**, not a preview of the motion redesign in [`13-motion-redesign.md`](13-motion-redesign.md). Re-record after the homepage stack ships if the pitch needs the new sections.

## What the cut covers

1. Title card — shop, till, and back office  
2. Storefront home (scroll past the ritual film)  
3. `/shop` pantry + a product page  
4. `/about` and `/wholesale`  
5. Ops login → today, orders, customers, stock, production, reports  
6. `/pos` till: open float, add a pack, charge, receipt  

## How to re-record

1. Seed and run the app (see [README.md](../README.md) for ops login credentials).  
2. Point the recorder at that origin:

```bash
DEMO_BASE=http://localhost:3000 node scripts/sales-demo.mjs
```

3. Playwright writes WebM under `demo/raw/`. Promote the finished cut to `demo/yeskoko-edis-mart-walkthrough.mp4` (replace or re-encode as needed).  
4. Leave `demo/raw/` untracked.

Do not put ops passwords in this doc — use the seed accounts listed in the README.
