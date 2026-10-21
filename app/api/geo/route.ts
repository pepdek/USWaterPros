import { NextRequest, NextResponse } from 'next/server';
import { painForCity } from '@/lib/pain';

// City from the visitor's IP, read from the host's own headers. The IP is never stored and no third party is called.
export const dynamic = 'force-dynamic';

function cityFrom(req: NextRequest): { city: string; region: string } {
  const nf = req.headers.get('x-nf-geo'); // Netlify: base64 JSON
  if (nf) {
    try { const g = JSON.parse(Buffer.from(nf, 'base64').toString('utf8')); return { city: String(g.city ?? ''), region: String(g.subdivision?.code ?? '') }; } catch { /* fall through */ }
  }
  const dec = (v: string | null) => { try { return decodeURIComponent(v ?? ''); } catch { return v ?? ''; } };
  const geo = (req as unknown as { geo?: { city?: string; region?: string } }).geo;
  return { city: geo?.city ?? dec(req.headers.get('x-vercel-ip-city')) ?? dec(req.headers.get('cf-ipcity')), region: geo?.region ?? req.headers.get('x-vercel-ip-country-region') ?? '' };
}

export function GET(req: NextRequest) {
  const { city, region } = cityFrom(req);
  // Only trust the city inside Washington; anywhere else gets the default headline.
  const pain = !region || region === 'WA' ? painForCity(city) : painForCity('');
  return NextResponse.json({ pain }, { headers: { 'Cache-Control': 'private, no-store' } });
}
