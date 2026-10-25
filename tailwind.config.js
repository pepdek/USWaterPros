const c = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`;
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    // A short scale. Labels and body come from the CSS variables; headings step up to the big H2 and H1.
    fontSize: {
      xs: ['var(--fs-label)', '1.6'], sm: ['var(--fs-label)', '1.6'], base: ['var(--fs-body)', '1.6'], lg: ['1.25rem', '1.5'], xl: ['1.375rem', '1.4'],
      '2xl': ['1.625rem', '1.2'], '3xl': ['2rem', '1.15'], '4xl': ['var(--fs-h2)', '1.1'], '5xl': ['var(--fs-h1)', '1.05'],
    },
    extend: {
      colors: {
        blue: c('blue'), cta: c('cta'), navy: c('navy'), aqua: c('teal'), teal: c('teal'), cyan: c('cyan'), ice: c('ice'), ink: c('ink'), coral: c('err'),
        ripple: '#ffffff',
      },
      // Three voices: display (Fraunces) = serif, body (Franklin) = sans, sign (Barlow Condensed) = mono, so every existing font-mono label and price becomes highway-sign type.
      fontFamily: { serif: ['var(--display)'], sans: ['var(--sans)'], mono: ['var(--sign)'] },
    },
  },
};
