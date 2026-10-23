import { sendMail } from './mail';

// Owner alerts. Email through lib/mail.ts (Resend or SendGrid) and, if all four Twilio settings exist, a text too.
// Every step is best effort: a failed alert never blocks an order.
export async function sendAlert(subject: string, text: string) {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_FROM: from, OWNER_MOBILE: mobile } = process.env;
  await sendMail(subject, text);
  if (sid && token && from && mobile) {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: from, To: mobile, Body: `${subject}. ${text}`.slice(0, 300) }),
    }).catch((e) => console.error('twilio', e));
  }
}
