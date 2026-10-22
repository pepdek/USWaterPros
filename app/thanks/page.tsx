import type { Metadata } from 'next';
import { PHONE, PHONE_HREF, SMS_HREF } from '@/lib/constants';

export const metadata: Metadata = { title: 'Thanks | US Water Pros', robots: { index: false, follow: false } };

export default function Thanks({ searchParams }: { searchParams: { paid?: string } }) {
  const paid = searchParams.paid === '1';
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1>{paid ? 'Payment received. Thank you.' : 'Thank you.'}</h1>
      <p className="mt-4">{paid ? 'We’ll text you to confirm your install time by the end of the next business day. A licensed local plumber will install it, and it’s tested before they leave.' : 'We’ll be in touch by text.'}</p>
      <p className="mt-2">Questions? <a href={SMS_HREF} className="font-semibold text-ink underline">Text us</a> or <a href={PHONE_HREF} className="font-semibold text-ink underline">call {PHONE}</a>.</p>
    </main>
  );
}
