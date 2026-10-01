// ponytail: fire-and-forget to PostHog if present, else dev console. Swap for any tool.
export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const ph = (window as any).posthog;
  if (ph) ph.capture(event, props);
  else if (process.env.NODE_ENV !== 'production') console.log('[track]', event, props);
}

export const CTA = 'Get A Free Consultation';
