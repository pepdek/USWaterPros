import { NextRequest, NextResponse } from 'next/server';
import { badOrigin, rateLimited } from '@/lib/guard';

// One line per missing page in the server log (Netlify: Logs > Functions). Weekly top list: filter the log for "evt":"404" and count by path.
// Stores nothing and keeps no visitor data: the path only (no query string, no hash), plus the referring site's host.
export async function POST(req: NextRequest) {
  if (badOrigin(req) || rateLimited(req, '404-log', 60)) return NextResponse.json({ ok: false }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const path = String(b.path ?? '').split('?')[0].split('#')[0].slice(0, 200);
  if (!path.startsWith('/')) return NextResponse.json({ ok: false }, { status: 400 });
  let ref = '';
  try { ref = new URL(req.headers.get('referer') ?? '').hostname; } catch { /* none */ }
  console.log(JSON.stringify({ evt: '404', path, ref }));
  return NextResponse.json({ ok: true });
}
