# Yeskoko by Edis Mart

Premium MotionSites-style storefront for Yeskoko dried fruit snacks (Ghana). Next.js + Tailwind + Prisma + Paystack + custom POS / ops back office.

## Quick start

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Admin / ops: `/admin/login` (password from `.env` `ADMIN_PASSWORD`)
- Till: `/pos` (same session after login)

## Docs

Migration brain lives in `docs/`:

- `00-brief.md` … `08-cutover.md`
- POS + back office: `docs/09-pos-and-back-office.md`

## Stack

- Next.js App Router, Tailwind v4, Cormorant Garamond + Hanken Grotesk
- Prisma + SQLite locally (swap `DATABASE_URL` to Postgres for production)
- Shared stock ledger for web + till
- Paystack (card + MoMo) + COD + WhatsApp
- Custom `/pos` till with MoMo/cash and printable Yeskoko receipts

## Env

Copy `.env.example` to `.env`. Add Paystack keys before live payments. Set `OPS_SESSION_SECRET` for signed ops cookies.
