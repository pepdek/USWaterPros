'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { PHONE, PHONE_HREF } from '@/lib/constants';
import { SERVICES } from '@/lib/services';
import { CITIES } from '@/lib/cities';

const SERVICE_LINKS = SERVICES.map((s) => [s.name, `/services/${s.slug}`]);
const AREA_LINKS = CITIES.map((c) => [`${c.name}, WA`, `/services/whole-home-water-filtration-${c.slug}`]);

// Disclosure dropdown: button + aria-expanded, Escape and click-away close it.
function Dropdown({ label, links }: { label: string; links: string[][] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div ref={ref} className="relative" onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}
        className="min-h-12 inline-flex items-center gap-1 font-semibold text-navy hover:text-aqua">{label} <span aria-hidden className="text-xs">▼</span></button>
      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[200px] w-max bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-2 z-50">
          {links.map(([t, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-navy hover:bg-ice">{t}</Link>)}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [menu]);
  const close = () => setMenu(false);

  return (
    <header className="sticky top-0 z-50 bg-ripple border-b border-black/5">
      <div className={`mx-auto max-w-6xl px-4 flex items-center justify-between gap-3 transition-all ${scrolled ? 'h-14' : 'h-16'}`}>
        <Link href="/" className="font-serif text-2xl font-bold text-navy flex items-center gap-1.5 shrink-0"><span className="text-aqua"><Icon name="drop" size={22} /></span>US Water <span className="text-aqua">Pros</span></Link>

        <nav aria-label="Main" className={`${scrolled ? 'hidden' : 'hidden md:flex'} items-center gap-6 text-sm`}>
          <Dropdown label="Services" links={SERVICE_LINKS} />
          <Dropdown label="Service Areas" links={AREA_LINKS} />
          <Link href="/#process" className="min-h-12 inline-flex items-center font-semibold text-navy hover:text-aqua">Process</Link>
        </nav>

        <div className="flex items-center gap-2">
          <a href={PHONE_HREF} className="btn btn-navy !px-3 sm:!px-6 text-sm"><span className="sm:hidden">Call</span><span className="hidden sm:inline">{PHONE}</span></a>
          <a href="#quote" className="btn btn-aqua hidden md:inline-flex text-sm">Schedule Consultation</a>
          <button type="button" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}
            className={`${scrolled ? 'inline-flex' : 'md:hidden inline-flex'} min-h-12 min-w-12 items-center justify-center text-navy`}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </div>

      {menu && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] bg-white overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <span className="font-serif text-2xl font-bold text-navy">Menu</span>
            <button type="button" aria-label="Close menu" onClick={close} className="min-h-12 min-w-12 inline-flex items-center justify-center text-navy">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </div>
          <div className="mx-auto max-w-6xl px-4 pb-10 flex flex-col gap-6">
            {([['Services', SERVICE_LINKS], ['Service Areas', AREA_LINKS]] as [string, string[][]][]).map(([h, links]) => (
              <div key={h}>
                <p className="font-serif text-xl font-bold text-navy">{h}</p>
                {links.map(([t, href]) => <Link key={href} href={href} onClick={close} className="block min-h-12 py-3 text-navy hover:text-aqua">{t}</Link>)}
              </div>
            ))}
            <Link href="/#process" onClick={close} className="font-serif text-xl font-bold text-navy min-h-12">Process</Link>
            <a href={PHONE_HREF} className="btn btn-navy">{PHONE}</a>
            <a href="#quote" onClick={close} className="btn btn-aqua">Schedule Consultation</a>
          </div>
        </div>
      )}
    </header>
  );
}
