import { PHONE } from '../constants';
import { formatUSD } from '../pricing';
import { STORE } from '../store';

// Email 1 of the customer series: sent the moment a payment clears.
// Design: the site's Americana look in an inbox: serif date, flag-red button, a star wordmark, warm paper.
// Layout: an Apple-style order status. The install day is the hero, a three-dot progress line, a frosted card for the details, one quiet button.
// Email clients ignore most CSS, so: tables + inline styles, solid fallbacks under every gradient and translucent fill (Apple Mail and iOS show the glass,
// others show clean white), and a dark-mode block for clients that support it. VERIFY before sending to customers: the prep list and "about 4 hours".
export type OrderConfirmedInput = { name: string; orderRef: string; systemName: string; installDate: string; window: string; address: string; chargedCents: number; confirmBy: Date; supportEmail: string };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const TZ = 'America/Los_Angeles';
const fmtUTC = (iso: string, o: Intl.DateTimeFormatOptions) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { ...o, timeZone: 'UTC' });
export const firstName = (n: string) => { const f = n.trim().split(/\s+/)[0]; return f ? f.replace(/^./, (c) => c.toUpperCase()) : 'there'; };
export const orderRef = (id: string) => id.replace(/[^0-9a-z]/gi, '').slice(-6).toUpperCase();

const F = `-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Helvetica,Arial,sans-serif`;
const D = `'Iowan Old Style','Palatino Linotype',Georgia,serif`; // stands in for Fraunces, which email clients cannot load
const S = `'Barlow Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif`; // highway-sign caps where available
const C = { ink: '#101c2e', gray: '#5b6472', line: '#e6dfcf', red: '#b3202a' };

export function orderConfirmed(i: OrderConfirmedInput) {
  const name = firstName(i.name), ref = esc(i.orderRef);
  const dayShort = fmtUTC(i.installDate, { weekday: 'short', month: 'short', day: 'numeric' }), dayLong = fmtUTC(i.installDate, { weekday: 'long', month: 'long', day: 'numeric' });
  const by = i.confirmBy.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: TZ });
  const byShort = i.confirmBy.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: TZ });
  const paid = formatUSD(i.chargedCents / 100), win = i.window.toLowerCase();
  const subject = `You're booked for ${dayShort}`;
  const pre = `Nothing left to do today. Here's what happens next.`;

  const seg = (cls: string, color: string, show: boolean) => `<td width="50%" valign="middle" style="padding:0">${show ? `<div class="${cls}" style="height:2px;line-height:2px;font-size:0;background:${color}">&nbsp;</div>` : ''}</td>`;
  const dot = (on: boolean, label: string, first = false, last = false) => `<td align="center" width="33%" style="padding:0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
${seg(on ? 'ln-on' : 'ln', on ? C.ink : C.line, !first)}
<td style="width:14px;padding:0" align="center"><div class="${on ? 'dot-on' : 'dot'}" style="width:14px;height:14px;border-radius:7px;background:${on ? C.ink : '#fff'};border:2px solid ${on ? C.ink : C.line};font-size:0;line-height:0">&nbsp;</div></td>
${seg('ln', C.line, !last)}</tr></table>
<div class="${on ? 't' : 'g'}" style="margin-top:10px;font:${on ? 600 : 500} 12px/1.3 ${F};color:${on ? C.ink : C.gray}">${label}</div></td>`;
  const row = (k: string, v: string, last = false) => `<tr><td class="hair" style="padding:14px 0;${last ? '' : `border-bottom:1px solid ${C.line};`}font:14px/1.4 ${F};color:${C.gray};width:34%" valign="top"><span class="g">${k}</span></td><td class="hair" style="padding:14px 0;${last ? '' : `border-bottom:1px solid ${C.line};`}font:15px/1.45 ${F};color:${C.ink};text-align:right" valign="top"><span class="t">${v}</span></td></tr>`;
  const todo = (h: string, b: string) => `<tr><td style="padding:0 0 16px 0;font:16px/1.5 ${F};color:${C.ink}"><b class="t" style="font-weight:600">${h}</b> <span class="g" style="color:${C.gray}">${b}</span></td></tr>`;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${esc(subject)}</title>
