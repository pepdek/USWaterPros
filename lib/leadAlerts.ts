import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

type Lead = { name: string; phone: string | null; zip_code: string | null; page_source: string | null; service_type: string; notes?: string | null };

let warned = false;
const once = (msg: string) => { if (!warned) { warned = true; console.warn(msg); } };

// Extra lead alerts. Every step is best effort: a failure here never blocks the lead (it is already in Supabase).
export async function notifyExtras(lead: Lead, form: { variant: string; builtYear: string; bestTime: string }) {
  const { FORM_ENDPOINT, TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_FROM: from, OWNER_MOBILE: to } = process.env;

  // Formspree: its notification email (set to LEAD_ALERT_EMAIL in the Formspree dashboard) is the phone alert via Gmail push.
  if (FORM_ENDPOINT) {
    await fetch(FORM_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: lead.name, mobile: lead.phone, zip: lead.zip_code, home_built: form.builtYear, best_time: form.bestTime, source: `${lead.page_source} (${form.variant})` }),
    }).catch((e) => console.error('formspree', e));
  }

  // Optional SMS to the owner via Twilio. Skipped silently when not fully configured.
  if (sid && token && from && to) {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: from, To: to, Body: `New lead: ${lead.name}, ${lead.phone}, ZIP ${lead.zip_code}. Built: ${form.builtYear}. Best time: ${form.bestTime}.` }),
    }).catch((e) => console.error('twilio', e));
  } else once('Twilio SMS alert skipped: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM and OWNER_MOBILE are not all set.');

  // Local development only: keep a CSV of test submissions. Never written in production.
  if (process.env.NODE_ENV === 'development') {
    const file = path.join(process.cwd(), 'data', 'leads.csv');
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, [new Date().toISOString(), lead.name, lead.phone, lead.zip_code, form.builtYear, form.bestTime, lead.page_source, form.variant].map(q).join(',') + '\n').catch(() => {});
  }
}
