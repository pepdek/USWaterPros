import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Runs against the production build (`npm run build` first). Skipped if there is no build output.
const ROOT = path.resolve(__dirname, '..', '.next', 'server', 'app');
const BANNED = ['from $2,700', '$2,700', '$2,699', '$2,199', '$1,800', '$899', '$1,200', '$4,000'];

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}
// BUILD_ID only exists after `next build` (the dev server's .next is not a production build).
const exists = fs.existsSync(path.resolve(__dirname, '..', '.next', 'BUILD_ID')) && fs.existsSync(ROOT);

describe.skipIf(!exists)('built output (HTML, RSC payloads and JSON-LD)', () => {
  const targets = exists ? files(ROOT).filter((f) => /\.(html|rsc|body)$/.test(f)) : [];
  it('finds built pages', () => { expect(targets.length).toBeGreaterThan(10); });
  it('contains none of the retired prices', () => {
    for (const f of targets) {
      const text = fs.readFileSync(f, 'utf8').replace(/\\u0024/g, '$');
      for (const b of BANNED) expect(text, `${b} in ${path.relative(ROOT, f)}`).not.toContain(b);
    }
  });
  it('shows the flagship price and tax note on the flagship page', () => {
    const html = fs.readFileSync(path.join(ROOT, 'services', 'whole-home-water-filtration.html'), 'utf8');
    expect(html).toContain('$2,999');
    expect(html).toContain('tax included');
    expect(html).toMatch(/"price":2999/);
  });
});
