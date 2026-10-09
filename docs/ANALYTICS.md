# Analytics: GA4 + Google Tag Manager

## How it fits together

```
Site (Next.js)  --dataLayer.push({event, ...params})-->  GTM container GTM-T5KRVDNT  -->  GA4 property (G-FN39ESKXNW)
      |
      +-- key events also POST /api/site-event --> Supabase site_events --> CRM "Site activity" tab
      +-- lead forms / quiz send attribution (UTM, referrer) --> Supabase leads.lead_source + attribution --> CRM
```

- GTM is the only thing that talks to GA4. There is no separate gtag.js on the page, so nothing is counted twice.
- GTM loads in production only. On localhost the events are logged to the browser console and pushed to `window.dataLayer`, but GTM does not load. Set `NEXT_PUBLIC_ENABLE_GTM=1` to test it locally.
- IDs come from `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_GTM_ID`, defaulting to the IDs in `lib/analytics/config.ts`.
- No names, emails, phone numbers or ZIP codes are ever sent to GA4 or GTM.

## Events

Defined in `lib/analytics/config.ts`. Conversions (key events) are marked **KEY**.

| Event | Fires when | Key params |
|---|---|---|
| `quiz_start` | Visitor clicks Get Started | quiz_type |
| `quiz_question_answered` | Visitor moves past a question | question_number, question_id, answer_selected |
| `quiz_completed` **KEY** | Visitor reaches the result screen | quiz_type, urgency_flag, recommended_path, communication_pref, city, time_to_complete |
| `recommendation_viewed` | Result card shown | recommended_system, recommended_price, recommended_path |
| `quiz_addon_toggled` | Add-on checkbox ticked or cleared | addon, selected |
| `quiz_abandoned` | Page closed mid-quiz | last_question, question_number |
| `lead_form_submission` **KEY** | Any lead form or the quiz contact form is submitted | form_type, service, seconds_to_submit, quiz_completed |
| `water_report_submit` **KEY** | Water report block submitted | form_type |
| `form_start` / `form_abandon` | First field focused / page left without submitting | form_type, service |
| `phone_click` / `sms_click` | Any tel: or sms: link clicked | element_source |
| `schedule_cta_click` | Any "Schedule Consultation" (#quote) link clicked | element_source |
| `quiz_cta_click` | Any link to /quiz clicked | element_source |
| `service_page_viewed`, `city_page_viewed`, `location_page_viewed` | Page type viewed | service / city |
| `scroll_depth` | 25, 50, 75, 90 percent scrolled | percent |
| `faq_open` | FAQ item opened | question |
| `outbound_click` | Citation or other external link clicked | link_domain |
| `exit_intent_shown` | Exit-intent popup shown | element |

Every event also carries: `traffic_source` (paid / organic / direct / referral / social / email), `lead_source` (e.g. `google / cpc / campaign`), `device_type`, `city` (once known), and `page_path`.

`element_source` says where a click happened: header, footer, hero, cta_block, final_cta, corner_banner, exit_intent_modal, inline_quiz_cta, or page.

## Lead source data

On the first page view the site records first-touch (kept 90 days) and last-touch (this session) attribution from UTM parameters, ad click IDs and the referrer. Every lead, quiz event and tracked click is saved with it. In the CRM:

- `leads.lead_source` is filled automatically, e.g. `google / cpc / whole_home`. It credits the last campaign visit, otherwise the first touch.
- `leads.attribution` keeps the full first and last touch.
- The Quiz tab breaks quiz takers down by traffic source and campaign.
- The Site activity tab shows calls, texts and CTA clicks by source, device and page.

**UTM links.** Tag every ad and campaign link: `?utm_source=google&utm_medium=cpc&utm_campaign=whole_home`. Google Ads clicks are also detected by `gclid`.

## GTM container (already published)

Imported from `docs/gtm-container.json` as Version 2, "Analytics v1: GA4 + site events":

- Tag **GA4 - Google tag (G-FN39ESKXNW)**, fires on All Pages (sends page views, including single-page navigation).
- Tag **GA4 - Event - all US Water Pros events**, fires on trigger **CE - US Water Pros events** (a custom-event regex of the names above) and forwards the event name and 27 data layer parameters.
- 27 data layer variables named `DLV - <param>`.

**Adding a new event:** add the name to `EVENTS` in `lib/analytics/config.ts`, add it to the regex in the trigger, and re-import or edit the container. Add any new parameter as a `DLV - ...` variable and as a row in the event tag's parameter table.

## GA4 property setup (done)

Property: US Water Pros, stream `US Water Pros Site`, `G-FN39ESKXNW`. Enhanced measurement is on.

Custom dimensions (event scope): traffic_source, lead_source, device_type, city, quiz_type, urgency_flag, recommended_path, communication_pref, form_type, element_source, question_id, answer_selected, service.
Custom metrics (event scope): time_to_complete (seconds), recommended_price (currency).

Key events to mark (an event must arrive once before GA4 lets you star it; see Events > Recent events): `quiz_completed`, `lead_form_submission`, `water_report_submit`. Optional: `phone_click`, `sms_click`, `schedule_cta_click`.

Audiences to create (Admin > Audiences):

| Audience | Rule |
|---|---|
| high_intent_leads | quiz_completed AND urgency_flag = asap |
| from_paid_traffic | traffic_source = paid |
| organic_discovery | traffic_source = organic |
| abandoned_quiz | quiz_start AND NOT quiz_completed, 24 hours |

## Reports to build in GA4 (Explore)

1. Quiz funnel: quiz_start, quiz_question_answered (breakdown by question_id), quiz_completed, lead_form_submission.
2. Completion rate by device_type and by traffic_source.
3. Leads by lead_source and form_type.
4. Calls and texts: phone_click and sms_click by element_source and page_path.
5. Urgency mix: quiz_completed by urgency_flag, with time_to_complete.
6. Service and city page engagement: service_page_viewed, city_page_viewed, scroll_depth.

## Recommended additions (not built)

- **Call tracking** (CallRail or similar): site events only count clicks, not answered calls. A tracking number swapped in by source also gives you call recordings and call-to-lead matching.
- **Google Ads and Search Console links** (GA4 Admin > Product links) for cost data and organic queries.
- **Consent banner** if you advertise to people outside Washington, or if you add remarketing tags.
- **Server-side tagging or Enhanced Conversions** once ad spend justifies it.
- **Alerts** (GA4 Insights > custom insights): daily key events falling, or no `lead_form_submission` in 48 hours.

## Testing checklist

- [ ] GTM Preview (Tag Assistant) on https://uswaterpros.com shows the Google tag on Page View and the event tag on each custom event.
- [ ] GA4 Admin > DebugView shows events with their parameters.
- [ ] Take the quiz: quiz_start, 8 x quiz_question_answered, quiz_completed, recommendation_viewed, then lead_form_submission.
- [ ] Click a phone link, a text link and Schedule Consultation: phone_click, sms_click, schedule_cta_click.
- [ ] Open `/?utm_source=google&utm_medium=cpc&utm_campaign=test`, submit a lead: the CRM lead shows lead_source `google / cpc / test`.
- [ ] CRM Site activity tab shows the clicks. Delete test leads afterwards.
