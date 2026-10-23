import type { Metadata } from 'next';
import Link from 'next/link';
import SadDrop from '@/components/notfound/SadDrop';
import RotatingLine from '@/components/notfound/RotatingLine';
import ZipForm from '@/components/notfound/ZipForm';
import Track404 from '@/components/notfound/Track404';
import { SMS_HREF } from '@/lib/constants';
import { siteCopy } from '@/lib/siteCopy';

// A real 404 (Next sends status 404 for this page). Never indexed, links still followed, no canonical, not in the sitemap.
export const metadata: Metadata = { title: 'Page not found | US Water Pros', robots: { index: false, follow: true } };

export default function NotFound() {
  const c = siteCopy.notFound;
  // Do not read headers() here: this boundary is part of every page, and that would make the whole site render per request.
  return (
    <main className="nf">
      <div className="mx-auto max-w-2xl px-4 py-14 md:py-20 text-center">
        <SadDrop />
        <h1 className="mt-6 !text-[clamp(2rem,1.2rem+3.4vw,3.2rem)] [text-wrap:balance]" style={{ color: 'var(--nf-ink)' }}>{c.h1}</h1>
        <p className="mt-3 mx-auto max-w-prose" style={{ color: 'var(--nf-ink)' }}>{c.sub}</p>
        <div className="mt-5"><RotatingLine lines={c.oneLiners} /></div>
        <p className="mt-8 mb-4 mx-auto max-w-prose !py-0 text-[16px]" style={{ color: 'var(--nf-ink)' }}>{c.small}</p>
        <ZipForm label={c.zipLabel} button={c.primary} />
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          {c.links.map(([t, href]) => <li key={t}><Link href={href} className="min-h-11 inline-flex items-center font-semibold underline" style={{ color: 'var(--nf-link)' }}>{t}</Link></li>)}
          <li><a href={SMS_HREF} className="min-h-11 inline-flex items-center font-semibold underline" style={{ color: 'var(--nf-link)' }}>{c.textUs}</a></li>
        </ul>
      </div>
      <Track404 />
    </main>
  );
}
