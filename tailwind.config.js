const c = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`;
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    // Only three type sizes (H1, H2, body) plus one label size. Every Tailwind size maps onto them.
    fontSize: {
      xs: ['var(--fs-label)', '1.6'], sm: ['var(--fs-label)', '1.6'], base: ['var(--fs-body)', '1.7'], lg: ['var(--fs-body)', '1.7'], xl: ['var(--fs-body)', '1.6'],
      '2xl': ['var(--fs-h2)', '1.25'], '3xl': ['var(--fs-h2)', '1.25'], '4xl': ['var(--fs-h2)', '1.2'], '5xl': ['var(--fs-h1)', '1.15'],
    },
    extend: {
      colors: {
        blue: c('blue'), cta: c('cta'), navy: c('navy'), aqua: c('teal'), teal: c('teal'), cyan: c('cyan'), ice: c('ice'), ink: c('ink'), coral: c('err'),
        ripple: '#ffffff',
      },
      fontFamily: { serif: ['var(--font-serif)', 'Georgia', 'serif'], sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] },
    },
  },
};
