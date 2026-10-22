// Owner alerts. Email through SendGrid (the same settings the lead email uses) and, if all four Twilio settings exist, a text too.
// Every step is best effort: a failed alert never blocks an order.
export async function sendAlert(subject: string, text: string) {
  const { SENDGRID_API_KEY: key, ADMIN_NOTIFY_EMAIL: to, TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_FROM: from, OWNER_MOBILE: mobile } = process.env;
  if (key && to) {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalizations: [{ to: [{ email: to }] }], from: { email: to }, subject, content: [{ type: 'text/plain', value: text }] }),
    }).catch((e) => console.error('sendgrid', e));
  }
  if (sid && token && from && mobile) {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: from, To: mobile, Body: `${subject}. ${text}`.slice(0, 300) }),
    }).catch((e) => console.error('twilio', e));
  }
}
