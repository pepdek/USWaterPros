# Instant-price store (branch `store-oct-2026`)

Flow: ZIP → price (pick Essential / Complete / Iron-Free, enter name and mobile) → install day, time and address → pay by Stripe Checkout.
A lead is created at the price step, so people who never pay still become leads. ZIPs outside Pierce County join a waitlist (`service_type = waitlist`).

## Environment variables (Netlify)
| Variable | What for | If missing |
|---|---|---|
| `STRIPE_SECRET_KEY` | Creates the Checkout session | Wizard ends with "We'll text you a secure payment link" and you get the lead |
| `STRIPE_WEBHOOK_SECRET` | Verifies Stripe's "payment finished" call at `/api/stripe-webhook` | Payments are not recorded in the CRM |
| `SUPABASE_SERVICE_ROLE_KEY` | Lets the server attach the order to the lead and mark it paid | The order is saved as a second lead row |
| `NEXT_PUBLIC_SITE_URL` | Return URLs after Stripe (defaults to the request origin) | OK |

Stripe setup: add a webhook endpoint `https://uswaterpros.com/api/stripe-webhook` for the event `checkout.session.completed`.
Refunds are issued from the Stripe dashboard.

## Database
Migration `leads_order_details` added `leads.order_details jsonb` and `leads.stripe_session_id text` (already applied to the live project).
When Stripe confirms payment the lead becomes: paid = true, quote and final amount set, stage = job scheduled, job date = the chosen install day.

## Open items (VERIFY in source)
- Refund terms (`lib/store.ts`, Terms page): only "100% refundable" is stated.
- The ZIP list for Pierce County (`lib/serviceArea.ts`).
- What is outside the fixed price (`app/pricing/page.tsx`).
- Whether Essential and Iron-Free are also "tax included" (assumed same as Complete).
- Platform banner under the hero (`lib/store.ts`): "background-checked local plumbers across 50 states" and "Water Treatment Systems Inc" are owner-supplied and need backing (how plumbers are background-checked, and who the legal entity is). The Terms and Privacy pages still say "US Water Pros" only.
- Prices of Essential and Iron-Free live only in `lib/pricing.ts`. Unit costs and margins are deliberately not in the repo.

## Card benefit bullets: where they come from
Mechanism-level facts only. No percentages, because the numbers I found came from sellers, not independent sources.
- Carbon: reduces chlorine taste and smell (adsorption). Seller and manufacturer pages agree; no independent test data found. VERIFY the exact media and its NSF/ANSI 42 listing.
- Softener: less scale on fixtures and glass, fewer spots, and scale slows water heaters and shortens their life. Mechanism is consistent across plumbing and softener sources; the savings and lifespan percentages are unverified seller claims, so they are not used.
- Iron and manganese: reddish-brown stains on sinks, fixtures and laundry, and a bitter, metallic taste. Sources: NDSU Extension (wq1030), Virginia Tech Extension (442-656), UGA Extension (C858). The EPA limits (0.3 and 0.05 mg/L) are aesthetic, not health. Treatment depends on the form of the metal, so a water test comes first.
- RO faucet: reduces many dissolved contaminants; better-tasting drinking water. Lead and PFAS reduction claims need the NSF/ANSI 58 certificate (see REVIEW items), so they are not on the cards.
