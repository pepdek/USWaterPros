import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import { PHONE, PHONE_HREF, SMS_HREF } from '@/lib/constants';
import { LOCATIONS } from '@/lib/locations';

// ponytail: no About or Reviews links until those sections exist.
const QUICK = [['Services', '/#services'], ['Service Areas', '/#areas'], ['Process', '/#process'], ['FAQ', '/#faq']];

function Col({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="!text-white text-xl mb-3 lowercase">{title}</h3>
      <ul className="flex flex-col">
        {links.map(([t, href]) => <li key={t}><Link href={href} className="min-h-12 inline-flex items-center hover:text-aqua">{t}</Link></li>)}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80 text-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        <Col title="Quick Links" links={QUICK} />
        <Col title="Services" links={SERVICES.map((s) => [s.name, `/services/${s.slug}`])} />
        <Col title="Service Areas" links={LOCATIONS.map((l) => [`${l.name}, ${l.state}`, `/locations/${l.slug}`])} />
      </div>
      <p className="text-center pb-6">Call or text us directly: <a href={PHONE_HREF} className="font-semibold text-aqua">{PHONE}</a> · <a href={SMS_HREF} className="font-semibold text-aqua">Text us</a></p>
      <p className="text-center text-white/60 border-t border-white/10 p-6">© {new Date().getFullYear()} US Water Pros · USWaterPros.com</p>
    </footer>
  );
}
