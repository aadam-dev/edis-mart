# 08 — Cutover runbook

## Parallel run

1. Build and deploy Next app to Vercel preview.
2. Point preview to test Paystack keys + staging DB.
3. Keep Hostinger WordPress live on `edismartgh.com`.
4. QA checklist (below) on preview.

## Go-live day

1. Switch Paystack webhook to production URL.
2. Switch env to live Paystack keys.
3. Confirm shipping fee and hours in admin.
4. Lower DNS TTL 24h before if possible.
5. Update DNS: apex/www → Vercel.
6. Verify HTTPS and redirects.
7. Place live ₵1 Paystack test order; refund.
8. Place COD test; WhatsApp composer test.
9. Submit new sitemap to GSC.
10. Leave WP on Hostinger for 14 days as rollback, password-protect or `noindex` if needed.

## Rollback

1. Point DNS back to Hostinger.
2. Re-enable Woo Paystack webhook.
3. Investigate Next logs / Paystack dashboard.

## QA checklist

- [ ] Home hero + CTAs at 390px and desktop
- [ ] Shop lists all sellable products
- [ ] Size select updates price
- [ ] Add to cart → cart totals
- [ ] Checkout Paystack (test)
- [ ] Checkout COD
- [ ] WhatsApp prefilled message
- [ ] Order confirmation page
- [ ] `/about-us` → `/about` 301
- [ ] Duplicate product slugs redirect
- [ ] Reduced motion: no pin/hijack
- [ ] Click-to-call and hours visible
- [ ] Admin login + stock edit

## Owners

- Client: Paystack keys, shipping fees, social URLs, pineapple pricing
- Dev: Next deploy, DNS instructions, webhook, redirects
