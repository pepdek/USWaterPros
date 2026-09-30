// ponytail: fire-and-forget to PostHog if present, else dev console. Swap for any tool.
export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const ph = (window as any).posthog;
  if (ph) ph.capture(event, props);
  else if (process.env.NODE_ENV !== 'production') console.log('[track]', event, props);
}

export const CTA_VARIANTS = ['Get My Free Consultation', 'Get Your Quote', "I'm Ready to Fix My Water"];

export function ctaVariant(): string {
  try {
    let v = localStorage.getItem('cta');
    if (!v || !CTA_VARIANTS.includes(v)) {
      v = CTA_VARIANTS[Math.floor(Math.random() * CTA_VARIANTS.length)];
      localStorage.setItem('cta', v);
    }
    return v;
  } catch { return CTA_VARIANTS[0]; }
}
