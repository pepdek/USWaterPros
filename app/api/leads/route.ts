import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SERVICES } from '@/lib/services';

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const s = (k: string, n: number) => String(b[k] ?? '').trim().slice(0, n);
  const lead = {
    name: s('name', 255) || 'Water report request', email: s('email', 255), phone: s('phone', 20) || null,
    zip_code: s('zip_code', 10), service_type: s('service_type', 255), page_source: s('page_source', 255),
    ip_address: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || null,
    user_agent: req.headers.get('user-agent'),
  };
  if (lead.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) || !/^\d{5}$/.test(lead.zip_code)
    || !(lead.service_type === 'water-report' || SERVICES.some((x) => x.slug === lead.service_type))) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  // RLS lets the public site insert new leads only; everything else needs an admin login.
  const { error } = await supabase().from('leads').insert(lead);
  if (error) { console.error(error); return NextResponse.json({ error: 'db' }, { status: 500 }); }

  // ponytail: SendGrid via fetch, skipped silently if unconfigured. Failure never blocks the lead.
  const { SENDGRID_API_KEY: key, ADMIN_NOTIFY_EMAIL: to } = process.env;
  if (key && to) {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }], from: { email: to },
        subject: `New lead: ${lead.service_type} (${lead.zip_code})`,
        content: [{ type: 'text/plain', value: `${lead.name}\n${lead.email}\n${lead.phone ?? ''}\n${lead.zip_code}` }],
      }),
    }).catch(console.error);
  }
  return NextResponse.json({ ok: true });
}
