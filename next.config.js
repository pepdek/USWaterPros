const { loadRows, toNextRedirects } = require('./lib/redirectMap');

// Baseline security headers. No Content-Security-Policy yet: Google Tag Manager needs one written and tested in report-only mode first.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
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
