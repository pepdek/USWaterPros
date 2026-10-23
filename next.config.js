const { loadRows, toNextRedirects } = require('./lib/redirectMap');

// Content-Security-Policy, in REPORT-ONLY mode: browsers log violations to /api/csp-report but block nothing. After a week of clean logs, rename
// the header key below to 'Content-Security-Policy' to enforce it. 'unsafe-inline' is needed because Next.js and the GTM snippet use inline scripts
// (a nonce-based policy would make every page render per request).
const GOOGLE = 'https://www.googletagmanager.com https://www.google.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net';
const POSTHOG = 'https://us.i.posthog.com https://us-assets.i.posthog.com';
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ${POSTHOG}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${GOOGLE}`,
  `connect-src 'self' ${GOOGLE} ${POSTHOG}`,
  "font-src 'self' data:",
  'frame-src https://www.googletagmanager.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'self'",
  'report-uri /api/csp-report',
].join('; ');

// Baseline security headers.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'Content-Security-Policy-Report-Only', value: csp },
];

module.exports = {
  reactStrictMode: true,
  async headers() { return [{ source: '/:path*', headers: securityHeaders }]; },
  // Redirects come from docs/redirect-inventory.csv (add a row, no code change). Next forwards the query string, so utm parameters survive.
  // Trailing slashes are handled once by Next (308 to the slashless URL); www and http are handled once by Netlify.
  async redirects() { return toNextRedirects(loadRows()); },
  // pretty city URLs -> /cities/[city]
  async rewrites() {
    return { beforeFiles: [
      { source: '/services/whole-home-water-filtration-:city', destination: '/cities/:city' }] };
  },
};
