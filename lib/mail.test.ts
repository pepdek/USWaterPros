import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendMail } from './mail';

const ENV = ['RESEND_API_KEY', 'ALERT_FROM_EMAIL', 'SENDGRID_API_KEY', 'ADMIN_NOTIFY_EMAIL'];
afterEach(() => { vi.unstubAllGlobals(); for (const k of ENV) delete process.env[k]; });
const fetchOk = () => { const f = vi.fn(async () => new Response('{}', { status: 200 })); vi.stubGlobal('fetch', f); return f; };

describe('owner email', () => {
  it('does nothing without a recipient', async () => { const f = fetchOk(); process.env.RESEND_API_KEY = 'x'; expect(await sendMail('s', 't')).toBe('none'); expect(f).not.toHaveBeenCalled(); });
  it('uses Resend when its key and a from address are set', async () => {
    const f = fetchOk(); Object.assign(process.env, { RESEND_API_KEY: 'k', ALERT_FROM_EMAIL: 'alerts@mail.example.com', ADMIN_NOTIFY_EMAIL: 'me@example.com', SENDGRID_API_KEY: 'sg' });
    expect(await sendMail('Hi', 'Body')).toBe('resend');
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(JSON.parse(String(init.body))).toEqual({ from: 'alerts@mail.example.com', to: ['me@example.com'], subject: 'Hi', text: 'Body' });
  });
  it('needs the from address: Resend key alone falls back to SendGrid', async () => {
    const f = fetchOk(); Object.assign(process.env, { RESEND_API_KEY: 'k', ADMIN_NOTIFY_EMAIL: 'me@example.com', SENDGRID_API_KEY: 'sg' });
    expect(await sendMail('s', 't')).toBe('sendgrid'); expect((f.mock.calls[0] as unknown as [string])[0]).toContain('sendgrid');
  });
  it('a failed send never throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network'); }));
    Object.assign(process.env, { RESEND_API_KEY: 'k', ALERT_FROM_EMAIL: 'a@b.com', ADMIN_NOTIFY_EMAIL: 'me@example.com' });
    await expect(sendMail('s', 't')).resolves.toBe('resend');
  });
});
