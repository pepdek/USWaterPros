# Positioning cleanup (branch positioning-cleanup-oct-2026)

Owner decisions applied:
1. Old direct-response branch dropped. Recoverable from the tag `archive/cro-pass-oct-2026`.
2. REVERSED on Oct 22: the headline is "{pain} gone. Done in a day." Target: clean water within 24 hours of purchase; the install itself is typically 3.5-4 hours. The wizard books installs at least 6 days out (MIN_DAYS_OUT in lib/order.ts), so the 24-hour target is about the install itself, not purchase-to-install.
3. After payment: text confirmation by the end of the next business day (Pacific, Mon-Fri, holidays not modelled). An email/text alert goes to the owner when an order is paid, again 6 hours before the deadline if still unconfirmed, and once more when overdue. Hourly job: `netlify/functions/unconfirmed-orders.mts`. In the CRM, "Mark confirmed" on the lead stops the alerts.
4. Softener stays in the includes list; no hard-water benefit copy in cards, the hero or Tacoma pages. A soft-water package comes later.
5. City data kept with source and year; Fife added (98424); Tacoma never gets a hardness number (its report does not list one).
6. "Better Business Bureau" and "Certified Contractors" removed.
7. Fear sections deleted (contamination, infrastructure, "toxic cocktail", The Risks); calm "You shouldn't need a salesperson" section added.
8. "Since 2009" removed everywhere; "Locally owned in Tacoma" used instead.
9. "Dry skin" quiz option removed (existing rows in Supabase may still contain it).

Also: unsupported claims removed (top-rated pill, emergency repair pill, 85% hard-water stat, resale-value FAQ, "Join the families", "licensed technicians", "100% satisfaction guarantee"); utm_content now captured with the other UTM fields; `lib/content.test.ts` fails if any of these phrases return.

Needs the owner: direct link to Fife's 2025 report PDF; alert settings (SENDGRID_API_KEY + ADMIN_NOTIFY_EMAIL, optional TWILIO_* and OWNER_MOBILE); SUPABASE_SERVICE_ROLE_KEY for the hourly job.
