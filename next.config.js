module.exports = {
  reactStrictMode: true,
  // pretty city URLs -> /cities/[city]
  async rewrites() {
    return { beforeFiles: [{ source: '/services/whole-home-water-filtration-:city', destination: '/cities/:city' }] };
  },
};
