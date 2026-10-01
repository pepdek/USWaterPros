module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      ['whole-home-filtration', 'whole-home-water-filtration'], ['water-softening', 'water-softening-systems'],
      ['well-water-testing', 'well-water-treatment'], ['reverse-osmosis', 'reverse-osmosis-systems'],
    ].map(([a, b]) => ({ source: `/services/${a}`, destination: `/services/${b}`, permanent: true }));
  },
  // pretty city URLs -> /cities/[city]
  async rewrites() {
    return { beforeFiles: [{ source: '/services/whole-home-water-filtration-:city', destination: '/cities/:city' }] };
  },
};
