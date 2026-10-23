import { NextRequest } from 'next/server';

// Cheap spam protection for the public write endpoints.
// ponytail: the counters live in memory, so each serverless instance counts separately. That stops a script hammering one endpoint,
// not a distributed flood. Upgrade path: Netlify rate limiting on the site, or a shared store (Upstash/Supabase) if abuse shows up.
const hits = new Map<string, number[]>();

export const clientIp = (req: NextRequest) => req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

// True when this IP has made more than `max` calls to `bucket` in the last `windowMs`.
export function rateLimited(req: NextRequest, bucket: string, max: number, windowMs = 10 * 60_000, now = Date.now()) {
  const key = `${bucket}:${clientIp(req)}`;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now); hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > windowMs) hits.delete(k);
  return recent.length > max;
}

// Browsers always send Origin on cross-site POSTs. If it is present and is not our own site, refuse. (Scripts can fake it; this only stops other websites from posting through a visitor's browser.)
export function badOrigin(req: NextRequest) {
  const o = req.headers.get('origin');
  if (!o) return false;
  try { const h = new URL(o).hostname; return !(h === 'uswaterpros.com' || h === 'www.uswaterpros.com' || h === 'localhost' || h === req.nextUrl.hostname); } catch { return true; }
}
