// Writes docs/email-previews/*.html so you can open an email in a browser. Run: npx vite-node scripts/email-preview.ts
import fs from 'node:fs';
import { orderConfirmed } from '../lib/emails/orderConfirmed';
import { confirmDeadline } from '../lib/confirmBy';

const paidAt = new Date('2026-10-23T20:36:39Z'); // a Friday
const m = orderConfirmed({ name: 'Jordan Rivera', systemName: 'Complete', installDate: '2026-11-03', window: 'Morning', address: '1420 Sample Ave, Tacoma, WA 98402', chargedCents: 299900, confirmBy: confirmDeadline(paidAt), supportEmail: 'support@uswaterpros.com' });
fs.writeFileSync('docs/email-previews/1-order-confirmed.html', m.html);
fs.writeFileSync('docs/email-previews/1-order-confirmed.txt', `Subject: ${m.subject}\n\n${m.text}\n`);
console.log('written');
