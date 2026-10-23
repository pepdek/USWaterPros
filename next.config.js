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
  async redirects() {
    return [
      ['whole-home-filtration', 'whole-home-water-filtration'], ['water-softening', 'water-softening-systems'],
      ['well-water-testing', 'well-water-treatment'], ['reverse-osmosis', 'reverse-osmosis-systems'],
    ].map(([a, b]) => ({ source: `/services/${a}`, destination: `/services/${b}`, permanent: true }));
  },
  // pretty city URLs -> /cities/[city]
  async rewrites() {
    return { beforeFiles: [
      { source: '/services/whole-home-water-filtration-:city', destination: '/cities/:city' }] };
  },
};
