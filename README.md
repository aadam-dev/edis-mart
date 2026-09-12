# Yeskoko by Edis Mart

Premium MotionSites-style storefront for Yeskoko dried fruit snacks (Ghana). Next.js + Tailwind + Prisma + Paystack.

## Quick start

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: `/admin` (password from `.env` `ADMIN_PASSWORD`, default `yeskoko-admin`).

## Docs

Migration brain lives in `docs/`:

- `00-brief.md` … `08-cutover.md`
- Payments: `docs/06-payments.md`
- SEO: `docs/07-seo.md`

## Stack

- Next.js App Router, Tailwind v4, Outfit + Manrope
- Prisma + SQLite (swap `DATABASE_URL` to Postgres for production)
- Paystack (card + MoMo) + COD + WhatsApp
- Zustand cart, Motion/GSAP-ready client leaves

## Env

Copy `.env.example` to `.env`. Add Paystack keys before live payments.
