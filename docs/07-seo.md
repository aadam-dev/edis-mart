# 07 — SEO plan

## Baseline problems

- Title bare: `edismartgh.com`
- No meta description, OG, Twitter cards
- No JSON-LD
- Default WP sitemap only
- Weak product copy (empty descriptions)

## On-page

- Unique title + meta per route (see `docs/05-copy.md`)
- Single H1 per page
- Product images: descriptive `alt` (e.g. “Yeskoko sweetened coconut flakes pouches”)
- Internal links: home → shop → PDP → wholesale

## Structured data (JSON-LD)

| Page | Types |
|------|-------|
| Home | `Organization`, `WebSite`, `LocalBusiness` |
| Product | `Product` + `Offer` (GHS, availability) |
| FAQ | `FAQPage` |
| Breadcrumbs | `BreadcrumbList` on shop/PDP |

LocalBusiness NAP:

- Name: Edis Mart (Yeskoko)
- Telephone: +233549092316
- Email: edismart777@gmail.com
- Area: Accra, GH
- Opening hours: Mo-Fr 08:30-17:30

## Technical

- `app/sitemap.ts` + `app/robots.ts`
- Canonical URLs without trailing slash (or consistent with redirects)
- 301 map from `docs/03-ia-and-redirects.md`
- OG images from product packs
- Core Web Vitals: `next/image`, priority LCP on home/PDP

## Target queries (honest, Ghana)

- coconut flakes Ghana
- Yeskoko
- unsweetened coconut flakes Accra
- mango chips Ghana
- wholesale coconut flakes

## Post-launch

1. Submit sitemap in Google Search Console
2. Request indexing for home + top 3 PDPs
3. Monitor 404s for old WP paths
4. Add `llms.txt` later for AEO (Phase 2)
