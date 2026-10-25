// Owner email. Resend when RESEND_API_KEY and ALERT_FROM_EMAIL (an address on a domain verified in Resend) are set; otherwise SendGrid as before.
// Best effort: a failed email is logged and never blocks a lead or an order.
export async function sendMail(subject: string, text: string): Promise<'resend' | 'sendgrid' | 'none'> {
  const { RESEND_API_KEY: resend, ALERT_FROM_EMAIL: from, SENDGRID_API_KEY: sg, ADMIN_NOTIFY_EMAIL: to } = process.env;
  if (!to) return 'none';
  if (resend && from) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text }),
    }).catch((e) => { console.error('resend', e); return null; });
    if (r && !r.ok) console.error('resend', r.status, (await r.text().catch(() => '')).slice(0, 200));
    return 'resend';
  }
  if (sg) {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST', headers: { Authorization: `Bearer ${sg}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalizations: [{ to: [{ email: to }] }], from: { email: to }, subject, content: [{ type: 'text/plain', value: text }] }),
    }).catch((e) => console.error('sendgrid', e));
    return 'sendgrid';
  }
  return 'none';
}

// Email to a customer (order confirmation and the rest of the series). Resend only; skipped quietly if it is not configured.
// From: ORDER_FROM_EMAIL (default orders@mail.uswaterpros.com, on the domain verified in Resend). Replies go to orders@ on the main domain.
export async function sendCustomerMail(to: string, mail: { subject: string; html: string; text: string }): Promise<boolean> {
  const { RESEND_API_KEY: key, ORDER_FROM_EMAIL: from = 'US Water Pros <orders@mail.uswaterpros.com>', ORDER_REPLY_TO: reply = 'orders@uswaterpros.com' } = process.env;
  if (!key || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: reply, ...mail }),
  }).catch((e) => { console.error('customer mail', e); return null; });
  if (r && !r.ok) console.error('customer mail', r.status, (await r.text().catch(() => '')).slice(0, 200));
  return !!r?.ok;
}
