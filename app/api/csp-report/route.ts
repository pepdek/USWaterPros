import { NextRequest, NextResponse } from 'next/server';
import { rateLimited } from '@/lib/guard';

// Receives Content-Security-Policy violation reports (the policy is report-only for now). One log line each; nothing is stored.
// Netlify: Logs > Functions, search "evt":"csp". Expect none from our own pages once the policy is right.
export async function POST(req: NextRequest) {
  if (rateLimited(req, 'csp', 120)) return new NextResponse(null, { status: 204 });
  const b = await req.json().catch(() => ({}));
  const r = (b['csp-report'] ?? b) as Record<string, unknown>;
  const s = (k: string) => String(r[k] ?? '').slice(0, 200);
  console.log(JSON.stringify({ evt: 'csp', directive: s('effective-directive') || s('violated-directive'), blocked: s('blocked-uri'), page: s('document-uri').split('?')[0], source: s('source-file') }));
  return new NextResponse(null, { status: 204 });
}
