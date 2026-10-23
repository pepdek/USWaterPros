# 404 page and redirects

## The 404 page
- `app/not-found.tsx`. Next sends a real HTTP 404 for it (tested over HTTP, including `/services/nope`, `/cities/nope`, `/locations/nope`). It is never a redirect to the homepage.
- `robots: noindex, follow`. No canonical tag. Not in `app/sitemap.ts`.
- All words are in `lib/siteCopy.ts` (`siteCopy.notFound`): headline, sub, small line, button, links, the five one-liners. One one-liner is picked at random per load; with JavaScript off you see the first.
- ZIP + **Get Instant Price** opens the wizard with the ZIP filled in. With JavaScript off the form is a plain GET to `/pricing`.
- Clicking the drop makes it drip once (CSS). Off when the visitor prefers reduced motion. Colors follow light and dark mode (`.nf` in `app/globals.css`).
- Do not read `headers()` or `cookies()` in `not-found.tsx`: it is part of every page, and doing so makes the whole site render per request (I hit this and backed it out).

### Seeing which URLs are missing
- Every 404 that runs JavaScript fires the GA4 event `page_404` (path only, no query string) and is copied to the `site_events` table, so the CRM data has it.
- It also posts to `/api/404-log`, which writes one line to the server log: `{"evt":"404","path":"/old-thing","ref":"google.com"}`. In Netlify: Logs > Functions, search `"evt":"404"`, and count by `path`.
- Limit: crawlers that do not run JavaScript are not counted here. Netlify's own logs and Google Search Console (Pages > Not found) cover those.
- TODO in GTM: add a trigger and GA4 event tag for `page_404`, same as the other events in `docs/gtm-container.json`.

## Redirects
- One file edits them: `docs/redirect-inventory.csv`. `next.config.js` reads it at build time (`lib/redirectMap.js`).
- Columns: `old_url, status_today, has_traffic_or_links, new_destination, redirect_type, reason`.
- `redirect_type`: `301` or `302` = redirect (sent as exactly 301/302). `keep` = page exists and stays. `404` = removed, no equivalent, leave it as a real 404 (documentation only). `410` is not served; use `404`.
- Query strings (utm_*) are forwarded by Next automatically.
- Trailing slash: Next sends a 308 to the slashless URL. www and http: Netlify sends a 301 to `https://uswaterpros.com`. Do not add rules for either.

### Add a redirect
1. Add a row: `/old-path,404,unknown,/new-path,301,why`.
2. `npx vitest run lib/redirects.test.ts` (fast checks), then `npm run build && npx vitest run` (checks over real HTTP).
3. The destination must be a live page, must not itself be redirected (no chains), and must not be the homepage unless the old URL really was a booking-style page. The tests enforce this.

### Tests
- `lib/redirects.test.ts`: columns and types, no duplicate sources, every sitemap URL is in the CSV, no live page is redirected, every destination is a real page, no chains or loops.
- `scripts/seo-http.test.ts` (needs a build; skipped without one): bogus URLs are real 404s with the custom page, noindex/follow, no canonical; each redirect row is one 301 hop to its destination and the destination returns 200; utm is forwarded; every `keep` row returns 200.

## Post-launch checklist (run after this deploys)
1. Re-submit `https://uswaterpros.com/sitemap.xml` in Google Search Console.
2. After 7 to 14 days, open Pages and read "Not found (404)" and "Soft 404". Fix anything with links or traffic by adding a CSV row.
3. Monthly, review the top 404 paths from the server log (and `page_404` in GA4) and add rows where a real page should answer.
