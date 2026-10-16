import type { Metadata } from 'next';
import ThanksEvent from '@/components/cro/ThanksEvent';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Thanks | US Water Pros',
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <ThanksEvent />
      <h1>Got it.</h1>
      <p className="mt-4">We&apos;ll call you within {SITE.callbackWindow} during business hours. If you miss us, text {SITE.phoneDisplay}.</p>
      <p className="mt-2"><a href={SITE.phoneHref} className="font-semibold text-ink underline">Call {SITE.phoneDisplay}</a></p>
    </main>
  );
}
