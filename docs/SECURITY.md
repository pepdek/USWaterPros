# Security notes

## Content-Security-Policy
- Set in `next.config.js` as `Content-Security-Policy-Report-Only`: browsers report violations to `/api/csp-report` (one log line each, `"evt":"csp"`; Netlify: Logs > Functions) and block nothing.
- Tested in a real browser on the home, pricing, a service page, quiz, tools, a county page, support, the 404 page and the open wizard, with Google Tag Manager and GA4 loading: no violations.
- To enforce: after about a week with no unexpected `"evt":"csp"` lines, change the header key `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `next.config.js`.
- When you add a third-party script (a chat widget, ads, a new GTM tag that loads other domains), add its domains to the policy first.
- `'unsafe-inline'` is needed for scripts because Next.js and the GTM snippet are inline. Removing it means nonces, which make every page render per request.

## Other headers
`X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy` and HSTS are set for every route.

## Spam guard
`lib/guard.ts`: per-IP rate limit (per server instance), foreign-Origin refusal, and a hidden honeypot field in every form.

## Next.js
Upgraded to 16.x (React 19) on 2026-10-23 to clear published advisories. `params` and `searchParams` are Promises in pages: `await` them.
