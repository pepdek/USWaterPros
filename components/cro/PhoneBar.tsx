import { SITE } from '@/lib/site';

export default function PhoneBar() {
  return (
    <p className="mt-4 text-center">
      Prefer to talk now? <a href={SITE.phoneHref} className="font-semibold text-ink underline">Call {SITE.phoneDisplay}</a>
      {' · '}<a href={SITE.textHref} className="font-semibold text-ink underline">Text us</a>
    </p>
  );
}
