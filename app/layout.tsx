import type { Metadata } from 'next';
import Script from 'next/script';
import { Barlow_Condensed, Fraunces, Libre_Franklin } from 'next/font/google';
import './globals.css';
import AnalyticsEvents from '@/components/AnalyticsEvents';
import { GA4_CONFIG } from '@/lib/analytics/config';
import Wizard from '@/components/store/Wizard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollFx from '@/components/ScrollFx';

// Americana pairing: a warm, slightly wonky serif for headlines, Franklin Gothic (the classic American text face) for everything you read,
// and condensed highway-sign caps for labels, numbers and the wordmark.
const display = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'WONK', 'opsz'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const sans = Libre_Franklin({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });
const sign = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-sign', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://uswaterpros.com'),
  title: 'US Water Pros | Water Filtration & Treatment Experts in Tacoma, WA',
  description: 'See your instant price for a whole-home water system installed by a licensed local plumber. Pierce County, WA.',
  openGraph: { siteName: 'US Water Pros', type: 'website' },
};

const PH = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// GTM loads in production only (so local dev never pollutes GA4). Set NEXT_PUBLIC_ENABLE_GTM=1 to test it locally.
const GTM = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_GTM === '1' ? GA4_CONFIG.gtmContainerId : '';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${sign.variable}`}>
      <body className="font-sans">
        {GTM && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>}
        {GTM && <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}</Script>}
        <AnalyticsEvents />
        <ScrollFx />
        <Header />
        {children}
        <Footer />
        <Wizard />
        {PH && (
          <Script id="ph" strategy="afterInteractive">{`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${PH}',{api_host:'https://us.i.posthog.com'})`}</Script>
        )}
      </body>
    </html>
  );
}
