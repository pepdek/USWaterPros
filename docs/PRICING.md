# Pricing

Last changed: 2026-10-09. Reason: the flagship moved to $2,999 tax-inclusive to clear the margin floor after tax.

## Current prices (all installed, tax included)

| Item | Price | Notes |
|---|---|---|
| Whole-Home Water System (flagship) | $2,999 | Water softening (resin + brine), carbon filtration, reverse osmosis drinking water faucet, licensed installation |
| Add-on: Reverse Osmosis Drinking Water | $699 | Installed on the same visit as the flagship |
| Add-on: Carbon Filtration | $949 | Installed on the same visit as the flagship |
| Basic Well Water Test (nitrate + coliform) | $149 | Credited toward install if the customer purchases |
| Full Well Water Panel (metals, minerals, nitrate) | $349 | Credited toward install if the customer purchases |

Well water and city water pages show no fixed install price. Softener, RO and carbon pages describe the service and link to the flagship; RO and carbon show their add-on price.

## Where prices live

`lib/pricing.ts` is the only place a price is written. Everything else reads from it:

- site copy, service pages, FAQs (home and city pages), the FAQPage and Service/Offer structured data
- the quiz result card and the lead notes saved to the CRM
- the `Service` pages' title and description

Quiz routing is a pure function in `lib/quizRouting.ts` (`routeQuiz(answers)`).

## How to change a price

Edit `lib/pricing.ts` only. Do not type a dollar amount anywhere else.

## Price-change checklist

1. Update `PRICING` in `lib/pricing.ts` (and `PRICING.headline`, which is a literal string).
2. Update the expected values in `lib/pricing.test.ts` and `lib/quizRouting.test.ts`.
3. Run `npm run verify` (price check, tests, production build, built-output tests).
4. Re-check the structured data: open the flagship page source and confirm the `Offer` prices and the FAQPage text match the visible copy.
5. If a retired price should never return, add it to the banned lists in `scripts/check-prices.sh` and `scripts/built-output.test.ts`.
6. Update this file (table and date).

## Checks

- `scripts/check-prices.sh`: fails on any retired price or any dollar amount outside `lib/pricing.ts`.
- `scripts/built-output.test.ts`: after `next build`, fails if retired prices appear in the built HTML or JSON-LD, and confirms the flagship page shows $2,999, the tax note and `"price":2999`.
