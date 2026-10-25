import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import { PHONE, PHONE_HREF, SMS_HREF, SOCIAL } from '@/lib/constants';
import { CITIES } from '@/lib/cities';
import { LOCATIONS } from '@/lib/locations';
import { STORE } from '@/lib/store';

// ponytail: no About or Reviews links until those sections exist.
const COMPANY = [['Pricing', '/pricing'], ['Tools & Resources', '/tools'], ['Find Your System', '/quiz'], ['Process', '/#process'], ['Support', '/support'], ['FAQ', '/#faq']];
const LEGAL = [['Terms', '/terms'], ['Privacy', '/privacy']];

function Col({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h2 className="!font-mono !text-ink !text-[15px] !font-bold !leading-snug !tracking-[.16em] uppercase mb-3">{title}</h2>
      <ul className="flex flex-col">
        {links.map(([t, href]) => <li key={t}><Link href={href} className="min-h-11 inline-flex items-center text-[14px] hover:text-ink transition-colors">{t}</Link></li>)}
      </ul>
    </div>
  );
}

// Four columns on desktop, 2 x 2 on mobile, then one full-width bar for copyright and legal links.
export default function Footer() {
  return (
    <footer className="bg-[#f1ebdc] text-[#5b6472] text-sm"><div aria-hidden className="stripes" />
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10">
        <div className="lg:pr-4">
          <p className="!py-0 font-mono text-[26px] font-extrabold uppercase tracking-[.03em] text-ink"><span aria-hidden className="text-cta text-[18px] mr-1.5 align-[2px]">★</span>US Water Pros</p>
          <p className="!py-0 mt-1 font-mono text-[12px] font-semibold uppercase tracking-[.24em] !text-[#5b6472]">America's Water Professionals</p>
          <p className="mt-3 !text-[15px] leading-relaxed">Whole-home water systems, priced up front and installed by licensed local plumbers.</p>
          <div className="mt-4 border-t border-black/[.08] pt-3 text-[#5b6472]"><p className="!py-0 !text-[13px]">{STORE.local}</p><p className="!py-0 !text-[13px]">Serving Pierce, Kitsap &amp; Thurston Counties, WA</p></div>
          <a href={PHONE_HREF} className="mt-4 inline-flex min-h-12 items-center rounded-full border border-black/10 bg-white px-5 font-semibold text-ink shadow-sm hover:shadow-md transition-shadow">{PHONE}</a>
          <ul className="mt-2 flex flex-wrap gap-x-1">
            {SOCIAL.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer" aria-label={`US Water Pros on ${n} (opens in a new tab)`} className="min-h-11 inline-flex items-center pr-4 font-medium hover:text-ink transition-colors">{n}</a></li>)}
            <li><a href={SMS_HREF} className="min-h-11 inline-flex items-center font-medium text-ink">Text us</a></li>
          </ul>
        </div>
        <Col title="Services" links={SERVICES.map((s) => [s.name, `/services/${s.slug}`])} />
        <Col title="Service Areas" links={[...LOCATIONS.map((l) => [`${l.name}, ${l.state}`, `/locations/${l.slug}`]), ...CITIES.map((c) => [`${c.name}, WA`, `/services/whole-home-water-filtration-${c.slug}`])]} />
        <Col title="Company" links={COMPANY} />
      </div>
      <div className="border-t border-black/[.08]">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-[#5b6472]">
          <p className="!py-0 !text-[13px]">© {new Date().getFullYear()} US Water Pros · USWaterPros.com <span className="mx-1.5 text-cta" aria-hidden>★</span> Proudly serving Western Washington</p>
          <ul className="flex gap-5">{LEGAL.map(([t, href]) => <li key={t}><Link href={href} className="min-h-11 inline-flex items-center hover:text-ink transition-colors">{t}</Link></li>)}</ul>
        </div>
      </div>
    </footer>
  );
}
