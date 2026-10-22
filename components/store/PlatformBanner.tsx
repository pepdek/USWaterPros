import { STORE } from '@/lib/store';

// Full-width trust band under the hero. White on deep teal (about 9:1).
export default function PlatformBanner() {
  return (
    <section aria-label="About the platform" className="bg-navy">
      <p className="mx-auto max-w-6xl px-4 py-6 md:py-7 text-center !text-white md:text-lg">
        Powered by <strong>{STORE.platform}</strong>, the on-demand water solutions platform connecting customers with background-checked local plumbers across 50 states.
      </p>
    </section>
  );
}
