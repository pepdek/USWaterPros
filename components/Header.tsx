import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import Icon from './Icon';
import { PHONE, PHONE_HREF, SMS_HREF } from '@/lib/constants';

export default function Header() {
  return (
    <header className="bg-ripple border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-navy flex items-center gap-1.5"><span className="text-aqua"><Icon name="drop" size={22} /></span>US Water <span className="text-aqua">Pros</span></Link>
        <nav className="hidden md:flex items-center gap-6 font-semibold text-navy" aria-label="Main">
          <div className="relative group">
            <Link href="/#services" className="min-h-12 inline-flex items-center gap-1">Services <span aria-hidden>▾</span></Link>
            <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,.1)] p-2 w-64 z-50">
              {SERVICES.map((s) => <Link key={s.slug} href={`/services/${s.slug}`} className="block rounded px-3 py-3 hover:bg-ice">{s.name}</Link>)}
            </div>
          </div>
          <Link href="/#process" className="min-h-12 inline-flex items-center">Process</Link>
        </nav>
        <div className="flex items-center gap-2">
                    <a href={PHONE_HREF} className="btn btn-navy">{PHONE}</a>
          <a href={SMS_HREF} className="btn btn-aqua hidden sm:inline-flex">Text</a>
        </div>
      </div>
    </header>
  );
}
