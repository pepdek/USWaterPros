import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { badOrigin, rateLimited } from './guard';

const req = (headers: Record<string, string> = {}) => new NextRequest('https://uswaterpros.com/api/leads', { method: 'POST', headers });

describe('spam guard', () => {
  it('allows up to the limit, then blocks, per IP and bucket', () => {
    const a = () => req({ 'x-forwarded-for': '9.9.9.9' });
    const now = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimited(a(), 't1', 3, 60_000, now + i)).toBe(false);
    expect(rateLimited(a(), 't1', 3, 60_000, now + 4)).toBe(true);
    expect(rateLimited(req({ 'x-forwarded-for': '8.8.8.8' }), 't1', 3, 60_000, now + 5)).toBe(false); // other IP
    expect(rateLimited(a(), 't2', 3, 60_000, now + 6)).toBe(false); // other bucket
    expect(rateLimited(a(), 't1', 3, 60_000, now + 120_000)).toBe(false); // window passed
  });
  it('refuses a foreign Origin, allows our own and a missing one', () => {
    expect(badOrigin(req({ origin: 'https://evil.example' }))).toBe(true);
    expect(badOrigin(req({ origin: 'https://uswaterpros.com' }))).toBe(false);
    expect(badOrigin(req({ origin: 'https://evil.netlify.app' }))).toBe(true);
    expect(badOrigin(req())).toBe(false);
  });
});
