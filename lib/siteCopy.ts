import { PHONE } from './constants';

// Words you may want to edit without touching code. (There was no siteCopy file yet; this is it. Store copy that other pages repeat lives in lib/store.ts.)
export const siteCopy = {
  notFound: {
    h1: '404: This page went down the drain.',
    sub: 'We looked everywhere. Under the sink, behind the water heater, even in the crawlspace. Nothing.',
    small: 'Good news: your water is easier to find than this page. Enter your ZIP and we’ll show you your fixed price.',
    zipLabel: 'Your ZIP code',
    primary: 'Get Instant Price',
    links: [['See how it works', '/#process'], ['Our systems', '/pricing']] as [string, string][],
    textUs: `Text us: ${PHONE}`,
    // One of these shows at random on each load. The first is what you see with JavaScript off.
    oneLiners: [
      'This page is like a Brita pitcher: it was supposed to be here, and now there’s a hole.',
      'We’ve had a few leaks in our time. A missing page is the least messy.',
      'Error 404: Page not found. Error 200: Water found. Come back to that one.',
      'Our plumbers are licensed. This URL is not.',
      'You’ve reached the end of the pipe. Let’s get you back to the faucet.',
    ],
  },
};
