import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';

const PAGES = ['/', '/services/whole-home-water-filtration', '/services/whole-home-water-filtration-tacoma'];
const FORBIDDEN = [
  '$2,699', '$699', '$949', 'Join the families', 'toxic cocktail', 'crumbling', '100% satisfaction guarantee', 'same-day quote',
  'licensed technician', 'our technicians', 'our licensed installers', 'Last updated: September 30, 2026', 'Get Free Water Report', 'within 1 hour',
];
const reviews = JSON.parse(fs.readFileSync('data/reviews.json', 'utf8')) as unknown[];

const schemaText = (page: Page) => page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => x.textContent).join('\n'));

for (const path of PAGES) {
  test.describe(path, () => {
    test('no forbidden strings in the rendered page', async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator('body').innerText()).toLowerCase() + '\n' + (await page.content()).toLowerCase();
      for (const f of FORBIDDEN) expect(text, `found "${f}"`).not.toContain(f.toLowerCase());
    });

    test('has a tel: link and one primary CTA label', async ({ page }) => {
      await page.goto(path);
      expect(await page.locator('a[href^="tel:"]').count()).toBeGreaterThan(0);
      const labels = new Set(await page.$$eval('.btn-cta', (b) => b.map((x) => (x.textContent || '').trim())));
      expect([...labels], 'more than one primary CTA').toEqual(['Get My Fixed Price']);
    });

    test('schema has no aggregateRating while reviews are empty', async ({ page }) => {
      await page.goto(path);
      const s = await schemaText(page);
      expect(s).toContain('LocalBusiness');
      if (!reviews.length) expect(s).not.toContain('aggregateRating');
    });

    test('title and meta description lengths', async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      const desc = (await page.locator('meta[name="description"]').getAttribute('content')) || '';
      expect(title.length, title).toBeLessThanOrEqual(75); // the spec-supplied home title is 71 characters
      expect(desc.length, desc).toBeLessThanOrEqual(155);
      expect(desc.length).toBeGreaterThan(60);
    });

    for (const vp of [{ w: 1280, h: 800 }, { w: 390, h: 844 }]) {
      test(`form is in the first viewport and no sideways scroll at ${vp.w}px`, async ({ page }) => {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(path);
        const first = page.locator('#quote input:not([type=hidden])').first();
        await first.waitFor();
        const box = (await first.boundingBox())!;
        expect(box.y + box.height, 'first form field is below the fold').toBeLessThanOrEqual(vp.h);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      });
    }

    test('form blocks submit when name, mobile or ZIP is missing', async ({ page }) => {
      let posted = false;
      await page.route('**/api/leads', (r) => { posted = true; return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
      await page.goto(path);
      await page.locator('#quote').getByRole('button', { name: 'Get My Fixed Price' }).click();
      await expect(page.locator('#quote [role="alert"]')).toHaveCount(3);
      expect(posted).toBe(false);
    });

    test('valid submit posts and goes to /thanks', async ({ page }) => {
      let body: Record<string, string> = {};
      await page.route('**/api/leads', (r) => { body = r.request().postDataJSON(); return r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"success":true}' }); });
      await page.goto(path);
      const f = page.locator('#quote');
      await f.getByLabel('Name').fill('QA-DEMO Playwright');
      await f.getByLabel('Mobile').fill('2535550199');
      await f.getByLabel('ZIP code').fill('98402');
      await f.getByLabel('Home built year').selectOption('Before 1986');
      await f.getByRole('button', { name: 'Get My Fixed Price' }).click();
      await page.waitForURL('**/thanks');
      expect(body).toMatchObject({ name: 'QA-DEMO Playwright', phone: '2535550199', zip_code: '98402', home_built: 'Before 1986', form_variant: 'hero' });
      await expect(page.getByText('We\'ll call you within 10 minutes')).toBeVisible();
    });
  });
}

test('/thanks is noindex and has a tel: link', async ({ page }) => {
  await page.goto('/thanks');
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
  expect(await page.locator('a[href^="tel:"]').count()).toBeGreaterThan(0);
});

test('forbidden strings are also absent from /thanks', async ({ page }) => {
  await page.goto('/thanks');
  const text = (await page.content()).toLowerCase();
  for (const f of FORBIDDEN) expect(text).not.toContain(f.toLowerCase());
});
