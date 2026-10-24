import { PHONE } from '../constants';
import { formatUSD } from '../pricing';
import { STORE } from '../store';

// Email 1 of the customer series: sent the moment a payment clears. Warm, short, one job: say what happens next and what to do before install day.
// Table layout with inline styles (email clients ignore most CSS). Light background only, so dark-mode clients do not invert it badly.
// VERIFY before sending to customers: the prep list, "about 4 hours", and the support address.
export type OrderConfirmedInput = { name: string; systemName: string; installDate: string; window: string; address: string; chargedCents: number; confirmBy: Date; supportEmail: string };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const TZ = 'America/Los_Angeles';
const dayLong = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
const deadlineDay = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: TZ });
export const firstName = (n: string) => { const f = n.trim().split(/\s+/)[0]; return f ? f.replace(/^./, (c) => c.toUpperCase()) : 'there'; };

const C = { ink: '#0b2530', teal: '#007c94', ice: '#eaf7fa', line: '#dbe6ea', muted: '#4b5a60', orange: '#ff6b35', bg: '#f4f7f6' };

export function orderConfirmed(i: OrderConfirmedInput) {
  const hi = esc(firstName(i.name)), day = dayLong(i.installDate), by = deadlineDay(i.confirmBy);
  const paid = formatUSD(i.chargedCents / 100);
  const pre = `Your install is booked for ${day}. Here's what happens next.`;
  const step = (n: string, h: string, b: string) => `<tr><td valign="top" style="padding:0 14px 18px 0;width:34px"><div style="width:30px;height:30px;border-radius:15px;background:${C.teal};color:#fff;font:700 15px/30px Arial,sans-serif;text-align:center">${n}</div></td><td valign="top" style="padding:0 0 18px 0;font:16px/1.5 Arial,sans-serif;color:${C.ink}"><b>${h}</b><br><span style="color:${C.muted}">${b}</span></td></tr>`;
  const row = (k: string, v: string) => `<tr><td style="padding:7px 0;font:14px Arial,sans-serif;color:${C.muted};width:38%" valign="top">${k}</td><td style="padding:7px 0;font:15px/1.4 Arial,sans-serif;color:${C.ink}" valign="top"><b>${v}</b></td></tr>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>You're in. Here's what happens next.</title></head>
<body style="margin:0;padding:0;background:${C.bg}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg}">${esc(pre)}&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid ${C.line}">
<tr><td style="background:${C.ink};padding:20px 28px;font:700 20px Georgia,serif;color:#fff">US Water <span style="color:#7fe0f2">Pros</span></td></tr>
<tr><td style="padding:32px 28px 8px">
<p style="margin:0 0 6px;font:700 12px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${C.teal}">Order confirmed</p>
<h1 style="margin:0 0 14px;font:400 34px/1.15 Georgia,serif;color:${C.ink}">Clean water is on the way, ${hi}.</h1>
<p style="margin:0 0 22px;font:17px/1.55 Arial,sans-serif;color:${C.ink}">You're all set. Nothing else to do today. Here's exactly what happens next, so there are no surprises.</p>
</td></tr>
<tr><td style="padding:0 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ice};border-radius:12px"><tr><td style="padding:18px 20px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('System', esc(i.systemName))}${row('Install day', `${esc(day)} (${esc(i.window.toLowerCase())})`)}${row('Where', esc(i.address))}${row('You paid', paid + ' installed, tax included')}</table>
</td></tr></table>
<p style="margin:10px 0 0;font:13px/1.5 Arial,sans-serif;color:${C.muted}">Stripe emails your receipt separately.</p></td></tr>
<tr><td style="padding:26px 28px 0"><h2 style="margin:0 0 16px;font:400 24px Georgia,serif;color:${C.ink}">What happens next</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${step('1', 'Today: you\'re booked', 'Your day is held and your payment is in.')}
${step('2', `By end of day ${esc(by)}: we text you`, 'We confirm your arrival time by text. Just reply if the time doesn\'t work.')}
${step('3', `${esc(day)}: install day`, 'A licensed local plumber installs it in about 4 hours, tests it before they leave, and walks you through how it works.')}
</table></td></tr>
<tr><td style="padding:6px 28px 0"><h2 style="margin:0 0 12px;font:400 24px Georgia,serif;color:${C.ink}">Before install day</h2>
<p style="margin:0;font:16px/1.6 Arial,sans-serif;color:${C.ink}">&bull; Clear a little space around where your main water line comes into the house.<br>&bull; Have someone 18 or older home.<br>&bull; Expect the water to be off for part of the visit.</p></td></tr>
<tr><td align="center" style="padding:30px 28px 8px"><a href="sms:+12537770901" style="display:inline-block;background:${C.orange};color:${C.ink};font:700 17px Arial,sans-serif;text-decoration:none;padding:14px 28px;border-radius:10px;border:2px solid ${C.ink}">Questions? Text us</a>
<p style="margin:14px 0 0;font:14px/1.5 Arial,sans-serif;color:${C.muted}">Or just reply to this email. A real person reads it.</p></td></tr>
<tr><td style="padding:22px 28px 30px"><p style="margin:0;font:14px/1.6 Arial,sans-serif;color:${C.muted}">${esc(STORE.refund)} Need to change your day or cancel? Reply here or text ${esc(PHONE)} and we'll sort it out.</p></td></tr>
<tr><td style="background:${C.bg};padding:18px 28px;border-top:1px solid ${C.line};font:12px/1.6 Arial,sans-serif;color:${C.muted}">US Water Pros &middot; ${esc(STORE.local)} &middot; ${esc(PHONE)} &middot; <a href="mailto:${esc(i.supportEmail)}" style="color:${C.teal}">${esc(i.supportEmail)}</a><br>You're getting this because you placed an order at uswaterpros.com.</td></tr>
</table></td></tr></table></body></html>`;
  const text = [
    `Clean water is on the way, ${firstName(i.name)}.`, '',
    `You're all set. Nothing else to do today. Stripe emails your receipt separately.`, '',
    `System: ${i.systemName}`, `Install day: ${day} (${i.window.toLowerCase()})`, `Where: ${i.address}`, `You paid: ${paid} installed, tax included`, '',
    'WHAT HAPPENS NEXT',
    `1. Today: you're booked. Your day is held and your payment is in.`,
    `2. By end of day ${by}: we text you to confirm your arrival time. Reply if it doesn't work.`,
    `3. ${day}: a licensed local plumber installs it in about 4 hours, tests it, and walks you through it.`, '',
    'BEFORE INSTALL DAY', '- Clear a little space around where your main water line comes into the house.', '- Have someone 18 or older home.', '- Expect the water to be off for part of the visit.', '',
    `${STORE.refund} Need to change your day or cancel? Reply to this email or text ${PHONE}.`, '',
    `US Water Pros, ${STORE.local}. ${i.supportEmail}`,
  ].join('\n');
  return { subject: "You're in. Here's what happens next.", html, text };
}
