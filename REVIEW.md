# Conversion pass review (branch `cro-pass-oct-2026`)

Nothing here is pushed to `main`. Everything below needs an owner answer before it goes live.

## 1. Claims still to verify (each is a `VERIFY:` marker in the source)

| File | Needs |
|---|---|
| `components/cro/Sections.tsx` | **VERIFY: NSF/ANSI 53 lead-reduction certification and NSF listing number for the specified carbon media.** No lead-reduction claim is published for the whole-home tank until confirmed. The RO faucet lead claim needs an NSF/ANSI 58 certificate listing lead. |
| `components/cro/Sections.tsx` | **VERIFY: typical days from quote to install.** Step 2 of "How it works" currently says only "We confirm the install date with you." |
| `components/cro/Sections.tsx` | **VERIFY: source for local market price ranges.** The "premium $7,500–8,000 / budget around $900" sentence has no cited source. |
| `components/cro/WholeHomePage.tsx` | **VERIFY: Support and Typical lifespan rows of the comparison table.** |
| `components/service/index.tsx` | **VERIFY: Support row of the comparison table** ("Included" / "Fee-based" / "Little or none"). |
| `components/service/index.tsx` | **VERIFY: Typical lifespan row of the comparison table** (8–10 / 10+ / 2–3 years). |
| `components/cro/TacomaPage.tsx` | **VERIFY: insert Tacoma Water report figures** (report year, chlorine residual, hardness, detected contaminants), or confirm that linking to the ZIP report tool is enough. The page shows no numbers inline today. |
| `lib/croFaq.ts` | **VERIFY: filter replacement cost and interval** ("about $150–300 a year", annual). |
| `lib/croFaq.ts` | **VERIFY: pressure impact and sizing.** The answer is deliberately non-committal. |
| `lib/croFaq.ts` | **VERIFY: fluoride reduction rating of the installed RO membrane.** |
| `lib/croFaq.ts` | **VERIFY: PFAS performance of installed media.** |

## 2. Decisions I made that you should confirm

- **Leads still go to Supabase and the CRM.** The spec called for posting to Formspree and redirecting. I kept `/api/leads` as the primary path (so leads, attribution, the quiz and the CRM keep working) and added Formspree and Twilio as best-effort extras. If `FORM_ENDPOINT` is empty, nothing is lost.
- **Email is now optional on the consultation form.** The new form asks for name, mobile, ZIP, build year and best time only. Quiz, diagnostic and report forms still require an email.
- **Header button text** reads "Get My Fixed Price" on the three conversion pages only. Other pages keep "Schedule Consultation".
- **Conversion event.** The existing `lead_form_submission` event fires once, on `/thanks`, after a real submit (so the redirect cannot drop it). Old-style forms on other pages still fire it on submit.
- **"Licensed technician(s)" and "within 1 hour" were replaced site-wide** with "licensed plumber(s)" and "within 10 minutes" (confirmed facts).
- **Add-on pricing is gone from the three pages and from `/llms.txt`.** It still appears elsewhere: the quiz result screen, `/services/reverse-osmosis-systems`, `/services/carbon-filtration`, and the related-services pills. Decide whether those pages are retired, rewritten, or redirected to the whole-home page.
- **Old homepage sections are no longer rendered** (service cards, "Risks", problem photos, quiz banner, process image, ZIP banner, report email form). The components are still in the repo.
- **Real install photos and the Tacoma Water measured data** are not on the new pages. The Tacoma page links to the ZIP report tool instead.
- **Reviews:** `data/reviews.json` ships as `[]`. `ProofSlot` renders nothing until it has entries, and no `aggregateRating` is emitted.

## 3. Formspree setup (lead alert to your phone)

1. Create a form at formspree.io. Copy its endpoint (looks like `https://formspree.io/f/XXXX`).
2. In Formspree, set the notification email to the inbox in `LEAD_ALERT_EMAIL`.
3. In Netlify, add `FORM_ENDPOINT` (the endpoint) and `LEAD_ALERT_EMAIL` (for your own reference) as environment variables.
4. On your phone, open the Gmail app, then Settings → your account → Notifications → "All" and turn on push notifications for that sender. Mark Formspree "Important" or add a filter so alerts are never buried.
5. Submit the form once from the live site and confirm the notification arrives.

## 4. Optional Twilio SMS alert

Add these to Netlify (all four, or none): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` (your Twilio number), `OWNER_MOBILE` (where alerts go). If any are missing the SMS is skipped silently and one warning is logged. SMS never blocks a lead.

## 5. Question for the equipment supplier

Which carbon media is in the whole-home tank, and does it carry NSF/ANSI 53 certification for lead reduction? Please send the NSF listing number. Same question for the RO membrane and faucet: NSF/ANSI 58 certificate, and what it lists (lead, fluoride, PFAS).

## 6. Local-only behavior

In `next dev`, every conversion-form submission is also appended to `data/leads.csv`. That file is git-ignored and is never written in production.