<style>
@media (prefers-color-scheme: dark){
  .page{background:#000 !important;background-image:none !important}
  .glass{background:#1c1c1e !important;border-color:#2c2c2e !important;box-shadow:none !important}
  .t{color:#f5f5f7 !important} .g{color:#98989f !important}
  .hair{border-color:#2c2c2e !important} .ln{background:#3a3a3c !important} .ln-on{background:#f5f5f7 !important}
  .dot{background:#1c1c1e !important;border-color:#3a3a3c !important} .dot-on{background:#f5f5f7 !important;border-color:#f5f5f7 !important}
  .chip{background:#2c2c2e !important}
}
@media (max-width:480px){ .pad{padding-left:22px !important;padding-right:22px !important} .big{font-size:48px !important} }
</style></head>
<body style="margin:0;padding:0;background:#f6f3ea">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f6f3ea">${esc(pre)}&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;</div>
<table role="presentation" class="page" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f6f3ea" style="background:#f6f3ea;background-image:radial-gradient(520px 320px at 12% 0%,#cfe4f4 0%,rgba(207,228,244,0) 70%),radial-gradient(420px 300px at 100% 18%,#f6d9d2 0%,rgba(246,217,210,0) 70%),linear-gradient(#f6f3ea,#fbf8f1)"><tr><td align="center" style="padding:28px 14px 40px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px">
<tr><td class="pad" style="padding:0 6px 22px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font:800 22px ${S};letter-spacing:.04em;text-transform:uppercase;color:${C.ink}"><span style="color:${C.red};font-size:15px">&#9733;</span> <span class="t">US Water Pros</span></td>
<td align="right" style="font:500 12px ${F};letter-spacing:.06em;color:${C.gray}"><span class="g">ORDER #${ref}</span></td></tr></table></td></tr>

<tr><td class="glass" bgcolor="#ffffff" style="background:#ffffff;background:rgba(255,255,255,.78);-webkit-backdrop-filter:saturate(180%) blur(24px);backdrop-filter:saturate(180%) blur(24px);border:1px solid #ffffff;border-radius:28px;box-shadow:0 24px 60px -24px rgba(11,37,48,.28)">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td class="pad" style="padding:40px 36px 6px">
<div class="g" style="font:500 15px/1.3 ${F};color:${C.gray}">You're booked, ${esc(name)}.</div>
<div class="big t" style="margin:10px 0 0;font:700 58px/1 ${D};letter-spacing:-.03em;color:${C.ink}">${esc(dayShort)}</div>
<div class="g" style="margin:12px 0 0;font:500 17px/1.4 ${F};color:${C.gray}">${esc(win.charAt(0).toUpperCase() + win.slice(1))} install, about 4 hours.</div>
</td></tr>
<tr><td class="pad" style="padding:30px 36px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${dot(true, 'Booked', true)}${dot(false, 'Time confirmed')}${dot(false, 'Installed', false, true)}</tr></table></td></tr>
<tr><td class="pad" style="padding:26px 36px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="chip" bgcolor="#f4efe4" style="background:#f4efe4;border-radius:16px"><tr><td style="padding:16px 18px;font:15px/1.5 ${F};color:${C.ink}"><b class="t" style="font-weight:600">Next:</b> <span class="t">we text you the exact arrival time by ${esc(byShort)}.</span> <span class="g" style="color:${C.gray}">If it doesn't work, just reply and we'll move it.</span></td></tr></table></td></tr>
<tr><td class="pad" style="padding:30px 36px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="hair" style="border-top:1px solid ${C.line}">${row('System', esc(i.systemName))}${row('Where', esc(i.address))}${row('Paid', `${paid}, installed, tax included`, true)}</table>
<div class="g" style="padding:2px 0 0;font:12px/1.5 ${F};color:${C.gray}">Stripe sends your receipt separately.</div></td></tr>
<tr><td class="pad" style="padding:34px 36px 0"><div class="t" style="margin:0 0 14px;font:700 22px/1.2 ${D};letter-spacing:-.01em;color:${C.ink}">Two minutes of prep</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${todo('Make a little room', 'around where the main water line comes into the house.')}${todo('Be around.', 'Someone 18 or older should be home.')}${todo('Heads up:', 'the water goes off for part of the visit.')}</table></td></tr>
<tr><td class="pad" align="left" style="padding:12px 36px 0"><a class="btn" href="sms:+12537770901" style="display:inline-block;background:${C.red};color:#ffffff;font:700 16px ${F};text-decoration:none;padding:14px 28px;border-radius:980px">Text us</a>
<div class="g" style="margin:14px 0 0;font:14px ${F};color:${C.gray}">Or hit reply. A human answers.</div></td></tr>
<tr><td class="pad" style="padding:30px 36px 38px"><div class="g" style="font:14px/1.6 ${F};color:${C.gray}">${esc(STORE.refund)} Plans changed? Say the word and we'll sort it, no hoops.<br><br><span class="t" style="color:${C.ink}">Talk soon,<br>The US Water Pros crew</span></div></td></tr>
</table></td></tr>

<tr><td class="pad" style="padding:22px 12px 0;font:12px/1.7 ${F};color:${C.gray};text-align:center"><span class="g">US Water Pros &middot; ${esc(STORE.local)}<br>${esc(PHONE)} &middot; <a href="mailto:${esc(i.supportEmail)}" style="color:${C.gray}">${esc(i.supportEmail)}</a><br>You're getting this because you ordered at uswaterpros.com.</span></td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `You're booked, ${name}.`, '', `${dayLong} · ${win} install, about 4 hours.`, '',
    `NEXT: we text you the exact arrival time by end of day ${by}. If it doesn't work, just reply and we'll move it.`, '',
    `Order #${i.orderRef}`, `System: ${i.systemName}`, `Where: ${i.address}`, `Paid: ${paid}, installed, tax included (Stripe sends your receipt separately)`, '',
    'TWO MINUTES OF PREP', '- Make a little room around where the main water line comes into the house.', '- Be around. Someone 18 or older should be home.', '- Heads up: the water goes off for part of the visit.', '',
    `Questions? Text ${PHONE} or just reply. A human answers.`, `${STORE.refund} Plans changed? Say the word and we'll sort it.`, '',
    'Talk soon,', 'The US Water Pros crew', '', `${STORE.local} · ${i.supportEmail}`,
  ].join('\n');
  return { subject, html, text };
}
