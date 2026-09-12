# 06 — Payments migration

## Current state

WooCommerce cart Store API returns:

```json
"payment_methods": ["cod", "paystack"]
```

No Stripe or Flutterwave plugins detected. Keep Paystack + COD. Add WhatsApp as a non-gateway order path.

## Target architecture

1. Shopper selects size → cart → checkout (name, phone, email, Accra address or pickup).
2. **Paystack** Inline / Popup: `card` + `mobile_money` channels, GHS.
3. Webhook `charge.success` marks order `paid` and emails confirmation.
4. **COD**: order created as `pending_cod`; ops confirms by phone.
5. **WhatsApp**: composer builds `wa.me/233549092316?text=...` with cart lines. Not a payment capture.

## Env vars

```bash
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_WEBHOOK_SECRET=...   # or verify via Paystack signature header
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=...
WHATSAPP_NUMBER=233549092316
SHIPPING_ACCRA_FEE_PESAVAS=2500   # ₵25.00 default; confirm with client
```

Amounts in Paystack are **pesewas** (multiply GHS by 100).

## Cutover steps

1. Client opens existing Paystack business dashboard (same merchant as Woo plugin).
2. Create API keys for the new Next app (test first).
3. Register webhook: `https://<preview>.vercel.app/api/paystack/webhook` then production `https://edismartgh.com/api/paystack/webhook`.
4. Enable Mobile Money channel if not already.
5. Run ₵1.00 live test after DNS.
6. Disable Woo Paystack plugin only after new site is live and verified.
7. Export historic WooCommerce orders as CSV for records. Do not migrate payment tokens. New order IDs start fresh.

## Client inputs still needed

- [ ] Confirm MoMo already enabled on Paystack
- [ ] Accra delivery fee and pickup address
- [ ] Whether COD requires deposit
- [ ] Live keys at go-live

## Safety

- Verify webhook signature on every event.
- Idempotent order updates by Paystack `reference`.
- Never trust client-reported amounts; recompute from DB cart lines + shipping.
